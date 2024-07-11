/**
 * GET: /api/auth/logout
 * Logs out the user.
 */
module.exports = function (app, _) {
    app.get('/api/auth/logout', (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                res.send('Fehler beim Abmelden')
            } else {
                res.redirect('/')
            }
        })
    })
}
