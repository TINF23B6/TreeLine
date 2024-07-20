/**
 * Opens the add new spouse popup.
 * @param {string} id - The ID of the spouse.
 */
function openAddNewSpousePopup(id) {
    const htmlBody = document.querySelector('body')
    const popupHTML = `
<div class="popup" onclick="event.target.classList.contains('popup') && closePopup()">
    <div class="content">
        <div class="header">
            <h1>Partner:in hinzufügen</h1>
            <img src="/assets/img/close.svg" class="close" onclick="closePopup()">
        </div>
        <form class="popup-form" onsubmit="submitAddSpouseForm(event, ${id})">
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
    htmlBody.insertAdjacentHTML('beforeend', popupHTML)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closePopup()
        }
    })
}

/**
 * Submits the add spouse form data.
 * @param {Event} e - The submit event.
 * @param {string} id - The ID of the spouse.
 */
async function submitAddSpouseForm(e, id) {
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
                spouse_id: id,
            }
            console.log(data)
            submitAddSpouse(data)
        }
        reader.readAsDataURL(file)
    } else {
        const data = {
            first_name: form.first_name.value,
            last_name: form.last_name.value,
            birth_year: form.birth_year.value,
            death_year: form.death_year.value,
            image: form.image_text.value,
            spouse_id: id,
        }
        submitAddSpouse(data)
    }
}

/**
 * Submits the add spouse data to the server.
 * @param {object} data - The add spouse data.
 */
async function submitAddSpouse(data) {
    const xml = `
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE person SYSTEM "person_add_spouse.dtd">
<person>
    <first_name>${data.first_name}</first_name>
    <last_name>${data.last_name}</last_name>
    <birth_year>${data.birth_year}</birth_year>
    <death_year>${data.death_year}</death_year>
    <spouse_id>${data.spouse_id}</spouse_id>
    <image>${data.image}</image>
</person>
    `
    fetch('/api/person/addSpouse', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/xml',
        },
        body: xml,
    }).then((res) => {
        if (res.ok) {
            renderFamilytree()
            renderPersonCount()
            closePopup()
        } else {
            alert('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.')
        }
    })
}
