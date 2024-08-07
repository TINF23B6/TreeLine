/**
 * GET /api/person/[ID]
 * Returns a single person object from the database.
 */
const xml2js = require('xml2js')

module.exports = function (app, connection) {
    app.get('/api/person/:id', (req, res) => {
        if (!req.session.userId) { return res.status(401).send('Unauthorized') }
        connection.query(
            `SELECT * FROM Person WHERE id = ${req.params.id}`,
            (err, results) => {
                if (err) {
                    throw err
                }
                const builder = new xml2js.Builder({
                    doctype: {
                        sysID: 'person.dtd',
                    },
                })
                const xml = builder.buildObject({ person: results[0] })
                res.send(xml)
            }
        )
    })
}
