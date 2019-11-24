// API URL's
const api_url_id = 'https://api.wheretheiss.at/v1/satellites/25544'

//async await getISS fn
async function getISS() {
    const zoomLevel = 3
    const response = await fetch(api_url_id)
    if (response.status === 200) {
        // console.log('Success 🎊, coordinates loaded')
        const data = await response.json()

        const {
            latitude,
            longitude
        } = data;

        // centers marker in middle of map
        if (firstTime) {
            mymap.setView([latitude, longitude], zoomLevel);
            firstTime = false;
        }

        return data
    } else if (response.status == 429) {
        throw new Error('📭 out of requests')
    } else {
        throw new Error('🚫 Unable to fetch ISS data')
    }
}

// async await getGeoLocation fn
async function getGeoLocation(latitude, longitude) {
    const response = await fetch(`https://api.wheretheiss.at/v1/coordinates/${latitude},${longitude}`)
    if (response.status === 200) {
        const data = await response.json()
        console.log('Success 🎊, GeoLocation loaded')
        return data
    } else if (response.status == 500) {
        countryEl.textContent = 'Over water 🌊'
    } else {
        throw new Error('🚫 Unable to fetch location data')
    }
}

// async await getCountry fn
async function getCountry(countryName) {
    const response = await fetch(`https://restcountries.eu/rest/v2/alpha/${countryName}`)
    if (response.status === 200) {
        const data = await response.json()
        console.log('Success 🎊, Country name loaded')
        return data
    } else {
        throw new Error('🚫 Unable to fetch country name')
    }
}