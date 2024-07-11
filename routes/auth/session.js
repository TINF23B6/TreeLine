/**
 * GET: /api/auth/session
 * Returns the current session.
 */
const xml2js = require('xml2js')

module.exports = function (app, _) {
    app.get('/api/auth/session', (req, res) => {
        // Return the session
        res.set('Content-Type', 'application/xml')
        const builder = new xml2js.Builder()
        const xml = builder.buildObject(req.session)
        res.send(xml)
    })
}
