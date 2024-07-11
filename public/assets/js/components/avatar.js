/**
 * Render the user avatar with the first letter of the display name.
 */
function renderAvatar() {
    const avatar = document.getElementById('user-avatar-letter')
    fetch('/api/auth/session')
        .then((response) => response.text())
        .then((data) => {
            const parser = new DOMParser()
            const xml = parser.parseFromString(data, 'application/xml')
            const displayName =
                xml.getElementsByTagName('displayName')[0].textContent
            avatar.innerHTML = displayName.charAt(0).toUpperCase()
        })
}

// Run the function when the page is loaded
document.addEventListener('DOMContentLoaded', () => {
    renderAvatar()
})
