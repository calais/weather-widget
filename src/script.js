
// rebuild HTMl and CSS to use grid and include appropriate classes for code
// initialize app with info for current location
// Add forecasted data
// Add conversion from Celcius to Fahrenheit and vice versa

'use strict';

const searchBtn = document.querySelector('.search-btn');
const currentCityBtn = document.querySelector('.current-city-btn');
const searchBox = document.querySelector('.search-box');
let city = 'austin';
let latitude, longitude;
let units = 'metric';

function setLocation() {
  // Routes from either getSearchInput or setPosition
  // Calls getWeather with either city data or lat/long data

  if (latitude) {
    getWeather(`lat=${latitude}&lon=${longitude}`);
  } else {
    getWeather(`q=${city}`);
  }
}
function getSearchInput() {
  // Routes from clicked search button
  // Gets the value of the input field, cleans it and stores it, then calls setLocation
  latitude = ''; // reset latitude
  console.log('Clicked');
  let input = document.querySelector('.search-box').value;
  console.log(input);
  // clean search input
  input = input.toLowerCase();
  input = input.trim();

  // store search input
  city = input;
  setLocation();
}
function setPosition(position) {
  // Records the lat and long from the navigator response and then calls setLocation
  // Reset inputBox
  searchBox.value = '';
  // Routes from getLocation
  latitude = Math.round(position.coords.latitude);
  longitude = Math.round(position.coords.longitude);
  setLocation();
}
function getLocation() {
  // Routes from clicked current city button
  // Retrieves the user's current position
  navigator.geolocation.getCurrentPosition(setPosition);
}
function formatTime(unix) {
  // Routes from displayWeather
  // Gets the unix time data and converts to standard formatting
  // Can I make it show location-specific time?

  const date = new Date(unix * 1000);
  //console.log(date);
  let amPM;
  let hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  if (hours > 12) {
    hours -= 12;
    amPM = 'pm';
  } else {
    amPM = 'am';
  }

  const formattedTime = `${hours}:${minutes} ${amPM}`;

  //console.log(formattedTime);
  return formattedTime;
}
function getDate() {
  // Routes from displayWeather
  // Gets and formats date
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = today.getMonth() + 1; // Convert to month title?
  const formattedDate = `${month}/${day}`;
  //console.log(formattedDate);
  return formattedDate;
}
function getDay() {
  // Routes from displayWeather
  // Gets day of week and converts to name
  const today = new Date();
  const day = today.getDay();
  //console.log(day);
  switch (day) {
    case 0:
      return 'Sunday';
    case 1:
      return 'Monday';
    case 2:
      return 'Tuesday';
    case 3:
      return 'Wednesday';
    case 4:
      return 'Thursday';
    case 5:
      return 'Friday';
    case 6:
      return 'Saturday';
  }
}
function displayWeather(response) {
  // Routes from getWeather
  // This function updates the displayed city and weather
  //console.log(response);

  let unit;
  // Get weather data
  const temperature = Math.round(response.data.main.temp);
  const city = response.data.name;
  const country = response.data.sys.country;
  const emojiID = response.data.weather[0].icon;
  //console.log(emojiID);

  // Get the time and day and format in standard form
  const unixTime = response.data.dt;
  const formattedTime = formatTime(unixTime);
  const formattedDate = getDate();
  const day = getDay();

  // Capture DOM elements
  const h1 = document.querySelector('.current-city');
  const currentTemp = document.querySelector('.current-temp');
  const currentDate = document.querySelector('.current-date');
  const currentTime = document.querySelector('.current-time');
  //console.log(h1.innerHTML);

  // Change DOM elements
  // Changing current city using h1
  h1.innerText = `${city}, ${country}`;

  // Changing temp and emoji using currentTemp
  if (units === 'metric') {
    unit = 'C';
  } else if (units === 'imperial') {
    unit = 'F';
  }
  currentTemp.innerHTML = `<img src="http://openweathermap.org/img/wn/${emojiID}@2x.png"> ${temperature}&deg;${unit}`;

  // changing the current date using currentDate
  currentDate.innerText = `${day} ${formattedDate}`;
  currentTime.innerText = `${formattedTime}`;
}

function getWeather(location) {
  // Routes from setLocation
  // This function will get the weather for the location whether it is latitude/longitude or the name of a city

  const key = '204af6a06d59739ba0c43dfe8c56a8ca';
  const url = `https://api.openweathermap.org/data/2.5/weather?${location}&units=${units}&appid=${key}`;

  axios.get(url).then(displayWeather);
}
searchBtn.addEventListener('click', getSearchInput);
currentCityBtn.addEventListener('click', getLocation);
// Listen for enter to be pressed
searchBox.addEventListener('keyup', event => {
  if (event.key === 'Enter') {
    console.log('Enter');
    getSearchInput();
  }
}); // change to ternary operator?
//setLocation(); // Called to initialize weather on page load.
