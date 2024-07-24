// declare variables
let mapOptions = {'centerLngLat': [-98.48424650,39.01190200],'startingZoomLevel':4}

const map = new maplibregl.Map({
    container: 'map', // container ID
    style: 'https://api.maptiler.com/maps/streets-v2-light/style.json?key=wsyYBQjqRwKnNsZrtci1', // Your style URL
    center: mapOptions.centerLngLat, // Starting position [lng, lat]
    zoom: mapOptions.startingZoomLevel // Starting zoom level
});

function addMarker(feature){
    let longitude = feature.lng;
    let latitude = feature.lat;
    let title = feature['What is your home zip code?'];
    let message = feature['Finally, how do you perceive your culture as a Southeast Asian American to affect your experience as an LGBTQ+ person at UCLA, if at all?'];

    let popup_message = `<h2>${title}</h2> <h3>${message}</h3>`
    new maplibregl.Marker()
        .setLngLat([longitude, latitude])
        .setPopup(new maplibregl.Popup()
            .setHTML(popup_message))
        .addTo(map)
    createButtons(latitude,longitude,title);
    return message
}

function createButtons(lat,lng,title){
    const newButton = document.createElement("button");
    newButton.id = "button"+title;
    newButton.innerHTML = title;
    newButton.setAttribute("lat",lat);
    newButton.setAttribute("lng",lng);
    newButton.addEventListener('click', function(){
        map.flyTo({
            center: [lng,lat],
        })
    })
    document.getElementById("contents").appendChild(newButton);
}

const dataUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSlPULuULAEXwfQ3IHZWjUk5_3sU3GTGkb94julK7VYDk52KtlR74YcQjtYeNVw2MRickuClVNHfabv/pub?output=csv";

map.on('load', function() {
    Papa.parse(dataUrl, {
        download: true,
        header: true,
        complete: results =>{
            processData(results.data);
        }
    });
});

function processData(results){
    results.forEach(feature => {
        addMarker(feature);
    });
};