/**
 * This is the main entry point for the application.
 * It sets up the express web-server and connects to the database.
 */
const path = require('path')
const bodyParser = require('body-parser')
const express = require('express')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const mysql = require('mysql2')
const { runDatabaseSetup } = require('./sql/database_setup.js')

// Parse XML requests
require('body-parser-xml')(bodyParser)
require('dotenv').config()

// Set up the express app
const app = express()
exports.app = app
const PORT = 8080

// Set up the XML body parser
app.use(bodyParser.xml({ limit: '16mb' }))
app.use(cookieParser())

// Set up the session middleware
app.use(
    session({
        secret: 'secretkey',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
        maxAge: 1000 * 60 * 60 * 24 * 7,
    })
)

console.log(`
                  @@@@@@@@@@@@@                                       
                  @@@@@@@@@@@@@@@                                     
                  @@@@        @@@@@                                   
                  @@@@          @@@@         @@@@@@                   
                  @@@@           @@@@   @@@@@@@@@@@@@                 
                   @@@@           @@@@@@@@@@      @@@                 
                    @@@@@         @@@@@@         @@@@                 
                      @@@@@@@@@@@@@@@@@         @@@@                  
                         @@@@@@@@@@@@@         @@@@                   
                                  @@@        @@@@@                    
                                  @@@@@@@@@@@@@@                      
                                  @@@@@@@@@@@                         
                                  @@@                                 
                                  @@@                                 
                                  @@@                                 
                                  @@@                                 
                                  @@                                  
                                                                      
           @@-@@.@@                 @@@   .@@                         
              @@    @-@  @@@   +@@  @@      .  @ @@   *@@             
              @@   @@ + @+ @@ @@ @@ @@     @@ @@  @@ @@ @@=           
              @@   @@  +@     @@    @@     @@ @@  @@ @@               
             @@@@  @@   :@@@@  @@@@ @@.#@@ @@ @@  @@  @@@@     

Host: ${process.env.MYSQL_HOST}:${process.env.MYSQL_PORT}
User: ${process.env.MYSQL_USER}
Password: ${process.env.MYSQL_PASSWORD}
Database: ${process.env.MYSQL_DATABASE}
`)

const maxRetries = 5
function connectWithRetry(attemptsLeft = maxRetries) {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection({
            host: process.env.MYSQL_HOST,
            port: process.env.MYSQL_PORT,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
        })

        connection.connect((err) => {
            if (err) {
                console.error('Datenbankverbindung fehlgeschlagen: ' + err.code)
                if (attemptsLeft > 1) {
                    console.log(
                        `Warte bis Datenbank gestartet ist... Versuch ${maxRetries - attemptsLeft + 1}/${maxRetries}`
                    )
                    setTimeout(() => {
                        connectWithRetry(attemptsLeft - 1)
                            .then(resolve)
                            .catch(reject)
                    }, 5000)
                } else {
                    console.log(
                        'Verbindung zur Datenbank nach mehreren Versuchen fehlgeschlagen.'
                    )
                    reject(
                        new Error(
                            'Verbindung zur Datenbank nach mehreren Versuchen fehlgeschlagen.'
                        )
                    )
                }
            } else {
                resolve(connection)
            }
        })
    })
}

// Middleware for routes that require authentication
function requireAuth(req, res, next) {
    if (req.session.userId) {
        next()
    } else {
        res.redirect('/login')
    }
}

// Try to connect to the database and set up the API endpoints
connectWithRetry()
    .then((connection) => {
        // Run the database setup (if necessary)
        runDatabaseSetup(connection)
        console.log(
            'Database connection established and API endpoints registred.'
        )
        // Load API routes
        require('./routes')(app, connection)
        // Serve assets + login without authentication
        app.use(
            '/assets',
            express.static(path.join(__dirname, 'public', 'assets'))
        )
        app.get('/login', (req, res) => {
            if (req.session.userId) {
                res.redirect('/familytree')
            }
            res.sendFile(path.join(__dirname, 'public', 'login.html'))
        })
        app.get('/register', (req, res) => {
            if (req.session.userId) {
                res.redirect('/familytree')
            }
            res.sendFile(path.join(__dirname, 'public', 'register.html'))
        })
        // Serve familytree and settings with authentication
        app.get('/familytree', requireAuth, (_, res) => {
            res.sendFile(path.join(__dirname, 'public', 'familytree.html'))
        })
        app.get('/settings', requireAuth, (_, res) => {
            res.sendFile(path.join(__dirname, 'public', 'settings.html'))
        })
        app.get('/', requireAuth, (_, res) => {
            res.redirect('/familytree')
        })
        // Start the server
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`)
        })
    })
    .catch((error) => {
        console.error('Failed to establish database connection:', error)
    })
