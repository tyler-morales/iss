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

// switch between conversions
btn.addEventListener('click', () => {

    // check for session storage
    if (sessionStorage.getItem('velocityUnit')) {
        console.log('session loaded')

        //convert mi -> km
        if (btn.dataset.value == 'mi') {
            btn.dataset.value = 'km'
            // sessionStorage.setItem('velocityUnit', 'km')

            velStr = velEl.textContent
            let velClean = velStr.split(' ');
            velClean = Number(velClean[0].split(',').join(''))
            velClean = convertMiToKm(velClean).toFixed(2)
            velClean = formatNumber(velClean)
            velClean = velClean.substring(0, 9)
            sessionStorage.setItem('velocityUnit', `${velClean} km/hr`)
            velEl.textContent = `${sessionStorage.getItem('velocityUnit')}`

            console.log('storage exists and switched to km')
        } else {
            //convert km -> mi
            btn.dataset.value = 'mi'
            sessionStorage.setItem('velocityUnit', 'mi')

            velStr = velEl.textContent
            let velClean = velStr.split(' ');
            velClean = Number(velClean[0].split(',').join(''))
            velClean = convertKmToMi(velClean).toFixed(2)
            velClean = formatNumber(velClean)
            velClean = velClean.substring(0, 9)
            sessionStorage.setItem('velocityUnit', `${velClean} mi/hr`)
            velEl.textContent = `${sessionStorage.getItem('velocityUnit')}`

            console.log('storage exists and switched to mi')
        }
    }
    // no storage exists
    else {
        //convert mi -> km
        if (btn.dataset.value == 'mi') {
            btn.dataset.value = 'km'

            velStr = velEl.textContent
            let velClean = velStr.split(' ');
            velClean = Number(velClean[0].split(',').join(''))
            velClean = convertMiToKm(velClean).toFixed(2)
            velClean = formatNumber(velClean)
            velClean = velClean.substring(0, 9)
            sessionStorage.setItem('velocityUnit', `${velClean} km/hr`)
            velEl.textContent = `${sessionStorage.getItem('velocityUnit')}`

            console.log('no storage exists and switched to km')
        }
    }
})
console.log(sessionStorage)


// hide/show about info
btnISS.addEventListener('mouseenter', () => {
    aboutEl.classList.add('show')
})
btnISS.addEventListener('mouseleave', () => {
    aboutEl.classList.remove('show')
})

let firstTime = true

// Making a map and tiles
const mymap = L.map('issMap').setView([0, 0], 2);
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
            // if (sessionStorage.getItem('velocityUnit')) {
            //     // session exists
            //     velEl.textContent = `${sessionStorage.getItem('velocityUnit')}`
            //     console.log('get # from storage')
            // } else {
            //     // no storage exists yet
            //     velEl.textContent = `${velMi} mi/hr`
            //     console.log('no storage exists')
            // }

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