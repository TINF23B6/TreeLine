const fs = require('fs')
/**
 * Runs the database setup.
 * This will create the database schema and insert example data
 * aswell as the default "treeline" user.
 * @param {*} connection
 */
function runDatabaseSetup(connection) {
    // Apply schema files
    const files = [
        'schema_user.sql',
        'schema_family.sql',
        'schema_person.sql',
        'default_user.sql',
    ]

    // Check if tables already exist
    connection.query('SHOW TABLES', (err, results) => {
        if (err) {
            throw err
        }
        if (results.length > 0) {
            console.log('Tables already exist, skipping database setup...')
            return
        } else {
            files.forEach((file) => {
                const script = fs.readFileSync(`sql/${file}`, 'utf8')
                console.log('Running script: ' + file)
                connection.query(script, (err) => {
                    if (err) {
                        if (err.code === 'ER_TABLE_EXISTS_ERROR') {
                            console.log('Table already exists, skipping...')
                        } else {
                            throw err
                        }
                    }
                })
            })

            console.log('Running example data script...')
            const exampleData = fs.readFileSync(
                'sql/example_family_röthig.sql',
                'utf8'
            )
            exampleData.split('\n').forEach((line) => {
                if (line.trim() !== '' && !line.startsWith('--')) {
                    connection.query(line, (err) => {
                        if (err) {
                            if (err) {
                                throw err
                            }
                        }
                    })
                }
            })
        }
    })
}
exports.runDatabaseSetup = runDatabaseSetup
