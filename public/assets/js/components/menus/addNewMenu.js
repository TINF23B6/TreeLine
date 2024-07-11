/**
 * Displays the add new menu at the specified position relative to the source element.
 * @param {HTMLElement} sourceElem - The source element that triggered the menu.
 */
function showAddNewMenu(sourceElem) {
    if (window.familyTreeScale < 1) return // Disable the menu when zoomed out (wrong position calculation)
    const hideSpouse = sourceElem.parentElement.querySelectorAll('a').length > 1
    const menu = document.createElement('div')
    menu.className = 'add-new-menu'

    // Get the bounding rectangle of the source element
    const rect = sourceElem.getBoundingClientRect()

    // Adjust position by adding the scroll offsets
    const topPosition = rect.top + window.scrollY
    const leftPosition = rect.left + window.scrollX + 100

    // Apply the calculated positions along with other styles
    menu.style.cssText = `z-index: 9999; position: absolute; top: ${topPosition}px; left: ${leftPosition}px;`

    menu.onmouseleave = () => hideAddNewMenu()

    const buttons = createMenuButtons(
        sourceElem.getAttribute('data-id'),
        hideSpouse
    )
    buttons.forEach((button) => menu.appendChild(button))
    document.body.appendChild(menu)
}

// Helper function to create the menu buttons
function createMenuButtons(id, hideSpouse) {
    const addNewChildButton = document.createElement('button')
    addNewChildButton.className = 'add-new-menu-item primary'
    addNewChildButton.textContent = 'Kind hinzufügen'
    addNewChildButton.onclick = () => openAddNewChildPopup(id)

    const addNewSpouseButton = document.createElement('button')
    addNewSpouseButton.className = 'add-new-menu-item primary'
    addNewSpouseButton.textContent = 'Partner:in hinzufügen'
    addNewSpouseButton.onclick = () => openAddNewSpousePopup(id)

    return hideSpouse ? [addNewChildButton] : [addNewSpouseButton]
}

// Helper function to hide the add new menu
function hideAddNewMenu() {
    document.querySelectorAll('.add-new-menu').forEach((menuElement) => {
        if (!menuElement.matches(':hover')) {
            menuElement.remove()
        }
    })
}
