/**
 * PATCH: /api/family/:id
 * Modify a family
 */
const xml2js = require('xml2js')

module.exports = function (app, connection) {
    app.patch('/api/family/:id', (req, res) => {
        if (!req.session.userId) { return res.status(401).send('Unauthorized') }
        const family = req.body.family
        connection.query(
            `UPDATE Family SET name = '${family.name[0]}' WHERE id = ${req.params.id}`,
            (err, _) => {
                if (err) {
                    throw err
                }
                res.send('Familie umbenannt!')
            }
        )
    })
}
