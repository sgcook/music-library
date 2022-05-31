const mysql = require('mysql2');
const path = require('path');

require('dotenv').config({
  path: path.join(__dirname, '../.env.test'),
});

const { DB_PASSWORD, DB_NAME, DB_USER, DB_HOST, DB_PORT } = process.env;

const connection = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  port: DB_PORT,
});

connection.query(`DROP DATABASE ${DB_NAME}`, () => connection.end());

// const connectToDatabase = async () => {
//   try {
//     const db = await mysql.createConnection({
//       host: DB_HOST,
//       user: DB_USER,
//       password: DB_PASSWORD,
//       port: DB_PORT,
//     });
//     await db.query(`DROP DATABASE ${DB_NAME}`, () => db.end());
//   } catch (err) {
//     console.log(`Your environment variables might be wrong. Please double check .env file`);
//   }
// }

// connectToDatabase();