import React from 'react';


import logo from './logo.svg';
import './App.css';

function showCurrentDateTime() {
  let h4 = document.querySelector("h4");
  let h5 = document.querySelector("h5");

  let now = new Date();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  let day = days[now.getDay()];
  let date = now.getDate();
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  let month = months[now.getMonth()];
  let year = now.getFullYear();

  let hour = now.getHours();
  let minutes = now.getMinutes().toString().padStart(2, "0");

  h4.innerHTML = `${day}, ${month} ${date}, ${year}`;
  h5.innerHTML = `${hour}:${minutes}`;
}
showCurrentDateTime();

function search(city) {
  let apiKey = "ef1f6e14d39c4aa8875abd79b5398d89";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showTemperature);
}

search("Toronto");

function showCitySearched(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-input");
  let city = `${searchInput.value}`;
  search(city);
}

let form = document.querySelector("#search-form");
form.addEventListener("submit", showCitySearched);
let searchElement = document.querySelector("#icon-search");
searchElement.addEventListener("click", showCitySearched);

function getForecast(coordinates) {
  let apiKey = "ef1f6e14d39c4aa8875abd79b5398d89";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function showTemperature(response) {
  let showTemp = document.querySelector("#current-temp");
  let temperature = Math.round(response.data.main.temp);
  let cityName = document.querySelector("h3");
  let tempDescription = document.querySelector("#temp-description");
  let currentWeatherIcon = document.querySelector("#currentWeatherIcon");
  let windspeed = document.querySelector("#windspeed-units");
  let humidity = document.querySelector("#humidity-units");
  showTemp.innerHTML = `${temperature}`;
  cityName.innerHTML = `${response.data.name}`;
  tempDescription.innerHTML = `${response.data.weather[0].description}`;
  windspeed.innerHTML = `${Math.round(response.data.wind.speed)} km/h`;
  humidity.innerHTML = `${Math.round(response.data.main.humidity)}%`;
  currentWeatherIcon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );

  celciusTemperature = response.data.main.temp;

  getForecast(response.data.coord);
  console.log(response);
}

function displayForecast(response) {
  console.log(response.data.daily);
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row d-flex justify-content-evenly">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
    <div class="col-sm col-md col-md-lg justify-content-evenly">
      <div class="weather-forecast-date">${formatForecastDay(
        forecastDay.dt
      )}</div>
 
      <img src="http://openweathermap.org/img/wn/${
        forecastDay.weather[0].icon
      }@2x.png"
       width="80px"/>
          
        <div class="weekly-temps">
          <span class="temp-max">${Math.round(forecastDay.temp.max)}°  </span>
          <span class="temp-min"> ${Math.round(forecastDay.temp.min)}° </span>
        <div class="weather-forecast-description">${
          forecastDay.weather[0].description
        }</div>
      </div>
    </div>
    `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function formatForecastDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return days[day];
}

function showPositionTemp(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "ef1f6e14d39c4aa8875abd79b5398d89";
  let apiEndPoint = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiEndPoint).then(showTemperature);
}

function getPosition(event) {
  event.preventDefault();
  navigator.geolocation.getPosition(showPositionTemp);
}
let button = document.querySelector("#btn-location");
button.addEventListener("click", getPosition);

let celciusTemperature = null;

export default App;



