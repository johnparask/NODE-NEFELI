// requires
const express = require('express')
const mysql = require('mysql')
const exphbs = require('hbs');


// initialize app
const app = express()


// initialize creds
const port = 2710

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'readit',
  port     : '33060'
});
 
connection.connect();
 
connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});
 
connection.end();


app.listen(port, () => console.log(`Listening on port ${port}`))