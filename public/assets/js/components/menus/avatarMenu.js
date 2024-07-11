/**
 * Displays the avatar menu at the specified position relative to the source element.
 * @param {HTMLElement} sourceElem - The source element that triggered the menu.
 */
function showAvatarMenu(sourceElem) {
    const menu = document.createElement('div')
    menu.className = 'avatar-menu'

    // Get the bounding rectangle of the source element
    const rect = sourceElem.getBoundingClientRect()

    // Adjust position by adding the scroll offsets
    const topPosition = rect.top + window.scrollY
    const leftPosition = rect.left + window.scrollX - 200

    // Apply the calculated positions along with other styles
    menu.style.cssText = `z-index: 9999; position: absolute; top: ${topPosition}px; left: ${leftPosition}px;`

    menu.onmouseleave = () => hideAvatarMenu()

    const button = document.createElement('button')

    button.className = 'add-new-menu-item destructive'
    button.textContent = 'Abmelden'

    button.onclick = () => {
        window.location.href = '/api/auth/logout'
    }

    menu.appendChild(button)
    document.body.appendChild(menu)
}

// Helper function to hide the avatar menu
function hideAvatarMenu() {
    document.querySelectorAll('.avatar-menu').forEach((menuElement) => {
        if (!menuElement.matches(':hover')) {
            menuElement.remove()
        }
    })
}
