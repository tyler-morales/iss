// cache the DOM
const latEl = document.getElementById('lat')
const lonEl = document.getElementById('lon')
const velEl = document.getElementById('vel')
const visEl = document.getElementById('vis')
const btn = document.getElementById('convertKmToMi')
const countryEl = document.getElementById('country')
const astrosEl1 = document.getElementById('astros1')
const astrosEl2 = document.getElementById('astros2')
const astroNameEl = document.getElementById('people')
const aboutEl = document.getElementById('about')
const statCardEl = document.getElementById('stats')
const btnISS = document.getElementById('aboutBtn')

const bgEl = document.querySelector('body')

// Globals
let firstTime = true

// // switch between conversions
// btn.addEventListener('click', () => {

//     // No storage exists
//     if (sessionStorage.getItem('velocity') == null) {
//         //convert mi -> km
//         btn.dataset.value = 'km'

//         velStr = velEl.textContent
//         let velClean = velStr.split(' ');
//         velClean = Number(velClean[0].split(',').join(''))
//         velClean = convertMiToKm(velClean).toFixed(2)
//         velClean = formatNumber(velClean)
//         velClean = velClean.substring(0, 9)
//         sessionStorage.setItem('velocity', `${velClean} km/hr`)

//         velEl.textContent = `${sessionStorage.getItem('velocity')}`

//         console.log('storage now exists and switched to km')
//     }
//     // Storage exists
//     else {
//         console.log('session loaded')

//         //convert mi -> km
//         if (btn.dataset.value == 'mi') {
//             btn.dataset.value == 'km'

//             velStr = velEl.textContent
//             let velClean = velStr.split(' ');
//             velClean = Number(velClean[0].split(',').join(''))
//             velClean = convertMiToKm(velClean).toFixed(2)
//             velClean = formatNumber(velClean)
//             velClean = velClean.substring(0, 9)
//             sessionStorage.setItem('velocity', `${velClean} km/hr`)

//             velEl.textContent = `${sessionStorage.getItem('velocity')}`

//             console.log('storage exists and switched to km')
//         }

//         //convert km -> mi
//         if (btn.dataset.value == 'km') {
//             btn.dataset.value == 'mi'

//             velStr = velEl.textContent
//             let velClean = velStr.split(' ');
//             velClean = Number(velClean[0].split(',').join(''))
//             velClean = convertMiToKm(velClean).toFixed(2)
//             velClean = formatNumber(velClean)
//             velClean = velClean.substring(0, 9)
//             sessionStorage.setItem('velocity', `${velClean} mi/hr`)

//             velEl.textContent = `${sessionStorage.getItem('velocity')}`

//             console.log('storage exists and switched to mi')
//         }
//     }
// })

console.log(sessionStorage)


// hide/show about info
btnISS.addEventListener('mouseenter', () => {
    aboutEl.classList.add('show')
})
btnISS.addEventListener('mouseleave', () => {
    aboutEl.classList.remove('show')
})



// Making a map and tiles
const mymap = L.map('issMap').setView([0, 0], 1);
const attribution =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileUrl, {
    attribution
});
tiles.addTo(mymap);

// custom marker icon
const issIcon = L.icon({
    iconUrl: 'satalite.png',
    iconSize: [50, 32],
    iconAnchor: [25, 16]
});
const marker = L.marker([0, 0], {
    icon: issIcon
}).addTo(mymap);

//change metrics

//render DOM
function renderDOM() {

    getISS()
        .then(function ({
            latitude,
            longitude,
            velocity,
            visibility,
        }) {
            //update lat/ long coords
            marker.setLatLng([latitude, longitude]);

            // format data
            let lat = roundNumber(latitude)
            let lon = roundNumber(longitude)

            let velKm = roundNumber(velocity)
            velKm = formatNumber(velKm)

            let velMi = convertKmToMi(velocity)
            velMi = roundNumber(velMi)
            velMi = formatNumber(velMi)

            //add elements to DOM
            latEl.textContent = `${lat}°`
            lonEl.textContent = `${lon}°`
            velEl.textContent = `${velMi} mi/hr`

            visibility == 'daylight' ? regularMode() : darkMode()

            return getGeoLocation(latitude, longitude)
        })
        // if ISS is over a country -> return its country code
        .then(function ({
            country_code,
        }) {
            return getCountry(country_code)
        })
        // if a country code exists -> return its the name and flag
        .then(function ({
            name,
            flag
        }) {
            // get country
            countryEl.textContent = name
            // get flag of country
            const imgEl = new Image(30, 20)
            imgEl.src = flag
            imgEl.classList.add('moveDown')
            countryEl.appendChild(imgEl)
            return getAstros()
        })
}

function renderAstrosDOM() {
    getAstros().then(function ({
        number,
        people
    }) {
        //get # of current astronauts
        astrosEl1.textContent = `${number}`
        astrosEl2.textContent = `${number}`

        //get astronaut names
        let peopleArr = []

        for (let i = 0; i < people.length; i++) {
            let nameEl = document.createElement("li")

            nameEl.classList.add('card--label')
            nameEl.textContent = people[i].name

            astroNameEl.appendChild(nameEl)
            peopleArr.push(people[i].name)
        }
    })
}

renderAstrosDOM()
renderDOM()
setInterval(renderDOM, 10000)