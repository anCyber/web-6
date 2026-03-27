const CAT_API_LINK = "https://api.thecatapi.com/v1/images/search";
const DOG_API_LINK = "https://dogapi.dog/api/v2/facts";
const WEATHER_API_LINK = "https://api.open-meteo.com/v1/forecast?latitude=55.75&longitude=37.61&current_weather=true";
const DATABASE_URL = "https://jsonplaceholder.typicode.com/posts";

function showSection(sectionId) {
    var sections = document.querySelectorAll(".single_API_content_section");

    sections.forEach(function(s) {
        s.classList.add("VISUALLY-HIDDEN");
    });
    document.getElementById(sectionId).classList.remove("VISUALLY-HIDDEN");
}


function updateLoaderAndResultStyles(loaderHTMLid, resultHTMLid) {
    var loader = document.getElementById(`${loaderHTMLid}`);
    var result = document.getElementById(`${resultHTMLid}`);
    loader.classList.remove("VISUALLY-HIDDEN");
    result.innerHTML = "";
    return {loader, result};
}

async function getCatImageThroughAPI() {
    var loaderAndResultObject = updateLoaderAndResultStyles("cat-loader", "cat-result");
    var loader = loaderAndResultObject.loader;
    var result = loaderAndResultObject.result;

    try {
        var response = await fetch(CAT_API_LINK);
        var imageData = await response.json();
        result.innerHTML = (`<img src="${imageData[0].url}">`);
    }
    catch (e) {
        result.innerHTML = "An error occured. :(";
    }
    finally {
        loader.classList.add("VISUALLY-HIDDEN");
    }
}

async function getDogFactThroughAPI() {
    var loaderAndResultObject = updateLoaderAndResultStyles("dog-loader", "dog-fact-text");
    var loader = loaderAndResultObject.loader;
    var result = loaderAndResultObject.result;

    try {
        var response = await fetch(DOG_API_LINK);
        var factData = await response.json();
        result.innerText = factData.data[0].attributes.body;
    }
    catch (e) {
        result.innerText = "An error occured. :(";
    }
    finally {
        loader.classList.add("VISUALLY-HIDDEN");
    }
}

async function getWeatherThroughAPI() {
    var loaderAndResultObject = updateLoaderAndResultStyles("weather-loader", "weather-result");
    var loader = loaderAndResultObject.loader;
    var result = loaderAndResultObject.result;

    try {
        var response = await fetch(WEATHER_API_LINK);
        var weatherData = await response.json();
        var temperature = weatherData.current_weather.temperature;
        var windspeed = weatherData.current_weather.windspeed;
        result.innerText = (`Temperature: ${temperature}°C\nWind Speed: ${windspeed} km/h`);
    }
    catch (e) {
        result.innerText = "An error occured. :(";
    }
    finally {
        loader.classList.add("VISUALLY-HIDDEN");
    }
}

async function sendDataThroughAPI(method) {
    var loader = document.getElementById('admin-loader');
    var result = document.getElementById('admin-result');
    var titleInput = document.getElementById('post-title');
    
    loader.classList.remove("VISUALLY-HIDDEN");
    
    var url = DATABASE_URL;
    var options = { 
        method: method, 
        headers: { 'Content-type': 'application/json; charset=UTF-8' } 
    };

    if ((method == "PATCH") || (method == "DELETE")) {
        url = url + "/1";
    }

    if ((method == "POST") || (method == "PATCH")) {
        options.body = JSON.stringify({
            title: titleInput.value || "Untitled",
            userId: 1
        });
    }

    try {
        var response = await fetch(url, options);
        var data = await response.json();

        if (method == "DELETE") {
            result.innerText = "STATUS: 200 OK\nRECORD #1 DELETED SUCCESSFULLY";
            titleInput.value = "";
        } else {
            result.innerText = (`STATUS: ${response.status}\n${JSON.stringify(data, null, 2)}`);
        }
    }
    catch (e) {
        result.innerText = "An error occured. :(";
    }
    finally {
        loader.classList.add("VISUALLY-HIDDEN");
    }
}