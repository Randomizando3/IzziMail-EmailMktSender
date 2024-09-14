import express from 'express';
import multer from 'multer';
import csv from 'csv-parser';
import fs from 'fs';
import EmailList from '../models/emailList.js';
import { sendEmails, registerOpened, registerClicked, getProgress } from '../controllers/emailController.js';
import EmailListRecipients from '../models/emailListRecipients.js';
import EmailStats from '../models/emailStats.js';
import db from '../config/database.js';

const router = express.Router();

// Configurar o Multer para uploads
const upload = multer({ dest: 'uploads/' });

// Rota para listar todas as listas de emails (máximo de 10)
router.get('/lists', async (req, res) => {
  try {
    const lists = await EmailList.getAllLists();
    res.status(200).json({ lists });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter as listas' });
  }
});

// Rota para enviar emails
router.post('/send-emails', sendEmails);

// Rota para listar todas as campanhas
router.get('/campaigns', async (req, res) => {
  try {
    const [campaigns] = await db.query(`
      SELECT subject, MAX(id) as max_id
      FROM email_stats
      WHERE subject IS NOT NULL
      GROUP BY subject
      ORDER BY max_id DESC
    `); // Agrupa as campanhas por subject e ordena pela campanha mais recente (id mais alto)

    res.status(200).json({ campaigns });
  } catch (error) {
    console.error('Erro ao obter as campanhas:', error);
    res.status(500).json({ message: 'Erro ao obter as campanhas.' });
  }
});

// Rota para criar uma nova lista
router.post('/lists', async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Nome da lista é obrigatório.' });
  }

  try {
    const lists = await EmailList.getAllLists();
    if (lists.length >= 10) {
      return res.status(400).json({ message: 'Limite de 10 listas alcançado.' });
    }

    await EmailList.createList(name);
    res.status(201).json({ message: 'Lista criada com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar a lista.' });
  }
});

// Rota para deletar uma campanha pelo subject
router.delete('/campaigns/:subject', async (req, res) => {
  const { subject } = req.params;

  try {
    // Excluir registros relacionados à campanha na tabela email_stats
    await db.query('DELETE FROM email_stats WHERE subject = ?', [subject]);

    res.status(200).json({ message: 'Campanha excluída com sucesso!' });
  } catch (error) {
    console.error('Erro ao excluir a campanha:', error);
    res.status(500).json({ message: 'Erro ao excluir a campanha.' });
  }
});

// Rota para deletar uma lista e seus contatos
router.delete('/lists/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM email_list_recipients WHERE list_id = ?', [id]);
    await EmailList.deleteList(id);

    res.status(200).json({ message: 'Lista e seus contatos excluídos com sucesso!' });
  } catch (error) {
    console.error('Erro ao excluir a lista e os contatos:', error);
    res.status(500).json({ message: 'Erro ao excluir a lista e seus contatos.' });
  }
});

// Rota para importar contatos CSV
router.post('/import-csv', upload.single('csv'), async (req, res) => {
  const { listId } = req.body;
  const filePath = req.file ? req.file.path : null;

  if (!listId) {
    return res.status(400).json({ message: 'ID da lista é obrigatório.' });
  }

  if (!filePath) {
    return res.status(400).json({ message: 'Arquivo CSV não foi enviado.' });
  }

  const contacts = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      contacts.push(row);
    })
    .on('end', async () => {
      try {
        for (const contact of contacts) {
          const { first_name, last_name, email, phone } = contact;

          if (!email) {
            continue;
          }

          await EmailListRecipients.addRecipientToList(listId, first_name, last_name, email, phone);
        }

        fs.unlinkSync(filePath);
        res.status(200).json({ message: 'Contatos importados com sucesso!' });
      } catch (error) {
        res.status(500).json({ message: 'Erro ao processar o CSV.' });
      }
    })
    .on('error', (error) => {
      res.status(500).json({ message: 'Erro ao ler o arquivo CSV.' });
    });
});

// Rota para buscar os contatos de uma lista com paginação
router.get('/lists/:id/recipients', async (req, res) => {
  const { id } = req.params;
  const limit = Number(req.query.limit) || 50;
  const page = Number(req.query.page) || 1;
  const offset = (page - 1) * limit;

  try {
    const [recipients] = await db.query(
      'SELECT first_name, last_name, email, phone FROM email_list_recipients WHERE list_id = ? LIMIT ? OFFSET ?',
      [id, parseInt(limit, 10), parseInt(offset, 10)]
    );

    const [[{ total }]] = await db.query(
      'SELECT COUNT(*) as total FROM email_list_recipients WHERE list_id = ?',
      [id]
    );

    res.status(200).json({
      recipients,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar os contatos da lista.' });
  }
});

// Rota para obter estatísticas de uma campanha específica
router.get('/campaigns/:subject/stats', async (req, res) => {
  const { subject } = req.params;

  try {
    const totalSent = await EmailStats.getTotalEmailsSentBySubject(subject);
    const totalOpened = await EmailStats.getTotalEmailsOpenedBySubject(subject);
    const totalClicks = await EmailStats.getTotalClicksBySubject(subject);
    const totalRejected = await EmailStats.getTotalRejectedBySubject(subject);

    res.status(200).json({
      totalSent,
      totalOpened,
      totalClicks,
      totalRejected,
    });
  } catch (error) {
    console.error('Erro ao obter estatísticas da campanha:', error);
    res.status(500).json({ message: 'Erro ao obter estatísticas da campanha.' });
  }
});

// Rota para registrar a abertura do email
router.get('/opened', registerOpened);

// Rota para registrar o clique em links
router.get('/clicked', registerClicked);

// Rota para obter o progresso de envio
router.get('/progress', getProgress);

// Rota para obter a contagem de destinatários de uma lista
router.get('/lists/:id/recipients/count', async (req, res) => {
  const { id } = req.params;

  try {
    const [[{ total }]] = await db.query(
      'SELECT COUNT(*) as total FROM email_list_recipients WHERE list_id = ?',
      [id]
    );

    res.status(200).json({ total });
  } catch (error) {
    console.error('Erro ao obter a contagem de destinatários:', error);
    res.status(500).json({ message: 'Erro ao obter a contagem de destinatários.' });
  }
});

// Rota para login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (email === 'admin@admin' && password === '12345678') {
    req.session.loggedIn = true; // Definir a sessão de login
    res.status(200).json({ message: 'Login bem-sucedido' });
  } else {
    res.status(401).json({ message: 'Email ou senha incorretos' });
  }
});

export default router;
