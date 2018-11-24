const express = require('express')
const http = require('http')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')

// Parsers
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
    next()
})

const main = require('./server/main')
app.use('/requests', main)

// Angular DIST output folder
app.use(express.static(path.join(__dirname, 'dist/fyp')))

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/fyp/index.html')) 
})

// Set port
const port = process.env.PORT || '80'
app.set('port', port)

const server = http.createServer(app)

server.listen(port, () => console.log(`Running on localhost:${port}`))