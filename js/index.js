'use strict'

//Callback
function run(result){
    let element = document.getElementById('result');
    element.style.display = 'none';


    newOrder(JSON.parse(result))
}

function newOrder(data){
    console.log(data);
    let movies = data.results
    let newOrder = []
    movies.forEach(movie => newOrder.push({
        'name':movie.title,
        'planets': parseElement(movie.planets)
    }));
    console.log(newOrder)
    //element.innerHTML = JSON.stringify(newOrder.toString());
}

function parseElement(planets){
    let newOrder = []
    planets.forEach(planet => httpGetAsync(planet, res => {
        let aux = JSON.parse(res)
        newOrder.push({
            'name' : aux.name,
            'terrain' : aux.terrain,
            'gravity' : aux.gravity,
            'population' : aux.population

        });
    }));
    return newOrder;
}

//HTTP request
function httpGetAsync(url, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", url, true); 
    xmlHttp.send(null);
}

httpGetAsync('https://swapi.co/api/films',run)

