/**
 * GET /api/family/[ID]/people
 * Returns a list of people in the specified family.
 */
const xml2js = require('xml2js')

module.exports = function (app, connection) {
    app.get('/api/family/:id/people', (req, res) => {
        connection.query(
            `SELECT * FROM Person WHERE family_id = ${req.params.id}`,
            (err, results) => {
                if (err) {
                    throw err
                }
                const builder = new xml2js.Builder()
                const xml = builder.buildObject({
                    stammbaum: { person: results },
                })
                res.send(xml)
            }
        )
    })
}
