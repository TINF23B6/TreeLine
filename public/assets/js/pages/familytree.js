// Constants / Initial values
const xsltUrl = 'assets/xml/stammbaum.xsl'
let isFirstRender = true
window.familyTreeScale = 1
let scroolWheelZoomSpeed = 0.0025
let trackPadZoomSpeed = 0.005
let minScale = 0.5
let maxScale = 2.5

/**
 * Renders the family tree, with the current family ID
 * set in the window object.
 */
function renderFamilytree() {
    const familyId = window.familyID
    // Load XML from DB
    fetch(`/api/family/${familyId}/people`)
        .then((response) => response.text())
        .then((xml) => {
            // Load XSLT
            fetch(xsltUrl)
                .then((response) => response.text())
                .then((xslt) => {
                    console.log(isFirstRender)
                    // Transform XML
                    const xsltProcessor = new XSLTProcessor()
                    const parser = new DOMParser()
                    const xmlDoc = parser.parseFromString(xml, 'text/xml')
                    const xslDoc = parser.parseFromString(xslt, 'text/xml')
                    xsltProcessor.importStylesheet(xslDoc)
                    const resultDocument =
                        xsltProcessor.transformToDocument(xmlDoc)
                    const resultHTML = new XMLSerializer().serializeToString(
                        resultDocument
                    )
                    const stammbaumContainer = document.getElementById(
                        'stammbaum-xslt-container'
                    )
                    stammbaumContainer.innerHTML = resultHTML
                    // Add animation
                    if (isFirstRender) {
                        const liElements = document.querySelectorAll('.tree li')
                        liElements.forEach((element) => {
                            element.style.animation =
                                'animate-entry 1.5s ease-out forwards'
                        })
                    }
                    isFirstRender = false
                })
        })
}

/**
 * Renders the person count in the controls panel.
 */
function renderPersonCount() {
    const familyId = window.familyID
    fetch(`/api/family/${familyId}/people`)
        .then((response) => response.text())
        .then((xml) => {
            const parser = new DOMParser()
            const xmlDoc = parser.parseFromString(xml, 'text/xml')
            const personCount = xmlDoc.querySelectorAll('person').length
            const personCountElement = document.getElementById('person-count')
            personCountElement.innerHTML = `Insgesamt ${personCount} Personen`
        })
}

/**
 * Renders the family select input dropdown.
 */
function renderFamilySelect() {
    const select = document.getElementById('family-select')
    fetch('/api/family')
        .then((response) => response.text())
        .then((xml) => {
            const parser = new DOMParser()
            const xmlDoc = parser.parseFromString(xml, 'text/xml')
            const families = xmlDoc.querySelectorAll('family')
            families.forEach((family) => {
                const option = document.createElement('option')
                option.value = family.querySelector('id').textContent
                option.text = family.querySelector('name').textContent
                select.appendChild(option)
            })
        })
    select.addEventListener('change', (event) => {
        window.familyID = event.target.value
        document.title = `TreeLine | Familie ${event.target.selectedOptions[0].text}`
        renderFamilytree()
        renderPersonCount()
    })
}

/**
 * Handles user input in the search field.
 * @param {*} event - The input-change event.
 */
function handleSearch(event) {
    const query = event.target.value
    let elements = document.getElementsByTagName('b')
    elements = Array.from(elements)
    if (query === '') {
        elements.forEach((element) => {
            element.style.backgroundColor = 'transparent'
        })
        return
    }
    let resultCount = 0
    elements.forEach((element) => {
        if (element.innerHTML.toLowerCase().includes(query.toLowerCase())) {
            element.style.backgroundColor = 'yellow'
            element.scrollIntoView({ behavior: 'smooth' })
            resultCount += 1
        } else {
            element.style.backgroundColor = 'transparent'
        }
    })
    if (resultCount < 1 && query !== '') {
        event.srcElement.style.outline = '2px solid red'
    } else {
        event.srcElement.style.outline = 'none'
    }
}

/**
 * Handles the zooming in and out of the family tree.
 * @param {*} event - The wheel event.
 */
function handleZoom(event) {
    if (event.ctrlKey) {
        const stammbaumContainer = document.getElementById(
            'stammbaum-xslt-container'
        )
        document.getElementById('reset-zoom').style.display = 'block'
        event.preventDefault()
        hideAddNewMenu()
        const rect = stammbaumContainer.getBoundingClientRect()
        const mouseX = event.clientX - rect.left
        const mouseY = event.clientY - rect.top
        const originX = (mouseX / rect.width) * 100
        const originY = (mouseY / rect.height) * 100
        let zoomSpeed =
            Math.abs(event.deltaY) < 50
                ? trackPadZoomSpeed
                : scroolWheelZoomSpeed
        let newScale = window.familyTreeScale + event.deltaY * -zoomSpeed
        newScale = Math.min(Math.max(minScale, newScale), maxScale)
        newScale = Math.round(newScale * 100) / 100
        if (newScale !== window.familyTreeScale) {
            window.familyTreeScale = newScale
            stammbaumContainer.style.zoom = window.familyTreeScale
        }
    }
}

/**
 * Resets the zoom level of the family tree.
 */
function resetZoom() {
    window.familyTreeScale = 1
    const stammbaumContainer = document.getElementById(
        'stammbaum-xslt-container'
    )
    stammbaumContainer.style.zoom = window.familyTreeScale
    document.getElementById('reset-zoom').style.display = 'none'
}

/**
 * Prepares the document by fetching the first family and rendering the family tree,
 * person count, and family select dropdown.
 * Also adds an event listener to the search input field.
 */
function prepareDocument() {
    // Get the first family by default
    fetch('/api/family')
        .then((response) => response.text())
        .then((xml) => {
            const parser = new DOMParser()
            const xmlDoc = parser.parseFromString(xml, 'text/xml')
            const familyIdElem = xmlDoc.querySelector('id')
            const families = xmlDoc.querySelectorAll('family')
            const stammbaumContainer = document.getElementById(
                'stammbaum-xslt-container'
            )
            if (families.length < 1) {
                document.title = 'TreeLine | Keine Familie vorhanden'
                stammbaumContainer.innerHTML = `<div id="no-families-warning">
                        <h4>Keine Familie vorhanden</h4>
                        <p>Bitte füge eine neue Familie über die Einstellungen hinzu.</p>
                    </div>
                    `
                return
            }
            const familyID = familyIdElem.textContent
            // Set a global variable to the current family ID
            window.familyID = familyID
            document.title = `TreeLine | Familie ${xmlDoc.querySelector('name').textContent}`
            renderFamilytree()
            renderPersonCount()
            renderFamilySelect()
            const searchInput = document.getElementById('search')
            // Add event listeneres for search and zoom
            searchInput.addEventListener('input', handleSearch)
            const mainContainer = document.getElementById('main-container')
            mainContainer.addEventListener('wheel', handleZoom)
        })
}
document.addEventListener('DOMContentLoaded', prepareDocument)
