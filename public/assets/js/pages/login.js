/**
 * Handle login form submission
 * @param {*} event
 */
function handleSubmit(event) {
    event.preventDefault()
    // Get form data
    const formData = new FormData(event.target)
    const username = document.getElementById('username').value
    const password = document.getElementById('password').value
    const xml = `
        <?xml version="1.0" encoding="UTF-8"?>
        <!DOCTYPE user SYSTEM "user.dtd">
		<user>
			<name>${username}</name>
			<password>${password}</password>
		</user>
	`
    fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/xml',
        },
        body: xml,
    })
        .then((response) => response.text())
        .then((data) => {
            const parser = new DOMParser()
            const xml = parser.parseFromString(data, 'application/xml')
            const success = xml.querySelector('success').textContent
            if (success === 'false') {
                alert(xml.querySelector('message').textContent)
                return
            }
            window.location.href = '/familytree'
        })
}
// Add event listener for form submission on page load
document.addEventListener('DOMContentLoaded', () => {
    document
        .getElementById('login-form')
        .addEventListener('submit', handleSubmit)
})
