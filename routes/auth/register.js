/**
 * GET: /api/auth/register
 * Registers a new user in the database.
 */
const bcrypt = require('bcrypt')
const xml2js = require('xml2js')

module.exports = function (app, connection) {
    app.post('/api/auth/register', (req, res) => {
        const user = req.body.user
        const display_name = user.display_name[0]
        const name = user.name[0]
        const password = user.password[0]

        // Check if the username already exists
        connection.query(
            'SELECT * FROM user WHERE name = ?',
            [name.toLowerCase()],
            (err, rows) => {
                if (err) throw err
                if (rows.length > 0) {
                    res.send(
                        `<?xml version="1.0" encoding="UTF-8"?>
                        <response>
                            <success>false</success>
                            <message>Der Benutzername existiert bereits.</message>
                        </response>`
                    )
                } else {
                    // Register the user
                    bcrypt.hash(password, 10, (err, hash) => {
                        if (err) throw err
                        connection.query(
                            'INSERT INTO user (display_name, name, password) VALUES (?, ?, ?)',
                            [display_name, name.toLowerCase(), hash],
                            (err, _) => {
                                if (err) {
                                    console.log(err)
                                    res.send(
                                        `<?xml version="1.0" encoding="UTF-8"?>
                                        <response>
                                            <success>false</success>
                                            <message>Ein Fehler ist aufgetreten.</message>
                                        </response>`
                                    )
                                } else {
                                    res.send(
                                        `<?xml version="1.0" encoding="UTF-8"?>
                                        <response>
                                            <success>true</success>
                                            <message>Nutzer erfolgreich registriert. Bitte melde dich mit deinen Anmeldedaten an.</message>
                                        </response>`
                                    )
                                }
                            }
                        )
                    })
                }
            }
        )
    })
}
