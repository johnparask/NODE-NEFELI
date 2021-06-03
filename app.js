// requires
const express = require('express')
const mysql = require('mysql')
const exphbs = require('hbs');


// initialize app
const app = express()


// initialize creds
const port = 2710

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'readit',
    port: '33060'
});


connection.connect(function (err) {
    if (err) throw err;
    connection.query("SELECT FirstName, Username FROM user", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
    });
});










app.listen(port, () => console.log(`Listening on port ${port}`))
