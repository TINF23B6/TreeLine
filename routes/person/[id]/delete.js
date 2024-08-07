/**
 * DELETE: /api/person/[ID]
 * Deletes a person from the database.
 */

module.exports = function (app, connection) {
    app.delete('/api/person/:id', (req, res) => {
        if (!req.session.userId) { return res.status(401).send('Unauthorized') }
        connection.query(
            `SELECT * FROM Person WHERE parent_id_1 = ${req.params.id} OR parent_id_2 = ${req.params.id}`,
            (err, results) => {
                if (err) {
                    throw err
                }

                if (results.length > 0) {
                    res.status(400)
                    res.send(
                        'Person kann nicht gelöscht werden, da sie Kinder hat. Bitte lösche zuerst die Kinder.'
                    )
                } else {
                    connection.query(
                        `DELETE FROM Person WHERE id = ${req.params.id}`,
                        (err, _) => {
                            if (err) {
                                throw err
                            }
                            res.send('Person deleted')
                        }
                    )
                }
            }
        )
    })
}
