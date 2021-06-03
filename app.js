// requires
const express = require('express')
const mysql = require('mysql')
const exphbs = require('express-handlebars');



// initialize app
const app = express()


// initialize creds
const port = 2710


// static files
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/image', express.static(__dirname + 'public/image'))
app.use('/js', express.static(__dirname + 'public/js'))


// templating engine
app.set('views', './src/views')
//app.set('view engine', 'ejs')

app.engine('hbs', exphbs({
    extname: '.hbs',
    defaultLayout: 'planB'
}));

app.set('view engine', 'hbs');


// routes
const router = require('./src/routes/front-page')


// home page
app.use('/', router)


// listen on port 2710
app.listen(port, () => console.log(`Listening on port ${port}`))