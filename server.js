const express = require('express')
const http = require('http')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')

// Parsers
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});

const main = require('./server/main')
app.use('/requests', main)

// Angular DIST output folder
app.use(express.static(path.join(__dirname, 'dist/fyp')))

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/fyp/index.html')) 
})

// Set port
const port = process.env.PORT || '8080'
app.set('port', port)

const server = http.createServer(app)

server.listen(port, () => console.log(`Running on localhost:${port}`))