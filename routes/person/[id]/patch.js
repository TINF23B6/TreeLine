/**
 * PATCH /api/person/[ID]
 * Updates a person in the database.
 * Body: <person><first_name>[NAME]</first_name><last_name>[NAME]</last_name><birth_year>[YEAR]</birth_year><death_year>[YEAR]</death_year></person>
 */

module.exports = function (app, connection) {
    app.patch('/api/person/:id', (req, res) => {
        const person = req.body.person
        connection.query(
            `UPDATE Person SET first_name = '${person.first_name[0]}', last_name = '${person.last_name[0]}', birth_year = ${person.birth_year[0]}, death_year = ${person.death_year[0] || null} ${person.image ? `, image = '${person.image}'` : ''}  WHERE id = ${req.params.id}`,
            (err, _) => {
                if (err) {
                    throw err
                }
                res.send('Person updated')
            }
        )
    })
}
