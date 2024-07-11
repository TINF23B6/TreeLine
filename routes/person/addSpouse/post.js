/**
 * POST /api/person/addSpouse
 * Adds a spouse to the database.
 * Body: { first_name: [NAME], last_name: [NAME], birth_year: [YEAR], death_year: [YEAR], spouse_id: [ID] }
 */

module.exports = function (app, connection) {
    app.post('/api/person/addSpouse', (req, res) => {
        const person = req.body.person

        // If spouse_id is not provided, return an error
        if (!person.spouse_id[0]) {
            res.status(400)
            res.send('Error: Spouse ID is required')
            return
        }

        // Add new person to the database (with spouse_id = person.spouse_id[0]) and update the spouse_id of the other person
        connection.query(
            `SELECT * FROM person WHERE id = ${person.spouse_id[0]}`,
            (err, results) => {
                if (err) {
                    throw err
                }
                connection.query(
                    `INSERT INTO person (first_name, last_name, birth_year, death_year, spouse_id, family_id, image) VALUES ('${person.first_name[0]}', '${person.last_name[0]}', ${person.birth_year[0]}, ${person.death_year[0] || null}, ${person.spouse_id[0]}, ${results[0].family_id}, '${person.image[0] || '/assets/img/account_placeholder.jpg'}')`,
                    (err, results) => {
                        if (err) {
                            throw err
                        }

                        connection.query(
                            `UPDATE person SET spouse_id = ${results.insertId} WHERE id = ${person.spouse_id[0]}`,
                            (err, _) => {
                                if (err) {
                                    throw err
                                }
                                res.send('Person added')
                            }
                        )
                    }
                )
            }
        )
    })
}
