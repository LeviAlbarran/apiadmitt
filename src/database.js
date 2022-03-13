// Conexión a BD MySql
const mysql = require('mysql');
const util = require('util');

console.log(process.env.MYSQL_HOST);
const mysqlConnection = mysql.createConnection({

    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    multipleStatements: true
});

mysqlConnection.connect(function(err) {
    if (err) {
        console.log(err);
        return;
    } else {
        console.log("La DB está conectada");
    }
});

module.exports = mysqlConnection;