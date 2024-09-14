import db from '../config/database.js';

class EmailStats {
  static async recordEmailSent(email, subject, message, listId) {
    const query = `
      INSERT INTO email_stats (email, subject, message, list_id, sent_at)
      VALUES (?, ?, ?, ?, NOW())
    `;
    await db.query(query, [email, subject, message, listId]);
  }

  static async getEmailStats() {
    const [rows] = await db.query('SELECT * FROM email_stats');
    return rows;
  }

  static async getTotalEmailsSent() {
    const [[{ total }]] = await db.query('SELECT COUNT(*) as total FROM email_stats');
    return total;
  }

  static async getTotalEmailsOpened() {
    const [[{ total }]] = await db.query('SELECT COUNT(*) as total FROM email_stats WHERE opened = 1');
    return total;
  }

  static async getTotalClicks() {
    const [[{ total }]] = await db.query('SELECT COUNT(*) as total FROM email_stats WHERE clicked = 1');
    return total;
  }

  static async getTotalRejected() {
    const [[{ total }]] = await db.query('SELECT COUNT(*) as total FROM email_stats WHERE rejected = 1');
    return total;
  }

  // Função para obter o total de emails enviados por assunto (campanha)
  static async getTotalEmailsSentBySubject(subject) {
    const [[{ totalSent }]] = await db.query('SELECT COUNT(*) as totalSent FROM email_stats WHERE subject = ?', [subject]);
    return totalSent;
  }

  // Função para obter o total de emails abertos por assunto (campanha)
  static async getTotalEmailsOpenedBySubject(subject) {
    const [[{ totalOpened }]] = await db.query('SELECT COUNT(*) as totalOpened FROM email_stats WHERE subject = ? AND opened = 1', [subject]);
    return totalOpened;
  }

  // Função para obter o total de cliques por assunto (campanha)
  static async getTotalClicksBySubject(subject) {
    const [[{ totalClicks }]] = await db.query('SELECT COUNT(*) as totalClicks FROM email_stats WHERE subject = ? AND clicked = 1', [subject]);
    return totalClicks;
  }

  // Função para obter o total de emails rejeitados por assunto (campanha)
  static async getTotalRejectedBySubject(subject) {
    const [[{ totalRejected }]] = await db.query('SELECT COUNT(*) as totalRejected FROM email_stats WHERE subject = ? AND rejected = 1', [subject]);
    return totalRejected;
  }

  // Função para registrar a abertura de um email
  static async recordOpened(email) {
    const query = `
      UPDATE email_stats
      SET opened = 1
      WHERE email = ? AND opened = 0
    `;
    const [result] = await db.query(query, [email]);
    console.log(`Abertura registrada para o email: ${email}`);
    return result;
  }

  // Função para registrar um clique em um email
  static async recordClicked(email) {
    const query = `
      UPDATE email_stats
      SET clicked = 1
      WHERE email = ? AND clicked = 0
    `;
    const [result] = await db.query(query, [email]);
    console.log(`Clique registrado para o email: ${email}`);
    return result;
  }
}

export default EmailStats;
