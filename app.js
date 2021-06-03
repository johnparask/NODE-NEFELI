// requires
const express = require('express')
const mysql = require('mysql')
const exphbs = require('express-handlebars');
const path = require('path')


// initialize app
const app = express()

// initialize creds
const port = 2710

app.engine('hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs'
}));

app.set('view engine', 'hbs')

app.set('views', path.join(__dirname, '/src/views'));

app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/image', express.static(__dirname + 'public/image'))
app.use('/js', express.static(__dirname + 'public/js'))


app.get('/', function(req, res){
    res.render('front-page')
})

app.get('/categories', function(req, res){
    res.render('categories')
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
