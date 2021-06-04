// requires
const express = require('express')
const mysql = require('mysql')
const exphbs = require('express-handlebars');
const path = require('path')
const bodyParser = require("body-parser"); //for reading POST data
const bcrypt = require('bcrypt'); //for hashing passwords
const cookieParser = require('cookie-parser'); //for reading cookies
var crypto = require("crypto"); //for generating tokens for login cookie
const e = require('express');

// initialize app
const app = express()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser());

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

app.get('/register', function (req, res)
{
    res.redirect("/login");
})

app.get('/login', function (req, res)
{
    if (req.cookies.readit_auth != undefined)
    {
        //auth token found
        connection.query('SELECT * FROM auth_tokens WHERE token = ? AND expired = 0', [req.cookies.readit_auth], function (err, token, fields)
        {
            if (err) throw err

            if (token.length > 0)
            {
                if (token)
                {
                    //token verified in database
                    //check if token is expired
                    if (token[0].expireDate <= new Date(Date.now()))
                    {
                        //token is expired
                        //update expired flag
                        connection.query('UPDATE auth_tokens SET expired = 1 WHERE id = ?', [token[0].id], function (err, results,)
                        {
                            res.send("Session expired, please login!");
                        })
                    }
                    else
                        res.send("Logged in under: " + token[0].userID);
                }
                else
                    res.render('login-signup')
            }
            else
                res.render('login-signup')
        })
    }
    else
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
                        var authToken = crypto.randomBytes(20).toString('hex');
                        var expireDate = new Date(Date.now() + 90000000);
                        connection.query('INSERT INTO auth_tokens VALUES(NULL,?,?,0,?)', [user[0].id, authToken, expireDate], function (err, results,)
                        {
                            res.cookie('readit_auth', authToken, { expires: expireDate });
                            res.send("Loggedin");
                        })
                    }
                    else
                    {
                        res.render("login-signup", { displayError: true, error: "Invalid credentials!" })
                    }
                });
            }
            else
                res.render("login-signup", { displayError: true, error: "Invalid credentials!" })
        }
        else
            res.render("login-signup", { displayError: true, error: "Invalid credentials!" })
    });

})

app.post("/register", function (req, res)
{
    console.log("POST: register request..");

    //validate data

    if (req.body.email == "" || req.body.password == "" || req.body.username == "")
        res.render("login-signup", { displayError: true, error: "One or more fields where empty!" });

    if (req.body.password != req.body.con_password)
        res.render("login-signup", { displayError: true, error: "Passwords don't match!" });

    //hash password
    bcrypt.genSalt(10, function (err, salt)
    {
        bcrypt.hash(req.body.password, salt, function (err, hash)
        {
            connection.query('INSERT INTO users VALUES(NULL,?,?,?,?,?,?)', [req.body.firstname, req.body.lastname, req.body.username, hash, req.body.bday, req.body.email], function (err, user, fields)
            {
                console.log("Account created!");
                res.redirect("/login");
            });
        });
    });
})

app.listen(port, () => console.log(`Listening on port ${port}`))
