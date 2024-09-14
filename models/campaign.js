import db from '../config/database.js';

const Campaign = {
  // Função para criar uma nova campanha com o assunto do email
  async createCampaign(subject) {
    const [result] = await db.query('INSERT INTO campaigns (subject, created_at) VALUES (?, NOW())', [subject]);
    return result.insertId; // Retorna o ID da nova campanha
  },

  // Obter todas as campanhas
  async getAllCampaigns() {
    const [campaigns] = await db.query('SELECT * FROM campaigns ORDER BY created_at DESC');
    return campaigns;
  },

  // Obter estatísticas de uma campanha específica
  async getCampaignStats(campaignId) {
    const [stats] = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM email_stats WHERE campaign_id = ? AND sent = TRUE) as totalSent,
        (SELECT COUNT(*) FROM email_stats WHERE campaign_id = ? AND opened = TRUE) as totalOpened,
        (SELECT COUNT(*) FROM email_stats WHERE campaign_id = ? AND clicked = TRUE) as totalClicks,
        (SELECT COUNT(*) FROM email_stats WHERE campaign_id = ? AND rejected = TRUE) as totalRejected
      `, [campaignId, campaignId, campaignId, campaignId]);
    return stats[0];
  },
};

export default Campaign;
