/**
 * This file is responsible for loading all the routes
 * in the routes folder and subfolders.
 */
const fs = require('fs')
const path = require('path')

module.exports = function (app, connection) {
    const load = (dir) => {
        fs.readdirSync(dir).forEach((file) => {
            const fullPath = path.join(dir, file)
            if (fs.statSync(fullPath).isDirectory()) {
                load(fullPath)
            } else if (file !== 'index.js' && file.endsWith('.js')) {
                const name = file.substr(0, file.indexOf('.'))
                require(path.join(dir, name))(app, connection)
            }
        })
    }
    load(__dirname)
}
