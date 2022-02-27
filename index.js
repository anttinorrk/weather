
const mykey = config.my_key;

let city = "Helsinki";
let latitude = 0;
let longitude = 0;

fetchWeatherData();
document.getElementById("current").innerHTML += city;
setInterval(fetchWeatherData, 60000);

//resets the colorchange animation
document.getElementById("weather").addEventListener(
  "webkitAnimationEnd",
  function () {
    this.style.webkitAnimationName = "";
  },
  false
);

//TODO: Find a way to reject invalid city names. Now when you give a city that doesn't exist, it starts trying to fetch with that city.
function fetchWeatherData() {
  let byWhat = ``; //Defines whether it fetches data by coordinates or by city name
  if (latitude != 0) {
    byWhat = `lat=${latitude}&lon=${longitude}`;
  } else {
    byWhat = `q=${city}`;
  }
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?${byWhat}&appid=${mykey}`
  )
    .then((res) => res.json())
    .then((data) => renderWeatherData(data));
  console.log(`fetched from ${city}`);
}


function renderWeatherData(data) {
  city = data.name;
  let output = `
  <u1>
    <li>Type: ${data.weather[0].description}</li>
    <li>Temperature: ${(data.main.temp - 273.15).toFixed(1)} °C</li>
    <li>Feels like: ${(data.main.feels_like - 273.15).toFixed(1)} °C</li>
    <li>Humidity: ${data.main.humidity} %</li>
    <li>Wind speed: ${data.wind.speed} m/s</li>
    `;
  let symbolLink = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  document.getElementById("weather").innerHTML = output;
  document.getElementById("symbol").setAttribute("src", symbolLink);
  document.getElementById(
    "current"
  ).innerHTML = `${data.name}, ${data.sys.country}`;
  document.getElementById("weather").style.animation = "toGreen 0.5s";
}

function selectLocation() {
  city = document.getElementById("city-input").value;
  latitude = 0;
  longitude = 0;
  fetchWeatherData();
  document.getElementById("city-input").value = "";
  console.log(city);
}

document //ENTER triggers the button
  .getElementById("city-input")
  .addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      document.getElementById("change-button").click();
    }
  });

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    document.getElementById("your").innerHTML = "Couldn't locate you";
  }
}
function showPosition(position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
  fetchWeatherData();
  console.log(`Latitude: ${latitude}Longitude: ${longitude}`);
}
