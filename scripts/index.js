//console.log("testing 123")

let allBreweriesList = []
// drawing th map to  the screen
mapboxgl.accessToken = 'pk.eyJ1IjoiamJvZXJuZXI1NiIsImEiOiJjanQ5enp3OW0wMTBnNDRwNGRxOHN4OWczIn0.R8Q3ymvlpjg6gyshPanT0Q';
let map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/streets-v11',
// default center for where the map loads
center: [-96,37.8],
zoom: 3
});
// Sets the url for the breweries API so we can get all the pages of data
function urlForThePage(pageNumber = 0) {
    return `https://api.openbrewerydb.org/breweries?page=${pageNumber}&per_page=50`
}


// Takes in theActualData then adds the information to allBreweriesList
function acumilateBreweries(theActualData) {
    console.log(theActualData);
    allBreweriesList = [
        ...allBreweriesList, 
        ...theActualData
    ];
    // use allBreweriesList which contains Brewery API Data and calls the store function to store data in local storage
    storeBreweries(allBreweriesList);

    // We know there are no more breweries to load
    // when the APU sends us empty array
    if (theActualData.length === 0) {
        // when all breweries info has been stored call main function again
        main();
    }
}

function loadBreweries() {
    const jsonBreweries = localStorage.getItem("breweries-data");
    const arrayOfBreweries = JSON.parse(jsonBreweries)
    return arrayOfBreweries
}

// Takes in a page number and then fetches or requests that page from the breweries API
function retrievePageOfBreweries(pageNumber){
    fetch(urlForThePage(pageNumber))
    // returns the fetch response and converts to json
    .then(function (response) {
        return response.json()
    }) 
    // calls accumulateBreweries function to add all Brewery API pages data allBreweriesList
    .then(acumilateBreweries)
}

// function takes object from brewery api and pulls its info to display
function drawBreweryDataToDetail(breweryObject) {
    console.log(breweryObject)
}

// function takes object from brewery api
function drawSingleBreweryListByStateToList(breweryObject) {
    console.log(breweryObject)
    // from the object we grab the breweries name
    const breweryName = breweryObject.name
    // if brewery doesnt have a name or it cant be pulled we returns nothing 
    if (breweryName.length === 0) {
        return;
    }
    // creating a new anchor element and setting the element name
    const anchorElement = document.createElement('brewery-Names');
    // set the new elements text to the name of the brewery
    anchorElement.textContent = breweryName;

    // we need to add ability to click on those names and have the details pull up

}

// function drawBreweryListByStateToList(breweries=allBreweriesList) {
//     console.log(breweryObject)
//     const listArea =  where the names list by state will be drawn
//     breweries.forEach(drawSingleBreweryListByStateToList)
// }

// stores the breweries APU data in local storage
function storeBreweries(arrayOfBreweries) {
    const jsondata = JSON.stringify(arrayOfBreweries);
    localStorage.setItem("breweries-data", jsondata)
}
// adds pins for brewery onto map
function addSinglePinToMap(breweryObject){
let breweryLng = breweryObject.longitude;
let breweryLat = breweryObject.latitude;
let breweryLocation = [breweryLng, breweryLat]
let marker = new mapboxgl.Marker()
    .setLngLat(breweryLocation)
    .addTo(map);
}
function addAllPinsToMap(breweries=allBreweriesList){
    breweries.forEach(addSinglePinToMap);
}

function geoLocateUser(){
    map.addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: false,
        showUserLocation: true
    }));
}

function main() {
    let breweriesInLocalStorage = loadBreweries();
    if (breweriesInLocalStorage) {
        allBreweriesList = [
            ...breweriesInLocalStorage
        ];
    } else {
        for (pageNumber= 0; pageNumber <= 161 ; pageNumber++) {
            retrievePageOfBreweries(pageNumber);
        }
    } 
    addAllPinsToMap();
    geoLocateUser();
}
main()
