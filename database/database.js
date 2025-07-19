const { Sequelize } = require('sequelize');
require('dotenv').config();


const db_name = process.env.DB_PROD_NAME
const db_username = process.env.DB_PROD_USER
const db_password = process.env.DB_PROD_PASS
const db_host = process.env.DB_PROD_HOST
const db_port = process.env.DB_PROD_PORT

const database = new Sequelize(db_name, db_username, db_password, {
    host: db_host,
    port: db_port,
    dialect: 'postgres',
})

console.log(database)

module.exports = database;