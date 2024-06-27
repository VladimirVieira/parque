// script.js

// chave da API do OpenWeatherMap
const apiKey = '1e8c9dc2254082d21f5e6b6363be9120';

const map = L.map('map').setView([0, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

map.on('click', async function(e) {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;

    const weather = await getWeather(lat, lng);
    displayWeather(weather);
});

async function getWeather(lat, lng) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

function displayWeather(weather) {
    const weatherDiv = document.getElementById('weather');
    if (weather && weather.weather) {
        weatherDiv.innerHTML = `
            <h2>Clima em ${weather.name}</h2>
            <p>Temperatura: ${weather.main.temp} °C</p>
            <p>Descrição: ${weather.weather[0].description}</p>
            <p>Umidade: ${weather.main.humidity}%</p>
            <p>Vento: ${weather.wind.speed} m/s</p>
        `;
    } else {
        weatherDiv.innerHTML = `<p>Não foi possível obter os dados do clima.</p>`;
    }
}


