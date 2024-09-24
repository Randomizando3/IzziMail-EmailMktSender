import nodemailer from 'nodemailer';
import fs from 'fs';
import csv from 'csv-parser';
import EmailList from '../models/emailList.js';
import EmailListRecipients from '../models/emailListRecipients.js';
import EmailStats from '../models/emailStats.js';

// Variável para armazenar o progresso e horários de término estimados
let sendingProgress = {};
let estimatedEndTimes = {};

// Configura o transporte SMTP
const transporter = nodemailer.createTransport({
  host: 'localhost',
  port: 25,
  secure: false,
  auth: {
    user: 'root',
    pass: 'senhadoroot',
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Função para transformar links em tags <a> em links rastreáveis
function trackLinksInAnchorTags(htmlContent, email) {
  const linkPattern = /<a\s+(?:[^>]*?\s+)?href="(https?:\/\/[^"]+)"/g;

  return htmlContent.replace(linkPattern, (match, url) => {
    const encodedUrl = encodeURIComponent(url);
    return match.replace(url, `https://cadastrodeempresas.com/emails/clicked?email=${encodeURIComponent(email)}&url=${encodedUrl}`);
  });
}

// Função para validar e-mails
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Função para enviar e-mails
export async function sendEmails(req, res) {
  const { senderName, senderEmail, subject, message, listId } = req.body;

  if (estimatedEndTimes[listId] && new Date() < estimatedEndTimes[listId]) {
    return res.status(400).json({
      message: `Envio em andamento. O próximo envio só poderá ser iniciado após ${estimatedEndTimes[listId].toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`
    });
  }

  try {
    const recipients = await EmailListRecipients.getRecipientsByListId(listId);

    if (recipients.length === 0) {
      return res.status(400).json({ message: 'Nenhum destinatário na lista selecionada.' });
    }

    const totalSeconds = recipients.length * 3; // 3 segundos por email
    const estimatedEndTime = new Date();
    estimatedEndTime.setSeconds(estimatedEndTime.getSeconds() + totalSeconds);
    estimatedEndTimes[listId] = estimatedEndTime;

    let lastSentIndex = sendingProgress[listId] || 0;

    for (let i = lastSentIndex; i < recipients.length; i++) {
      const email = recipients[i];

      // Validação do destinatário
      if (!email.email || email.email.trim() === '' || !validateEmail(email.email)) {
        console.error(`Email inválido ou vazio para o destinatário: ${email.first_name} ${email.last_name}`);
        continue; // Pular este destinatário e continuar para o próximo
      }

      let personalizedMessage = message
        .replace(/{first_name}/g, email.first_name || '')
        .replace(/{last_name}/g, email.last_name || '')
        .replace(/{email}/g, email.email || '')
        .replace(/{phone}/g, email.phone || '');

      personalizedMessage = trackLinksInAnchorTags(personalizedMessage, email.email);

      const trackingPixel = `<img src="https://cadastrodeempresas.com/emails/opened?email=${encodeURIComponent(email.email)}&t=${new Date().getTime()}" width="1" height="1" style="display:none;" />`;

      const finalMessage = `${personalizedMessage}${trackingPixel}`;

      console.log(`Enviando email para: ${email.email}`);
      console.log(`Conteúdo do email (HTML): ${finalMessage}`);

      const mailOptions = {
        from: `${senderName} <${senderEmail}>`,
        to: email.email,
        subject,
        html: finalMessage,
      };

      try {
        // Enviar o email
        await transporter.sendMail(mailOptions);

        // Registrar o email enviado no banco de dados
        await EmailStats.recordEmailSent(email.email, subject, finalMessage, listId);

      } catch (error) {
        console.error(`Erro ao enviar email para ${email.email}: ${error.message}`);
      }

      // Atualiza o progresso de envio
      sendingProgress[listId] = i;

      // Atraso para limitar o envio
      await new Promise((r) => setTimeout(r, 3000));
    }

    sendingProgress[listId] = 0;
    estimatedEndTimes[listId] = null;

    res.status(200).json({ message: 'Emails enviados com sucesso!' });
  } catch (error) {
    console.error("Erro durante o envio de emails:", error);
    res.status(500).json({ message: 'Erro ao enviar emails.' });
  }
}

// Função para registrar a abertura de emails
export async function registerOpened(req, res) {
  const { email } = req.query;

  try {
    console.log(`Registro de abertura para o email: ${email}`);

    const result = await EmailStats.recordOpened(email);
    console.log("Abertura registrada:", result);

    const pixelPath = './public/assets/pixel.png';
    fs.readFile(pixelPath, (err, data) => {
      if (err) {
        console.error("Erro ao carregar o pixel:", err);
        return res.status(500).end();
      }
      res.writeHead(200, { 'Content-Type': 'image/png' });
      res.end(data);
    });
  } catch (error) {
    console.error("Erro ao registrar abertura de email:", error);
    res.status(500).json({ message: 'Erro ao registrar abertura de email.' });
  }
}

// Função para registrar cliques em emails
export async function registerClicked(req, res) {
  const { email, url } = req.query;

  try {
    console.log(`Registro de clique para o email: ${email}, URL: ${url}`);

    const result = await EmailStats.recordClicked(email);
    console.log("Clique registrado:", result);

    const decodedUrl = decodeURIComponent(url);

    res.redirect(decodedUrl);
  } catch (error) {
    console.error("Erro ao registrar clique em email:", error);
    res.status(500).json({ message: 'Erro ao registrar clique em email.' });
  }
}

// Função para importar emails via CSV
export async function importCSV(req, res) {
  const emails = [];
  const { listId } = req.body;

  if (!listId) {
    return res.status(400).json({ message: 'ID da lista é obrigatório.' });
  }

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (row) => {
      const { first_name, last_name, email, phone } = row;

      // Validação de email
      if (validateEmail(email)) {
        emails.push({ first_name, last_name, email, phone });
      } else {
        console.error(`Email inválido encontrado e ignorado: ${email}`);
      }
    })
    .on('end', async () => {
      try {
        for (const contact of emails) {
          const { first_name, last_name, email, phone } = contact;

          if (!email) {
            console.error('Erro: Email faltando para contato:', contact);
            continue;
          }

          await EmailListRecipients.addRecipientToList(listId, first_name, last_name, email, phone);
        }

        res.status(200).json({ message: 'Emails importados com sucesso!' });
      } catch (error) {
        console.error("Erro durante a importação de emails:", error);
        res.status(500).json({ message: 'Erro ao importar emails.' });
      }
    })
    .on('error', (error) => {
      console.error("Erro ao ler o arquivo CSV:", error);
      res.status(500).json({ message: 'Erro ao ler o arquivo CSV.' });
    });
}

// Função para obter o progresso de envio
export async function getProgress(req, res) {
  const { listId } = req.query;

  if (!sendingProgress[listId]) {
    return res.status(200).json({ progress: 0 });
  }

  const recipients = await EmailListRecipients.getRecipientsByListId(listId);
  const progress = (sendingProgress[listId] / recipients.length) * 100;

  res.status(200).json({ progress });
}

// Função para verificar o status de envio
export async function checkSendingStatus(req, res) {
  const { listId } = req.query;

  if (estimatedEndTimes[listId] && new Date() < estimatedEndTimes[listId]) {
    return res.status(200).json({
      sending: true,
      estimatedEndTime: estimatedEndTimes[listId].toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  }

  return res.status(200).json({ sending: false });
}
