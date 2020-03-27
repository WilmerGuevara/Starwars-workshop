'use strict'


//Reorders the data
function newOrder(data){
    console.log(data);
    let movies = data.results
    let planetKeys = ['name','terrain','gravity','population']
    let charactersKeys = ['name','gender','hair_color','skin_color','eye_color','height',['homeworld','name'],['species','name','language','average_height']]
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
function parseElements(elements,keys){
    let filtered = []
    if(Array.isArray(elements)){
        elements.forEach(element => filtered.push(parseElement(element,keys)))
    }else{
        filtered = parseElement(elements)
    }
    return filtered;
}

//Filters elements based in key and elements
function parseElement(element,keys){
    httpGetAsync(element, res => {
        let value = JSON.parse(res);
        let elementFiltered = {};
        if(Array.isArray(keys)){
            keys.forEach(key => {
                if(Array.isArray(key)){ 
                    elementFiltered[key[0]] = parseElements(value[key[0]],key.slice(1));
                }else{
                    elementFiltered[key] = value[key];
                }  
            })
        }
        else{
            console.log('here')
            elementFiltered[keys] = value[keys];
        }
        return elementFiltered;
    });
}

//HTTP request
var httpGetAsync = (url) => {
    var xmlHttp = new XMLHttpRequest();
    return new Promise((resolve,reject) => {
        xmlHttp.onreadystatechange =  _=> { 
            if (xmlHttp.readyState !== 4) return;
            if (xmlHttp.status >= 200 && xmlHttp.status < 300) {
                resolve(xmlHttp.responseText);
            }else{
                reject({
                    status: xmlHttp.status,
                    statusText: xmlHttp.statusText
                })
            }
        }
        xmlHttp.open('GET', url, true); 
        xmlHttp.send(null);
    })

}

//Function to run the script
async function startAll(){
    let data = await httpGetAsync('https://swapi.co/api/films');
    newOrder(JSON.parse(data))
}

startAll()
