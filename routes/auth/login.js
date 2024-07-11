/**
 * POST: /api/auth/login
 * Logs in a user by setting the session variable.
 */
const bcrypt = require('bcrypt')

module.exports = function (app, connection) {
    app.post('/api/auth/login', (req, res) => {
        const user = req.body.user
        const name = user.name[0]
        const password = user.password[0]
        connection.query(
            'SELECT * FROM user WHERE name = ?',
            [name],
            (err, results) => {
                if (err) throw err
                if (results.length > 0) {
                    const user = results[0]
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err
                        if (isMatch) {
                            req.session.userId = user.user_id
                            req.session.name = user.name
                            req.session.displayName = user.display_name
                            res.send(`
                            <response>
                                <success>true</success>
                                <message>Benutzer erfolgreich angemeldet</message>
                            </response>`)
                        } else
                            res.send(`
                            <response>
                                <success>false</success>
                                <message>Benutzername oder Passwort falsch</message>
                            </response>`)
                    })
                } else {
                    res.send(`
                    <response>
                        <success>false</success>
                        <message>Nutzer nicht gefunden</message>
                    </response>`)
                }
            }
        )
    })
}
