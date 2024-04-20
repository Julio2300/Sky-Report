const apiKey = "84d938323e0f7809045e464945c6fec3"
const apiUrl = "https://api.openweathermap.org/data/2.5/"

const searchBox = document.querySelector(".search input")
const searchBtn = document.querySelector(".search button")
const weatherIcon = document.querySelector(".weather-icon")
const weatherDiv = document.querySelector(".weather")
const errorDiv = document.querySelector(".error")

function setCardBackground(temperature) {
    const card = document.querySelector(".card")
    let backgroundColor

    if (temperature <= 15) {
        // Frío: lluvia y luna
        backgroundColor = "linear-gradient(235deg, #E0E0E0, #BDBDBD)"
    } else if (temperature >= 23) {
        backgroundColor = "linear-gradient(235deg, #FF6F00, #FFD54F)"
    } else {
        backgroundColor = "linear-gradient(235deg, #4CAF50, #2196F3)"
    }

    card.style.background = backgroundColor
}

async function checkWeather(city) {
    const currentWeatherUrl = `${apiUrl}weather?q=${city}&units=metric&appid=${apiKey}`
    const forecastUrl = `${apiUrl}forecast?q=${city}&units=metric&appid=${apiKey}`

    try {
        const weatherResponse = await fetch(currentWeatherUrl)
        const forecastResponse = await fetch(forecastUrl)
        if (!weatherResponse.ok || !forecastResponse.ok) {
            throw new Error('City not found')
        }
        const weatherData = await weatherResponse.json()
        const forecastData = await forecastResponse.json()
        updateWeatherInfo(weatherData)
        updateForecast(forecastData);
        weatherDiv.style.display = "block"
        errorDiv.style.display = "none"
    } catch (error) {
        weatherDiv.style.display = "none"
        errorDiv.style.display = "block"
        errorDiv.textContent = error.message
    }
}

function updateWeatherInfo(data) {
    const { temp, humidity } = data.main
    const { speed } = data.wind
    const weatherCondition = data.weather[0].main

    document.querySelector(".city").innerHTML = data.name
    document.querySelector(".temp").innerHTML = `${Math.round(temp)}°C`
    document.querySelector(".humidity").innerHTML = `${humidity}%`
    document.querySelector(".wind").innerHTML = `${speed}km/h`

    setCardBackground(temp)
}

function updateForecast(forecastData) {
    const forecastContainer = document.querySelector(".forecast-container")
    forecastContainer.innerHTML = ''

    forecastData.list.forEach((forecast, index) => {
        if (index % 8 === 0) {
            const date = new Date(forecast.dt * 1000)
            const dayOfWeek = date.toLocaleString('en-us', { weekday: 'long' })
            const day = date.toLocaleDateString()
            const temp = Math.round(forecast.main.temp)
            const icon = forecast.weather[0].icon
            const desc = forecast.weather[0].description
            forecastContainer.innerHTML += `
                <div class="forecast-day">
                    <h4>${dayOfWeek}, ${day}</h4>
                    <img src="http://openweathermap.org/img/wn/${icon}.png" alt="${desc}">
                    <p>${temp}°C</p>
                </div>
            `
        }
    })
}

searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value)
});

document.addEventListener("DOMContentLoaded", () => {
    AOS.init()
});
