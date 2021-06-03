// requires
const express = require('express')
const mysql = require('mysql')
const exphbs = require('express-handlebars');
const path = require('path')


// initialize app
const app = express()

// initialize creds
const port = 2710

// DB Connection
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'readit',
    port: '33060'
});

connection.connect(function(err) {
    if (err) throw err

});

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
    connection.query('SELECT * FROM categories', function (err, categories, fields) {
        if(err) throw err
        connection.query('SELECT q.id,q.content,q.likes,q.comments,p.username,c.categoryName FROM posts q LEFT JOIN users p ON p.id = q.creatorID LEFT JOIN categories c ON c.id = q.categoryID ORDER BY comments DESC LIMIT 9;', function (err, trending, fields) {
            if(err) throw err
            connection.query('SELECT q.id,q.content,q.likes,q.comments,p.username,c.categoryName FROM posts q LEFT JOIN users p ON p.id = q.creatorID LEFT JOIN categories c ON c.id = q.categoryID ORDER BY likes DESC;', function (err, top, fields) {
                if(err) throw err
                res.render('front-page', {categories, trending, top})
            });
        });
    });
})

app.get('/categories', function(req, res){
    res.render('categories')
})

app.get('/posts', function(req, res){
    res.render('posts')
})

app.get('/comments', function(req, res){
    res.render('comments')
})







app.listen(port, () => console.log(`Listening on port ${port}`))
