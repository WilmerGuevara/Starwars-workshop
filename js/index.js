'use strict'

//Callback
function run(result){
    let element = document.getElementById('result');
    element.style.display = 'none';
    newOrder(JSON.parse(result))
}

//Reorders the data
function newOrder(data){
    console.log(data);
    let movies = data.results
    let planetKeys = ['name','terrain','gravity','population']
    let charactersKeys = ['name','gender','hair_color','skin_color','eye_color','height','homeworld']
    let starshipKeys = ['name','model','manufacturer','passengers']
    
    let newOrder = []

    movies.forEach(movie => newOrder.push({
        'name':movie.title,
        'planets': parseElements(movie.planets,planetKeys),
        'characters': parseElements(movie.characters,charactersKeys),
        'starships': parseElements(movie.starships,starshipKeys)
    }));

    console.log(newOrder)
}

//Filters every JSON
function parseElements(elements,keys,recursive){
    let filtered = []
    elements.forEach(element => httpGetAsync(element, res => {
        let aux = JSON.parse(res)
        let elementFiltered = {};
        keys.forEach(key => elementFiltered[key] = aux[key])
        filtered.push(elementFiltered);
    }));
    return filtered;
}

//HTTP request
function httpGetAsync(url, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open('GET', url, true); 
    xmlHttp.send(null);
}

function startAll(){
    httpGetAsync('https://swapi.co/api/films',run);
}

startAll()
