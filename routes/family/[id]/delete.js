/**
 * DELETE: /api/family/:id
 * Deletes a family from the database.
 */

module.exports = function (app, connection) {
    app.delete('/api/family/:id', (req, res) => {
        const id = req.params.id
        const sql = `SET FOREIGN_KEY_CHECKS = 0;`
        connection.query(sql, (err, _) => {
            if (err) {
                res.status(500)
                console.log(err)
                res.send('Fehler beim Löschen der Familie')
                return
            }
            const sql = `DELETE FROM person WHERE family_id = ${id}`
            connection.query(sql, (err, _) => {
                if (err) {
                    res.status(500)
                    console.log(err)
                    res.send('Fehler beim Löschen der Familie')
                    return
                }
                const sql = `DELETE FROM family WHERE id = ${id}`
                connection.query(sql, (err, _) => {
                    if (err) {
                        res.status(500)
                        console.log(err)
                        res.send('Fehler beim Löschen der Familie')
                        return
                    }
                    res.send('Familie gelöscht')
                })
            })
        })
    })
}
