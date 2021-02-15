require('dotenv').config();

const DB_URL = process.env.NODE_ENV === 'test' ? process.env.DATABASE_TEST_URL: process.env.DATABASE_URL;

module.exports = {
  postgresdb: {
    url: DB_URL,
    options: {
      dialect: "postgres",
      dialectOptions: {
        multipleStatements: true,
        ssl: true,
        rejectUnauthorized: true
      }
    }
  }
};