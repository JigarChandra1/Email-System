const config = require('./config');

const database = { url: config.postgresdb.url, dialect: config.postgresdb.options.dialect, 
    dialectOptions: config.postgresdb.options.dialectOptions, 
    logging: process.env.NODE_ENV === 'development' ? console.log : null};

const dbConfig = {};
dbConfig[process.env.NODE_ENV] = database;

module.exports = dbConfig;