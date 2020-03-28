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
function checkArray(elements,callback){
    if(!Array.isArray(elements)){
        return new Promise((resolve) => {
            resolve(callback(elements));
        });
    }
    let arr = [];
    elements.forEach(element => arr.push(callback(element)));
    return new Promise((resolve) => {
        resolve(arr);
    });
}

//Filters elements based in key and elements
async function parseElements(elements,keys){
    let response = await checkArray(elements,httpGetAsync);
    let result = await Promise.all(response)
    let firstFilter = await checkArray(result, async (object) => {
        let filtered = {};
        keys.forEach(key => filtered[key] = object[key]);
        return filtered;
    });

    return await Promise.all(firstFilter);
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
