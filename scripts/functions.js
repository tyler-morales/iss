//add commas to numbers
function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

// round decimals
function roundNumber(num) {
    return num.toFixed(2)
}

//convert km -> mi (mi=km/1.609)
function convertKmToMi(velocity) {
    return velocity / 1.609
}
//convert mi -> km (mi=km/1.609)
function convertMiToKm(velocity) {
    return velocity * 1.609
}

//transition light --> dark
const trans = () => {
    document.documentElement.classList.add('transition')
    window.setTimeout(() => {
        document.documentElement.classList.remove('transition')
    }, 2000)
}

//dark mode
const darkMode = () => {
    visEl.textContent = `Earth's Shadow 🌑`
    trans()
    document.documentElement.setAttribute('data-theme', 'dark')
}

//regular mode
const regularMode = () => {
    visEl.textContent = `Daytime ☀️`
    trans()
    // document.documentElement.setAttribute('data-theme', 'light')
}

//convert velocity text content
function convertVelText(unit) {
    velStr = velEl.textContent
    let velClean = velStr.split(' ');
    velClean = Number(velClean[0].split(',').join(''))
    velClean = unit(velClean).toFixed(2)
    velClean = formatNumber(velClean)
    velClean = velClean.substring(0, 9)
    return velClean
}