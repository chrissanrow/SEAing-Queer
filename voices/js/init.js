// declare variables
let mapOptions = {'centerLngLat': [-98.48424650,39.01190200],'startingZoomLevel':4}

const map = new maplibregl.Map({
    container: 'map', // container ID
    style: 'https://api.maptiler.com/maps/dataviz/style.json?key=mP6OIUL7UJ4gpvVbg300', // Your style URL
    center: mapOptions.centerLngLat, // Starting position [lng, lat]
    zoom: mapOptions.startingZoomLevel // Starting zoom level
});

map.addControl(new maplibregl.NavigationControl());

function addMarker(feature, index){
    let longitude = feature.lng;
    let latitude = feature.lat;

    let title = feature['What is your home zip code?'];
    let message = feature['Finally, how do you perceive your culture as a Southeast Asian American to affect your experience as an LGBTQ+ person at UCLA, if at all?'];

    let popup_message = `
    <h1>${title}</h1>
    <br/>
    <h2>How does your culture as a Southeast Asian American interact with your experience as an LGBTQ+ person at UCLA?</h2>
    <br/>
    <h3>${message}</h3>
    `;

    /*
    FIX: cant figure out marker icons
    // create a DOM element for the marker
    const markerContainer = document.createElement('div');
    markerContainer.className = 'markerContainer';
    markerContainer.style.backgroundImage =
        `url(assets/prideflag.png)`;
    markerContainer.classList.add('marker-icon');
    */

    let marker = new maplibregl.Marker(/*{element: markerContainer}*/)
        .setLngLat([longitude, latitude])
        .setPopup(new maplibregl.Popup()
            .setHTML(popup_message))
        .addTo(map)
    

    //create corresponding info sections
    createInfoSection(feature, index, title);
    //create buttons
    createButtons(latitude,longitude,title,index);
}

function createButtons(lat,lng,title,index){
    const newButton = document.createElement("button");
    newButton.id = index+"button"+title;
    newButton.innerHTML = title;
    newButton.setAttribute("lat",lat);
    newButton.setAttribute("lng",lng);
    newButton.addEventListener('mouseover', function(){
        map.flyTo({
            center: [lng,lat],
        })
    })

    newButton.addEventListener('mouseover', () => openInfoSection(event, index, title))

    newButton.classList.add('marker-button');
    document.getElementById("buttons").appendChild(newButton);
}

function createInfoSection(feature, index, title){
    let question, message;

    //creating info section container

    const container = document.createElement("div");
    container.classList.add('info-container');
    let id = index + "container" + title;
    container.id = id;
    document.getElementById("experience-container").appendChild(container);

    //Adding survey data to the info section

    question = "Do you feel any legal/societal restrictions exist towards queer people in your community?";
    message = feature['Do you feel any legal and/or societal restrictions exist towards queer people in your community?'] + '. ' + feature['Why?'];
    addQuestionAndMessage(question, message, id);

    question = "What kind of support exists for LGBTQ+ identifying individuals in your communities?";
    message = feature['What kind of support exists (whether within the local LGBTQ+ communities, or externally) for LGBTQ+ identifying individuals in your communities?'];
    addQuestionAndMessage(question, message, id);
    
    question = "Do you feel any legal and/or societal restrictions exist towards queer people at UCLA?";
    message = feature['What kind of legal and or societal restrictions, if any, exist towards queer people at UCLA?'];
    addQuestionAndMessage(question, message, id);
    
    question = "What kind of support are you aware of for LGBTQ+ identifying individuals at UCLA?";
    message = feature['What kind of support are you aware of (whether within the local LGBTQ+ communities, or externally) for LGBTQ+ identifying individuals at UCLA?'];
    addQuestionAndMessage(question, message, id);

    question = "Finally, how does your culture as a Southeast Asian American interact with your experience as an LGBTQ+ person at UCLA?";
    message = feature['Finally, how do you perceive your culture as a Southeast Asian American to affect your experience as an LGBTQ+ person at UCLA, if at all?'];
    addQuestionAndMessage(question, message, id);
}

function addQuestionAndMessage(question, message, id){
    const questionElem = document.createElement("h2");
    questionElem.classList.add('info-question');
    let textNode = document.createTextNode(question);
    questionElem.appendChild(textNode);
    document.getElementById(id).appendChild(questionElem);

    addBreak(id);

    const messageElem = document.createElement("h3");
    messageElem.classList.add('info-message');
    textNode = document.createTextNode(message);
    messageElem.appendChild(textNode);
    document.getElementById(id).appendChild(messageElem);

    addBreak(id);
    addBreak(id);
}

function addBreak(id){
    let linebreak = document.createElement("br");
    document.getElementById(id).appendChild(linebreak);
}

function openInfoSection(evt, index, title){
    // Get all elements with class="info-container" and hide them
    let containers = document.getElementsByClassName("info-container");
    for (i = 0; i < containers.length; i++) {
        containers[i].style.display = "none";
    }

    // Get all elements with class="marker-button" and remove the class "active"
    let buttons = document.getElementsByClassName("marker-button");
    for (i = 0; i < buttons.length; i++) {
        buttons[i].className = buttons[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the link that opened the tab
    document.getElementById(index + "container" + title).style.display = "block";
    evt.currentTarget.className += " active";
}

function processData(results){
    for(let i = 0; i < results.length; i++){
        addMarker(results[i], i);
    }
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

document.getElementById("zoom-button").addEventListener('click', function(){
    map.zoomTo(map.getZoom() * 1.5);
})