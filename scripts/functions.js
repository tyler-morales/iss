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

//  Dropdown

// Dropdown Menu
let dropdown = document.querySelectorAll('.dropdown');
let dropdownArray = Array.prototype.slice.call(dropdown,0);
dropdownArray.forEach(function(el){
	let button = el.querySelector('a[data-toggle="dropdown"]'),
			menu = el.querySelector('.dropdown-menu'),
			arrow = button.querySelector('i.icon-arrow');

	button.onclick = function(event) {
		if(!menu.hasClass('show')) {
			menu.classList.add('show');
			menu.classList.remove('hide');
			arrow.classList.add('open');
			arrow.classList.remove('close');
			event.preventDefault();
		}
		else {
			menu.classList.remove('show');
			menu.classList.add('hide');
			arrow.classList.remove('open');
			arrow.classList.add('close');
			event.preventDefault();
		}
	};
})

Element.prototype.hasClass = function(className) {
    return this.className && new RegExp("(^|\\s)" + className + "(\\s|$)").test(this.className);
};

//media query
function myFunction(x) {
    if (x.matches) { 
    //   document.body.style.backgroundColor = "green";
    } else {
    //  document.body.style.backgroundColor = "pink";
    }
  }
  
  var x = window.matchMedia("(max-width: 800px)")
  myFunction(x) // Call listener function at run time
  x.addListener(myFunction) // Attach listener function on state changes