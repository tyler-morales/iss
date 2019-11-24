// CACHE THE DOM
// Stats
const latEl = document.getElementById('lat')
const lonEl = document.getElementById('lon')
const velEl = document.getElementById('vel')
const visEl = document.getElementById('vis')
const countryEl = document.getElementById('country')

// Mini Stats
const miniStat = document.getElementById('data')
const label = document.getElementById('label')

// About btn
const aboutBtn = document.getElementById('about-btn')
const aboutInfo = document.getElementById('about-info')
const sourceEl = document.getElementById('source')

// Resize btn
const minBtn = document.getElementById('minimize')
const cardEl = document.getElementById('card-reg')
const maxBtn = document.getElementById('maximize')
const cardMiniEl = document.getElementById('card-sm')

// Globals
let firstTime = true

// Hide/show cards
minBtn.addEventListener('click', () => {
    cardMiniEl.classList.add('visible')
    cardEl.classList.add('hidden')
    cardEl.classList.remove('visible')
})

maxBtn.addEventListener('click', () => {
    cardEl.classList.add('visible')
    cardMiniEl.classList.remove('visible')
    cardMiniEl.classList.add('hidden')
})




// Hide/show about info
aboutBtn.addEventListener('click', () => {
    aboutInfo.classList.toggle('visible')
    sourceEl.classList.toggle('visible')

    if (aboutBtn.dataset.visibility == 'hidden') {
        aboutBtn.textContent = '– Hide'
        aboutBtn.dataset.visibility = 'visible'
    } else {
        aboutBtn.textContent = '+ About the ISS'
        aboutBtn.dataset.visibility = 'hidden'
    }
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

            //add elements to DOM (reg card)
            latEl.textContent = `${lat}°`
            lonEl.textContent = `${lon}°`
            velEl.textContent = `${velMi} mi/hr`

            // add elements to DOM (mini-card)
            label.textContent = 'Latitude'
            miniStat.textContent = `${lon}°`

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
        })
}

renderDOM()
setInterval(renderDOM, 10000)