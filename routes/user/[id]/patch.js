/**
 * PATCH /api/user/
 * Updates the currently logged in user.
 */
const bcrypt = require('bcrypt')

module.exports = function (app, connection) {
    app.patch('/api/user/', (req, res) => {
        const user = req.body.user
        const userId = req.session.userId
        if (!userId) {
            res.status(401).send('Not logged in')
            return
        }
        const display_name = user.display_name[0]
        const password = user.password ? user.password[0] : null
        if (password) {
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) throw err
                connection.query(
                    `UPDATE user SET display_name = '${display_name}', password = '${hash}' WHERE user_id = ${userId}`,
                    (err, _) => {
                        if (err) {
                            throw err
                        }
                        res.send(`
                            <response>
                                <success>true</success>
                                <message>Nutzer erfolgreich aktualisiert</message>
                            </response>`)
                    }
                )
            })
        } else {
            connection.query(
                `UPDATE user SET display_name = '${display_name}' WHERE user_id = ${userId}`,
                (err, _) => {
                    if (err) {
                        throw err
                    }
                    res.send(`
						<response>
							<success>true</success>
							<message>Nutzer erfolgreich aktualisiert</message>
						</response>`)
                }
            )
        }
    })
}
