import wmoCode from "./weather.js";

const inputLocation = document.querySelector('input'),
      searchBtn = document.querySelector('button'),
      image = document.querySelector('#img-weather'),
      temperature = document.querySelector('#temperature'),
      description = document.querySelector('#description'),
      weatherDetails = document.querySelector('#weather-details'),
      humidity = document.querySelector('#humidity-level'),
      windSpeed = document.querySelector('#wind-speed'),
      wallpaper = document.querySelector('#wallpaper');

searchBtn.addEventListener('click', () => {
    const location = inputLocation.value;
    if(location){
        getWeather(location);
    } else {
        window.alert('Please enter a location');
    }
})

async function getWeather(location){
    try{
        
        const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${location}&count=10&language=en&format=json`);
        
        if(!geoResponse.ok){
            throw new Error("Could not fetch location");
        }

        const data = await geoResponse.json();

        const geoLatitude = data.results[0].latitude;
        const geoLongitude = data.results[0].longitude;

        const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${geoLatitude}&longitude=${geoLongitude}&hourly=temperature_2m,relative_humidity_2m,rain,wind_speed_10m,weather_code&forecast_days=1`)

        if(!weatherResponse.ok){Instant
            throw new Error("Coult not fetch weather");
        }

        const weather = await weatherResponse.json();

        const temp = weather.hourly.temperature_2m[0];
        const hum = weather.hourly.relative_humidity_2m[0];
        const wind = weather.hourly.wind_speed_10m[0];
        const desc = weather.hourly.weather_code[0];

        if(desc == 0 || desc == 1){
            image.src = 'img/clear.png';
        } else if(desc == 2 || desc == 3){
            image.src = 'img/cloud.png';
        } else if(desc >= 4 && desc <= 49){
            image.src = 'img/mist.png';
        } else if(desc >= 50 && desc <= 70){
            image.src = 'img/rain.png';
        } else {
            image.src = 'img/snow.png';
        }

        wallpaper.style.display = 'none';
        weatherDetails.style.display = 'flex';

        description.textContent = `${wmoCode[desc]}`;
        temperature.textContent = `${temp}°C`;
        humidity.textContent = `${hum}%`;
        windSpeed.textContent = `${wind}km/h`;

    }
    catch(error){
        console.error(error);
        temperature.innerHTML = '';
        humidity.innerHTML = '';
        windSpeed.innerHTML = '';
        window.alert('Location not found :/');
    }
}
