import db from '../config/database.js';

class EmailList {
  // Função para obter todas as listas de emails (limite de 10)
  static async getAllLists() {
    const query = `
      SELECT email_lists.*, 
      (SELECT COUNT(*) FROM email_list_recipients WHERE email_list_recipients.list_id = email_lists.id) AS email_count
      FROM email_lists LIMIT 10
    `;
    const [lists] = await db.execute(query);
    return lists;
  }

  // Função para buscar os contatos de uma lista específica
  static async getListRecipients(listId) {
    const query = 'SELECT first_name, last_name, email, phone FROM email_list_recipients WHERE list_id = ?';
    const [recipients] = await db.execute(query, [listId]);
    return recipients;
  }

  // Função para criar uma nova lista
  static async createList(name) {
    const query = 'INSERT INTO email_lists (name) VALUES (?)';
    const [result] = await db.execute(query, [name]);
    return result;
  }

  // Função para deletar uma lista
  static async deleteList(id) {
    const query = 'DELETE FROM email_lists WHERE id = ?';
    const [result] = await db.execute(query, [id]);
    return result;
  }

  // Função para buscar uma lista pelo ID
  static async getListById(id) {
    const query = 'SELECT * FROM email_lists WHERE id = ?';
    const [list] = await db.execute(query, [id]);
    return list.length ? list[0] : null;
  }
}

export default EmailList;
