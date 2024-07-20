/**
 * Renders the list of families and the buttons to edit and delete them.
 */
function renderFamilies() {
    const familyList = document.getElementById('family-list')
    fetch('/api/family')
        .then((response) => response.text())
        .then((families) => {
            // Parse XML data
            const parser = new DOMParser()
            const xml = parser.parseFromString(families, 'application/xml')
            const familyNodes = xml.getElementsByTagName('family')
            // Clear the list
            familyList.innerHTML = ''
            // Add each family to the list
            for (let i = 0; i < familyNodes.length; i++) {
                const family = familyNodes[i]
                console.log(family)
                const familyId =
                    family.getElementsByTagName('id')[0].textContent
                const familyName =
                    family.getElementsByTagName('name')[0].textContent
                console.log(familyId)
                const familyItem = document.createElement('div')
                familyItem.classList.add('family-item')
                familyItem.innerHTML = `
					<input type="text" placeholder="${familyName}" value="${familyName}" id="family-${familyId}">
					<button onclick="updateFamily(${familyId})">Umbenennen</button>
					<button class="destructive" onclick="deleteFamily(${familyId})">Delete</button>
				`
                familyList.appendChild(familyItem)
            }
        })
}

/**
 * Deletes a family by ID.
 * @param {number} id - The ID of the family to delete.
 */
function deleteFamily(id) {
    fetch(`/api/family/${id}`, {
        method: 'DELETE',
    })
        .then((response) => response.text())
        .then((message) => {
            alert(message)
            renderFamilies()
        })
}

/**
 * Updates a family by ID.
 * @param {number} id - The ID of the family to update.
 */
function updateFamily(id) {
    const input = document.getElementById(`family-${id}`)
    const name = input.value
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE user SYSTEM "family_name.dtd">
	<family>
		<name>${name}</name>
	</family>
	`
    fetch(`/api/family/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/xml',
        },
        body: xml,
    })
        .then((response) => response.text())
        .then((message) => {
            alert(message)
            renderFamilies()
        })
}

/**
 * Adds a new family.
 * @param {Event} event - The form submission event.
 */
function addFamily(event) {
    event.preventDefault()
    const input = document.getElementById('family-name')
    const name = input.value
    input.value = ''
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE user SYSTEM "family_name.dtd">
	<family>
		<name>${name}</name>
	</family>
	`
    fetch('/api/family', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/xml',
        },
        body: xml,
    })
        .then(() => {
            renderFamilies()
        })
        .catch((error) => {
            console.error('Error:', error)
        })
}

/**
 * Renders the display name of the currently logged in user.
 */
function renderDisplayName() {
    const input = document.getElementById('username')
    fetch('/api/auth/session')
        .then((response) => response.text())
        .then((data) => {
            const parser = new DOMParser()
            const xml = parser.parseFromString(data, 'application/xml')
            const displayName =
                xml.getElementsByTagName('displayName')[0].textContent
            input.value = displayName
        })
}

/**
 * Updates the user's display name and password.
 * @param {Event} event - The form submission event.
 */
function updateUser(event) {
    event.preventDefault()
    const input = document.getElementById('username')
    const password = document.getElementById('password').value
    const display_name = input.value
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE user SYSTEM "user.dtd">
    <user>
        <display_name>${display_name}</display_name>
        ${password ? `<password>${password}</password>` : ''}
    </user>
    `
    fetch('/api/user', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/xml',
        },
        body: xml,
    })
        .then((res) => res.text())
        .then((data) => {
            const parser = new DOMParser()
            const xml = parser.parseFromString(data, 'application/xml')
            const success = xml.getElementsByTagName('success')[0].textContent
            const message = xml.getElementsByTagName('message')[0].textContent
            if (success === 'true') {
                alert(message)
                window.location.href = '/api/auth/logout'
            } else {
                alert(message)
            }
        })
        .catch((error) => {
            console.error('Error:', error)
        })
}

// Render the families + display and add event listeners on page load
document.addEventListener('DOMContentLoaded', () => {
    renderFamilies()
    renderDisplayName()
    document
        .getElementById('add-family-form')
        .addEventListener('submit', addFamily)
    document
        .getElementById('edit-user-form')
        .addEventListener('submit', updateUser)
})
