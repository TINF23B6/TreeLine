/**
 * Opens the edit popup for a person.
 * @param {*} id - The ID of the person.
 */
function openEditPopup(id) {
    // Fetch data from XML API
    fetch(`/api/person/${id}`)
        .then((res) => res.text())
        .then((data) => {
            // Parse API response
            const parser = new DOMParser()
            const xml = parser.parseFromString(data, 'application/xml')
            const person = xml.querySelector('person')
            const personObject = {
                id: person.querySelector('id')?.textContent || '',
                first_name:
                    person.querySelector('first_name')?.textContent || '',
                last_name: person.querySelector('last_name')?.textContent || '',
                birth_year:
                    person.querySelector('birth_year')?.textContent || '',
                death_year:
                    person.querySelector('death_year')?.textContent || '',
                parents: Array.from(person.querySelectorAll('parent')).map(
                    (parent) => parent.getAttribute('ref')
                ),
            }
            createPopupHTML(personObject)
        })
}

/**
 * Creates the HTML for the popup.
 * @param {object} person - The person object.
 */
function createPopupHTML(person) {
    const htmlBody = document.querySelector('body')
    const popupHTML = `
        <div class="popup">
            <div class="content">
                <div class="header">
                    <h1>Person bearbeiten</h1>
                    <img src="/assets/img/close.svg" class="close" />
                </div>
                <form class="popup-form">
                    <label>
                        Vorname
                        <input placeholder="Vorname" name="first_name" type="text" value="${person.first_name}" required>
                    </label>
                    <label>
                        Nachname
                        <input placeholder="Nachname" name="last_name" type="text" value="${person.last_name}" required>
                    </label>
                    <label>
                        Geburtsjahr
                        <input placeholder="Geburtsjahr" name="birth_year" type="number" value="${person.birth_year}" required>
                    </label>
                    <label>
                        Todesjahr
                        <input placeholder="Todesjahr (optional)" name="death_year" type="number" value="${person.death_year}">
                    </label>
                    <label>
                        Personen-Bild
                        <div class="image-upload">
                            <input name="image_file" type="file">
                            <input placeholder="Bild-URL" name="image_text" type="text">
                        </div>
                    </label>
                    <div class="button-row">
                        <button type="submit" class="primary">Speichern</button>
                        <button type="button" class="destructive" onclick="deletePerson('${person.id}')">Person löschen</button>
                    </div>
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
        const file = form.image_file.files[0]
        if (file) {
            reader.onloadend = function () {
                const data = {
                    first_name: form.first_name.value,
                    last_name: form.last_name.value,
                    birth_year: form.birth_year.value,
                    death_year: form.death_year.value,
                    image: reader.result,
                }
                console.log(data)
                submitPersonUpdate(person.id, data)
            }
            reader.readAsDataURL(file)
        } else {
            const data = {
                first_name: form.first_name.value,
                last_name: form.last_name.value,
                birth_year: form.birth_year.value,
                death_year: form.death_year.value,
                image: form.image_text.value,
            }
            submitPersonUpdate(person.id, data)
        }
    })
}

/**
 * Submits the updated person data to the server.
 * @param {string} id - The ID of the person.
 * @param {object} data - The updated person data.
 */
function submitPersonUpdate(id, data) {
    // Transform data back to XML
    const xml = `
<?xml version="1.0" encoding="UTF-8"?>
<person>
    <first_name>${data.first_name}</first_name>
    <last_name>${data.last_name}</last_name>
    <birth_year>${data.birth_year}</birth_year>
    <death_year>${data.death_year}</death_year>
    <image>${data.image}</image>
</person>
    `
    // Send data to API
    fetch(`/api/person/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/xml',
        },
        body: xml,
    })
        .then((res) => res.text())
        .then((_) => {
            renderFamilytree()
            renderPersonCount()
            closePopup()
        })
}

/**
 * Deletes a person from the family tree.
 * @param {string} id - The ID of the person.
 */
async function deletePerson(id) {
    // Send DELETE request to API
    const res = await fetch(`/api/person/${id}`, {
        method: 'DELETE',
    })

    const data = await res.text()

    if (res.ok) {
        renderFamilytree()
        renderPersonCount()
        closePopup()
    } else {
        alert(
            data || 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.'
        )
    }
}
