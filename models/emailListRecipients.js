import db from '../config/database.js';

class EmailListRecipients {
  // Função para adicionar um destinatário a uma lista
  static async addRecipientToList(listId, first_name, last_name, email, phone) {
    const query = `
      INSERT INTO email_list_recipients (list_id, first_name, last_name, email, phone)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(query, [listId, first_name, last_name, email, phone]);
    return result;
  }

  // Função para buscar destinatários por ID da lista
  static async getRecipientsByListId(listId) {
    const query = `
      SELECT first_name, last_name, email, phone
      FROM email_list_recipients
      WHERE list_id = ?
    `;
    const [recipients] = await db.query(query, [listId]);
    return recipients;
  }

  // Função para contar o número total de destinatários em uma lista
  static async getTotalRecipientsByListId(listId) {
    const query = `
      SELECT COUNT(*) as total
      FROM email_list_recipients
      WHERE list_id = ?
    `;
    const [[{ total }]] = await db.query(query, [listId]);
    return total;
  }
}

export default EmailListRecipients;
