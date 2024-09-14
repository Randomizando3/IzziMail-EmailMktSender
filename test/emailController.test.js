import sinon from 'sinon';
import nodemailer from 'nodemailer';
import chai from 'chai';
import chaiHttp from 'chai-http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import app from '../app.js';

chai.use(chaiHttp);
const { expect } = chai;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Email Controller Tests', () => {
  let sendMailStub;
  let transportStub;

  beforeEach(() => {
    // Simula o transporte de e-mail
    const transport = {
      sendMail: sinon.stub().resolves(true),
    };

    // Substitui o createTransport para retornar o stub de transporte
    transportStub = sinon.stub(nodemailer, 'createTransport').returns(transport);
  });

  afterEach(() => {
    // Restaura o comportamento original do createTransport
    transportStub.restore();
  });

  // Teste de importação de e-mails via CSV
  it('Deve importar emails do CSV com sucesso', function (done) {
    this.timeout(10000);  // Aumenta o timeout para garantir tempo suficiente

    chai.request(app)
      .post('/emails/import')
      .attach('file', fs.readFileSync(path.join(__dirname, 'emails.csv')), 'emails.csv')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message').eql('Emails importados com sucesso!');
        done();
      });
  });

  // Teste de envio de e-mails
  it('Deve enviar emails com sucesso', function (done) {
    this.timeout(20000);  // Aumenta o timeout para garantir tempo suficiente

    chai.request(app)
      .post('/emails/send')
      .send({
        senderName: 'Cadastro de empresas',
        senderEmail: 'admin@cadastrodeempresas.com',
        subject: 'Assunto de Teste',
        listId: 1, // ID fictício de lista
        message: 'Olá {nome}, seu telefone é {telefone}.',
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message').eql('Emails enviados com sucesso!');
        done();
      });
  });
});
