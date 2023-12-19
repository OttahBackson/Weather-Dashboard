const searchBtn = document.querySelector(".search-btn");
const locationBtn = document.querySelector(".location-btn");
const cityInput = document.querySelector(".city-input");
const weatherList = document.querySelector(".weather-list");
const currentWeather = document.querySelector(".current-weather")
const h1El = document.querySelector("h1");
const apiKey = "6b59ae9abf361f59101fe486d97ee9c5";
const API_KEY = "6b59ae9abf361f59101fe486d97ee9c5"; //API for forecast
const API_ACCESSKEY = "6b59ae9abf361f59101fe486d97ee9c5";

window.addEventListener("scroll", (e) => {
    e.preventDefault();
    h1El.classList.toggle("sticky", window.scrollY > 0);
});

const createWeatherCard = (cityName, weatherItem, index) => {
    if (index === 0) { //HTML for the main weather_list
            return ` <div class="details">
                <h2>${cityName} (${weatherItem.weather[0].icon})</h2>
                <h4>Temperature: ${(weatherItem.main.temp - 273.14).toFixed(2)}°C</h4>
                <h4>Wind: ${weatherItem.wind.speed}M/S</h4>
                <h4>Humidity: ${weatherItem.main.humidity}%</h4>
            </div>
            <div class="icon">
            <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png">
                <h4>${weatherItem.weather[0].description}</h4>
            </div>`
    }
    else{ //HTML for the Weather-forecast
        return ` <li class="card">
                <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="">
                <h4>Temp: ${(weatherItem.main.temp - 273.14).toFixed(2)}°C</h4>
                <h4>Wind: ${weatherItem.wind.speed}M/S</h4>
                <h4>Humidity: ${weatherItem.main.humidity}%</h4>
                </li>`
    }
}

const getCityWeatherDetails = (cityName, lat, lon) => {
    const weatherURL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    fetch(weatherURL).then(res => res.json()).then(data => {
        const uniqueForecastDays = [];

        const fiveDaysforeCast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
                if (!uniqueForecastDays.includes(forecastDate)) {
                    return uniqueForecastDays.push(forecastDate);
                }
        });
        // CLERAING PREVIOUS WEATHER UPDATE
        cityInput.value = "";
        weatherList.innerHTML = "";
        currentWeather.innerHTML = "";

        //creating weather-list and adding them to the dom
        fiveDaysforeCast.forEach((weatherItem, index) => {
            if (index === 0) {
                currentWeather.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
            }else{
                weatherList.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
            }
        });
    }).catch(() => {
        alert("An error occured while fetching  the weather forecast!");
    })
}

// Get entered city weather coordinates
const getCityWeather = (e) =>{
    e.preventDefault();
    const cityName = cityInput.value.trim();
    if(!cityName) return;
    const URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`
    fetch(URL).then(res => res.json()).then(data => {
        if(!data.length) return alert(`No coordinates found for ${cityName}`);
        const {name, lat, lon,} = data[0];
        getCityWeatherDetails(name, lat, lon,);
    }).catch(() => {
        alert("An error occured while fetching  the coordinates");
    })
}
const getLocations = (e) => {
    e.preventDefault();
    navigator.geolocation.getCurrentPosition(
        position => {
            const {accuracy, latitude, longitude} = position.coords;
            const ReversedURL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_ACCESSKEY}`


    //Get city name from coordinates using a reversed geocoding Api 
        fetch(ReversedURL).then(res => res.json()).then(data => {
        const {name} = data[0];
        getCityWeatherDetails(name, latitude, longitude,);
    }).catch(() => {
        alert("An error occured while fetching  city name");
    })
            
        },
        // show alert if the user location and city name is denied
        error => {
            if (error.code === error.PERMISSION_DENIED) {
                alert("Geolocation request denied. Please reset permission to grant access again.")
            }
        }
    );
}
locationBtn.addEventListener("click", getLocations);
searchBtn.addEventListener("click", getCityWeather);
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityWeather())
