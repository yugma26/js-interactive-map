const myMap = L.map('map', {
    center: [40.884605606388185, -74.14011787293876],
    zoom: 12,
});

// add openstreetmap tiles


L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href=>OpenStreetMap</a> contributors',
    minZoom: '15',
}).addTo(myMap)

// create and main add geolocation marker

const marker = L.marker([40.884605606388185, -74.14011787293876])
marker.addTo(myMap).bindPopup('<p1><b>Clifton, NJ</b></p1>').openPopup()


// draw the 2nd arrondissement
const latlngs = [                                       
[48.863368120198004, 2.3509079846928516],
[48.86933262048345, 2.3542531602919805],
[48.87199261164275, 2.3400569901592183],
[48.86993336274516, 2.3280142476578813],
[48.86834104280146, 2.330308418109664]
];

const polygon = L.polygon(latlngs, {
    color: 'red', 
    fillOpacity: 0.4
}).addTo(myMap)



// create red pin marker

//const rS = L.marker([48.866200610611926, 2.352236247419453],{icon: redPin}).bindPopup('RÃ©aumur-SÃ©bastopol')

// metro station markers


const rS = L.marker([40.876216013163145, -74.12383829415626]).bindPopup('Georges Coffee Shop')
const sSD = L.marker([40.85774606510722, -74.14705977999493]).bindPopup('the love of grub')
const sentier = L.marker([40.85991470275747, -74.12855294775687]).bindPopup('city fresh market')
// const bourse = L.marker([48.86868503971672, 2.3412285142058167]).bindPopup('Bourse')
// const qS = L.marker([48.869560129483226, 2.3358638645569543]).bindPopup('Quatre Septembre')
// const gB = L.marker([48.871282159004856, 2.3434818588892714]).bindPopup('Grands Boulevards')

const stations = L.layerGroup([rS,sSD,sentier]).addTo(myMap)

const mymap = {
    coordinates: [],
    businesses: [],
    map: {},
    markers: {},
    
    // build leaflet map
    buildMap() {
      this.map = L.map('map', {
      center: this.coordinates,
      zoom: 11,
      });
      // add openstreetmap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      minZoom: '15',
      }).addTo(this.map)
      // create and add geolocation marker
      const marker = L.marker(this.coordinates)
      marker
      .addTo(this.map)
      .bindPopup('<p1><b>You are here</b><br></p1>')
      .openPopup()
    },
    
    // add business markers
    addMarkers() {
      for (var i = 0; i < this.businesses.length; i++) {
      this.markers = L.marker([
        this.businesses[i].lat,
        this.businesses[i].long,
      ])
        .bindPopup(`<p1>${this.businesses[i].name}</p1>`)
        .addTo(this.map)
      }
    },
   }
    
   // get coordinates via geolocation api
   async function getCoords(){
    const pos = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject)
    });
    return [pos.coords.latitude, pos.coords.longitude]
   }
    
   // get foursquare businesses
   async function getFoursquare(business) {
    const options = {
      method: 'GET',
      headers: {
      Accept: 'application/json',
      Authorization: 'fsq3Eo6PDDCSQPxjh4FRLEP5pMARTlLKZCr6Bdp0OciGj9U='
      }
    }
    let limit = 5
    let lat = myMap.coordinates[0]
    let lon = myMap.coordinates[1]
    let response = await fetch(`https://api.foursquare.com/v3/places/search?&query=${business}&limit=${limit}&ll=${lat}%2C${lon}`, options)
    let data = await response.text()
    let parsedData = JSON.parse(data)
    debugger
    let businesses = parsedData.results
    debugger
    return businesses
    
   }
   // process foursquare array
   function processBusinesses(data) {
    let businesses = data.map((element) => {
      debugger
      let location = {
        name: element.name,
        lat: element.geocodes.main.latitude,
        long: element.geocodes.main.longitude
      };
      debugger
      return location
    })
    return businesses
   }
    
    
   // event handlers
   // window load
   window.onload = async () => {
    const coords = await getCoords()
    myMap.coordinates = coords
    myMap.buildMap()
   }
    
   // business submit button
   document.getElementById('submit').addEventListener('click', async (event) => {
    event.preventDefault()
    let business = document.getElementById('business').value
    let data = await getFoursquare(business)
    myMap.businesses = processBusinesses(data)
    myMap.addMarkers()
   })
   