import mysql from 'mysql2';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'senhadoroot',
  database: 'database',
});

export default pool.promise();
