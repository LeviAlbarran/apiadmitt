// Conexión a BD MySql
const mysql = require('mysql');
const util = require('util');


const mysqlConnection = mysql.createConnection({

    host: "34.176.217.167",
    user: "root",
    password: "Admitt2022",
    database: "admitt",
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