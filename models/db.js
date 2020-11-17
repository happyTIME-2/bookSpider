const mysql = require('mysql');
const { connect } = require('../app');
const { dbConfig } = require('../config');

const connnection = mysql.createConnection({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB
});

connnection.connect(err => {
  if(err) throw err;
  console.log('Successfully connected to the database.');
});

module.exports = connnection;