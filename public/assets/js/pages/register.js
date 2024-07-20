/**
 * Handle registration form submission
 * @param {*} event
 */
function handleSubmit(event) {
    event.preventDefault()
    // Get form data
    const formData = new FormData(event.target)
    const display_name = document.getElementById('display-name').value
    const name = document.getElementById('username').value
    const password = document.getElementById('password').value
    const password_confirm = document.getElementById('password-confirm').value

    // Validate form data
    if (password !== password_confirm) {
        alert('Die Passwörter stimmen nicht überein.')
        return
    }

    // Send POST request to server
    const xml = `
    <?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE user SYSTEM "user.dtd">
    <user>
        <display_name>${display_name}</display_name>
        <name>${name}</name>
        <password>${password}</password>
    </user>
    `

    fetch('/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/xml',
        },
        body: xml,
    })
        .then((response) => response.text())
        .then((data) => {
            console.log(data)
            // Parse XML response
            const parser = new DOMParser()
            const xml = parser.parseFromString(data, 'application/xml')
            const success = xml.querySelector('success').textContent
            alert(xml.querySelector('message').textContent)
            if (success === 'false') {
                return
            } else {
                window.location.href = '/login'
            }
        })
}

// Add event listener for form submission on page load
document.addEventListener('DOMContentLoaded', () => {
    document
        .getElementById('register-form')
        .addEventListener('submit', handleSubmit)
})
