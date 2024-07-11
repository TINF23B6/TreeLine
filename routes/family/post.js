/**
 * POST: /api/family
 * Adds a family to the database.
 * Body: { name: [NAME] }
 */

module.exports = function (app, connection) {
    app.post('/api/family', (req, res) => {
        const family = req.body.family
        const userId = req.session.userId

        if (!family.name) {
            res.status(400)
            res.send('Error: Family name is required')
            return
        }

        connection.query(
            'INSERT INTO Family (name, user_id) VALUES (?, ?)',
            [family.name, userId],
            (err, result) => {
                if (err) {
                    throw err
                }
                const familyId = result.insertId
                // Add the first parent
                connection.query(
                    'INSERT INTO Person (first_name, last_name, birth_year, family_id, image) VALUES (?, ?, ?, ?, ?)',
                    [
                        'John',
                        family.name,
                        1700,
                        familyId,
                        '/assets/img/account_placeholder.jpg',
                    ],
                    (err, result) => {
                        if (err) {
                            throw err
                        }
                        const firstPersonId = result.insertId

                        // Add the second parent
                        connection.query(
                            'INSERT INTO Person (first_name, last_name, birth_year, family_id, image) VALUES (?, ?, ?, ?, ?)',
                            [
                                'Jane',
                                family.name,
                                1700,
                                familyId,
                                '/assets/img/account_placeholder.jpg',
                            ],
                            (err, result) => {
                                if (err) {
                                    throw err
                                }
                                const secondPersonId = result.insertId

                                // Update the first parent's spouse_id and root_person
                                connection.query(
                                    'UPDATE Person SET spouse_id = ?, root_person = ? WHERE id = ?',
                                    [
                                        secondPersonId,
                                        firstPersonId,
                                        firstPersonId,
                                    ],
                                    (err, _) => {
                                        if (err) {
                                            throw err
                                        }
                                    }
                                )

                                // Update the second parent's spouse_id and root_person
                                connection.query(
                                    'UPDATE Person SET spouse_id = ?, root_person = ? WHERE id = ?',
                                    [
                                        firstPersonId,
                                        secondPersonId,
                                        secondPersonId,
                                    ],
                                    (err, _) => {
                                        if (err) {
                                            throw err
                                        }
                                    }
                                )

                                // Add the child
                                connection.query(
                                    'INSERT INTO Person (first_name, last_name, birth_year, family_id, parent_id_1, parent_id_2, image) VALUES (?, ?, ?, ?, ?, ?, ?)',
                                    [
                                        'Jimmy',
                                        family.name,
                                        1700,
                                        familyId,
                                        firstPersonId,
                                        secondPersonId,
                                        '/assets/img/account_placeholder.jpg',
                                    ],
                                    (err, _) => {
                                        if (err) {
                                            throw err
                                        }
                                    }
                                )

                                res.send('Familie hinzugefügt')
                            }
                        )
                    }
                )
            }
        )
    })
}
