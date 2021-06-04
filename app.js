// requires
const express = require('express')
const mysql = require('mysql')
const exphbs = require('express-handlebars');
const path = require('path')
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');


// initialize app
const app = express()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// initialize creds
const port = 2710

// DB Connection
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'readit',
    port: '3306'
});

connection.connect(function (err)
{
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


app.get('/', function (req, res)
{
    connection.query('SELECT * FROM categories', function (err, categories, fields)
    {
        if (err) throw err
        connection.query('SELECT q.id,q.title,q.content,q.likes,q.comments,p.username,c.categoryName FROM posts q LEFT JOIN users p ON p.id = q.creatorID LEFT JOIN categories c ON c.id = q.categoryID ORDER BY comments DESC LIMIT 9;', function (err, trending, fields)
        {
            if (err) throw err
            connection.query('SELECT q.id,q.content,q.likes,q.comments,p.username,c.categoryName FROM posts q LEFT JOIN users p ON p.id = q.creatorID LEFT JOIN categories c ON c.id = q.categoryID ORDER BY likes DESC;', function (err, top, fields)
            {
                if (err) throw err
                res.render('front-page', { categories, trending, top })
            });
        });
    });
})

//Get requests
app.get('/categories', function (req, res)
{
    res.render('categories')
})

app.get('/posts', function (req, res)
{
    res.render('posts')
})

app.get('/comments', function (req, res)
{
    res.render('comments')
})

app.get('/login', function (req, res)
{
    res.render('login-signup')
})


//Post Requests
app.post('/login', function (req, res)
{
    console.log("POST: login request..");

    connection.query('SELECT * FROM users WHERE username = ?', [req.body.username], function (err, user, fields)
    {
        if (user.length > 0)
        {
            if (user[0])
            {
                if (err) throw err

                bcrypt.compare(req.body.password, user[0].password, function (err, result)
                {
                    if (result)
                    {
                        console.log("Logged In");
                        res.send("Loggedin");
                    }
                    else
                    {
                        res.render("login-signup", { displayError: true })
                    }
                });
            }
            else
                res.render("login-signup", { displayError: true })
        }
        else
            res.render("login-signup", { displayError: true })
    });

})





app.listen(port, () => console.log(`Listening on port ${port}`))
