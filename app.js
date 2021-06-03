// requires
const express = require('express')
const mysql = require('mysql')
const exphbs = require('hbs');
const path = require('path')


// initialize app
const app = express()

// initialize creds
const port = 2710

// View Engine Setup
app.set('views', path.join(__dirname))
app.set('view engine', 'hbs')

app.get('/', function(req, res){
    res.render('front-page')
})

// DB Connection
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
        console.log(result[0].Username);
    });
});










app.listen(port, () => console.log(`Listening on port ${port}`))
