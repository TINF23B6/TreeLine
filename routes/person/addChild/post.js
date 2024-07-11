/**
 * POST /api/person/addChild
 * Adds a person to the database.
 * Body: { first_name: [NAME], last_name: [NAME], birth_year: [YEAR], death_year: [YEAR], parent_id_1: [ID], parent_id_2: [ID] }
 */

module.exports = function (app, connection) {
    app.post('/api/person/addChild', (req, res) => {
        const person = req.body.person

        // If parent_id_1 or parent_id_2 are not provided, return an error
        if (!person.parent_id[0]) {
            res.status(400)
            res.send('Error: Parent ID is required')
            return
        }

        // Get both parents from the database
        connection.query(
            `SELECT * FROM person WHERE id = ${person.parent_id[0]}`,
            (err, results) => {
                if (err) {
                    throw err
                }
                // Add child
                connection.query(
                    `INSERT INTO person (first_name, last_name, birth_year, death_year, parent_id_1, parent_id_2, family_id, image) VALUES ('${person.first_name[0]}', '${person.last_name[0]}', ${person.birth_year[0]}, ${person.death_year[0] || null}, ${person.parent_id[0]}, ${results[0].spouse_id || null}, ${results[0].family_id}, '${person.image[0] || '/assets/img/account_placeholder.jpg'}')`,
                    (err, _) => {
                        if (err) {
                            throw err
                        }
                        res.send('Person added')
                    }
                )
            }
        )
    })
}
