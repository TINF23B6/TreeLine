/**
 * Opens the add new child popup.
 * @param {string} id - The ID of the parent.
 */
function openAddNewChildPopup(id) {
    const htmlBody = document.querySelector('body')
    const popupHTML = `
        <div class="popup">
            <div class="content">
                <div class="header">
                    <h1>Kind hinzufügen</h1>
                    <img src="/assets/img/close.svg" class="close" />
                </div>
                <form class="popup-form">
                    <label>
                        Vorname
                        <input placeholder="Vorname" name="first_name" type="text" required>
                    </label>
                    <label>
                        Nachname
                        <input placeholder="Nachname" name="last_name" type="text" required>
                    </label>
                    <label>
                        Geburtsjahr
                        <input placeholder="Geburtsjahr" name="birth_year" type="number" required>
                    </label>
                    <label>
                        Todesjahr
                        <input placeholder="Todesjahr (optional)" name="death_year" type="number">
                    </label>
                    <label>
                        Personen-Bild
                        <div class="image-upload">
                            <input name="image_file" type="file">
                            <input placeholder="Bild-URL" name="image_text" type="text">
                        </div>
                    </label>
                    <button type="submit" class="primary">Speichern</button>
                </form>
            </div>
        </div>
    `
    const popupElement = document.createElement('div')
    popupElement.innerHTML = popupHTML
    htmlBody.appendChild(popupElement)

    // Close button event listener
    const closeButton = popupElement.querySelector('.close')
    closeButton.addEventListener('click', closePopup)

    // Popup overlay close event
    popupElement.addEventListener('click', (e) => {
        if (e.target.classList.contains('popup')) {
            closePopup()
        }
    })

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closePopup()
        }
    })

    // Form submission event listener
    const form = popupElement.querySelector('form')
    form.addEventListener('submit', (e) => {
        e.preventDefault()
        const form = e.target
        const reader = new FileReader()
        const file = e.target.image_file.files[0]
        if (file) {
            reader.onloadend = function () {
                const data = {
                    first_name: form.first_name.value,
                    last_name: form.last_name.value,
                    birth_year: form.birth_year.value,
                    death_year: form.death_year.value,
                    image: reader.result,
                    parent_id: id,
                }
                console.log(data)
                submitAddChild(data)
            }
            reader.readAsDataURL(file)
        } else {
            const data = {
                first_name: form.first_name.value,
                last_name: form.last_name.value,
                birth_year: form.birth_year.value,
                death_year: form.death_year.value,
                image: form.image_text.value,
                parent_id: id,
            }
            submitAddChild(data)
        }
    })
}

/**
 * Submits the add child form data to the server.
 * @param {*} data
 */
async function submitAddChild(data) {
    const xml = `
<?xml version="1.0" encoding="UTF-8"?>
<person>
    <first_name>${data.first_name}</first_name>
    <last_name>${data.last_name}</last_name>
    <birth_year>${data.birth_year}</birth_year>
    <death_year>${data.death_year}</death_year>
    <parent_id>${data.parent_id}</parent_id>
    <image>${data.image}</image>
</person>
    `
    const res = await fetch('/api/person/addChild', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/xml',
        },
        body: xml,
    })
    if (res.ok) {
        renderFamilytree()
        renderPersonCount()
        closePopup()
    } else {
        alert('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.')
    }
}
