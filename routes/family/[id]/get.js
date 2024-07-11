/**
 * GET: /api/family/[ID]
 * Returns a family object from the database.
 */
const xml2js = require('xml2js')

module.exports = function (app, connection) {
    app.get('/api/family/:id', (req, res) => {
        if (!req.session.userId) { return res.status(401).send('Unauthorized') }
        connection.query(
            `SELECT * FROM Family WHERE id = ${req.params.id}`,
            (err, results) => {
                if (err) {
                    throw err
                }
                const builder = new xml2js.Builder()
                const xml = builder.buildObject({ family: results[0] })
                res.send(xml)
            }
        )
    })
}
