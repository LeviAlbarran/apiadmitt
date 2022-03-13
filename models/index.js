'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
//const env = process.env.NODE_ENV || 'development';
const env =  'development';

const config = {
  "username": process.env.MYSQL_USERNAME,
  "password": process.env.MYSQL_ROOT_PASSWORD,
  "database": process.env.MYSQL_DATABASE,
  "host": process.env.MYSQL_HOST,
  "dialect": "mysql",
  "operatorsAliases" : 0,
  "define": {
    "freezeTableName": true
  }}
const db = {};

let sequelize;

//desarrollo 
sequelize = new Sequelize(config.database, config.username, config.password, config);

//produccion
/*sequelize = new Sequelize(config.database, config.username, config.password, {
    dialect: 'mysql',
    host: '/cloudsql/poc-banco-estado:us-east1:bancoestado-my',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    dialectOptions: {
        socketPath: '/cloudsql/poc-banco-estado:us-east1:bancoestado-my'
    },
    logging: false,
    operatorsAliases: 0
});*/

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;