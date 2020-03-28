'use strict'


//Reorders the data
async function newOrder(data){
    console.log(data);
    let movies = data.results;
    let planetKeys = ['name','terrain','gravity','population'];
    let charactersKeys = ['name','gender','hair_color','skin_color','eye_color','height',['homeworld','name'],['species','name','language','average_height']];
    let starshipKeys = ['name','model','manufacturer','passengers'];
    let newOrder = [];

    for (const movie of movies) {
        let planets = await parseElements(movie.planets,planetKeys);
        let characters = await parseElements(movie.characters,charactersKeys);
        let starships = await parseElements(movie.starships,starshipKeys);

        newOrder.push({
            'name':movie.title,
            'planets': planets,
            'characters': characters,
            'starships': starships 
        })
    }
    return newOrder
}


//Check if is array or not, and executes callback
async function checkArray(elements,callback){
    if(!Array.isArray(elements)){
        return callback(elements);
    }
    let arr = elements.map(element => {return callback(element)});
    return arr;
}

function isIterable (value) {
    return Symbol.iterator in Object(value);
  }

//Filters elements based in key and elements
async function parseElements(objectPending,keys){
    let objects = await checkArray(objectPending,httpGetAsync);
    if(isIterable(objects)){
        objects = await Promise.all(objects)
    }
    let filteredDict = await checkArray(objects, async (object) => {
        let dict = {};
        keys.forEach(key => {
            if(!Array.isArray(key)){
                dict[key] = object[key]
            }else{
                 parseElements(object[key[0]],key.slice(1)).then(res => dict[key[0]] = res)
            }
        });
        return dict;
    });
    if(isIterable(filteredDict)){
        return await Promise.all(filteredDict);
    }
    return filteredDict;
}

//HTTP request
var httpGetAsync = (url) => {
    var xmlHttp = new XMLHttpRequest();
    return new Promise((resolve,reject) => {
        xmlHttp.onreadystatechange =  _=> { 
            if (xmlHttp.readyState !== 4) return;
            if (xmlHttp.status >= 200 && xmlHttp.status < 300) {
                resolve(JSON.parse(xmlHttp.responseText));
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
    newOrder(data).then(result =>console.log(result))
}

startAll()
