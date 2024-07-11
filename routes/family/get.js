/**
 * GET: /api/family
 * Returns a list of all families in the database,
 * accessible by the logged-in user
 */
const xml2js = require('xml2js')

module.exports = function (app, connection) {
    app.get('/api/family', (req, res) => {
        const userId = req.session.userId

        connection.query(
            'SELECT * FROM family WHERE user_id = ?',
            [userId],
            (err, results) => {
                if (err) {
                    throw err
                }

                // Convert the results to XML
                const builder = new xml2js.Builder()
                const xml = builder.buildObject({
                    families: { family: results },
                })
                res.send(xml)
            }
        )
    })
}
