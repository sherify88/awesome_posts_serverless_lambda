require('dotenv').config();

module.exports = {
  development: {
    dialect: 'postgres',
    host: process.env.ENVIRON_DB_HOST,
    port: Number(process.env.ENVIRON_DB_PORT),
    username: process.env.ENVIRON_DB_USER,
    password: process.env.ENVIRON_DB_PWD,
    database: process.env.ENVIRON_DB_NAME,
    logging: false,
  },
  test: {
    dialect: 'postgres',
    host: process.env.ENVIRON_DB_HOST,
    port: Number(process.env.ENVIRON_DB_PORT),
    username: process.env.ENVIRON_DB_USER,
    password: process.env.ENVIRON_DB_PWD,
    database: process.env.ENVIRON_DB_NAME,
    logging: false,
  },
  production: {
    dialect: 'postgres',
    host: process.env.ENVIRON_DB_HOST,
    port: Number(process.env.ENVIRON_DB_PORT),
    username: process.env.ENVIRON_DB_USER,
    password: process.env.ENVIRON_DB_PWD,
    database: process.env.ENVIRON_DB_NAME,
    logging: false,
  },
};
