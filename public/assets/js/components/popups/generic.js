/**
 * Function to close any popup.
 */
function closePopup() {
    const popup = document.querySelector('.popup')
    if (!popup) {
        return
    }
    popup.style.animation = 'popup-exit-overlay 0.25s ease-in-out forwards'
    const content = document.querySelector('.content')
    content.style.animation = 'popup-exit-content 0.25s ease-in-out forwards'
    setTimeout(() => {
        content.remove()
        popup.remove()
    }, 250)
}
