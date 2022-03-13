const Sequelize = require('sequelize');

// const db = new Sequelize('bancoestado', 'root', '', {
const db = new Sequelize('bancoestado', 'admin', 'admin', {
  host: 'localhost',
  dialect: 'mysql',/* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
  port: '3306',
  log: false,
//   operatorsAliases:true,
  define: {
    timestamps:false
  },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }  
});

module.exports = db;

// Option 2: Passing a connection URI
//const sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname');