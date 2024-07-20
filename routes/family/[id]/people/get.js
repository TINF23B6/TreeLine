/**
 * GET /api/family/[ID]/people
 * Returns a list of people in the specified family.
 */
const xml2js = require('xml2js')

module.exports = function (app, connection) {
    app.get('/api/family/:id/people', (req, res) => {
        if (!req.session.userId) { return res.status(401).send('Unauthorized') }
        connection.query(
            `SELECT * FROM Person WHERE family_id = ${req.params.id}`,
            (err, results) => {
                if (err) {
                    throw err
                }
                const builder = new xml2js.Builder({
                    doctype: {
                        sysID: 'stammbaum_people.dtd',
                    },
                });
                const xml = builder.buildObject({
                    stammbaum: { person: results },
                })
                res.send(xml)
            }
        )
    })
}
