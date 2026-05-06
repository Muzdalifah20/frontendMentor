const ddlUnits = document.querySelector("#ddlUnits");
const dvCityCountry = document.querySelector("#dvCityCountry");
const dvCurrDate = document.querySelector("#dvCurrDate");
const dvCurrTemp = document.querySelector("#dvCurrTemp");
const ddLDay = document.querySelector("#ddLDay");
const pFeelslike = document.querySelector("#pFeelslike");
const pHumidity = document.querySelector("#pHumidity");
const pWind = document.querySelector("#pWind");
const pPrecipitation = document.querySelector("#pPrecipitation");
const dvForecastDay1 = document.querySelector("#dvForecastDay1");
const btnSearch = document.querySelector("#btnSearch");
const textSearch = document.querySelector("#textSearch");

let cityName, countryName, weatherData;

async function getGeoData() {
  let search = textSearch.value || "berlin, germany";
  console.log(search);
  const url = `https://nominatim.openstreetmap.org/search?q=${search}&format=jsonv2&addressdetails=1`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const result = await response.json();
    console.log(result);
    let lat = result[0].lat;
    let lon = result[0].lon;

    loadLocationData(result);
    getWeatherData(lat, lon);
    // console.log(result);
  } catch (error) {
    console.error(error);
  }
}

function loadLocationData(locationData) {
  let location = locationData[0].address;
  cityName = location.city;
  countryName = location.country;

  if (countryName.length >= 7) {
    countryName = location.country_code.toUpperCase();
  }

  let dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  let date = new Intl.DateTimeFormat("en-US", dateOptions).format(new Date());

  console.log(cityName, countryName, date);

  dvCityCountry.textContent = `${cityName}, ${countryName}`;
  dvCurrDate.textContent = date;
}

async function getWeatherData(lat, lon) {
  let search = "khartoum";
  let tempUnit = "celsius";
  let windUnit = "kmh";
  let precipUnit = "mm";

  // if toggle value = F
  if (ddlUnits.value === "F") {
    tempUnit = "fahrenheit";
    windUnit = "mph";
    precipUnit = "inch";
  }

  const url =
    "https://corsproxy.io/?" +
    encodeURIComponent(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min&hourly=temperature_2m,weather_code&current=temperature_2m,weather_code,rain,precipitation,wind_speed_10m,apparent_temperature,relative_humidity_2m&past_days=0&forecast_days=7&wind_speed_unit=${windUnit}&temperature_unit=${tempUnit}&precipitation_unit=${precipUnit}`,
    );

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    weatherData = await response.json();

    loadCurrentWeather(weatherData);
    loadDailyForecast(weatherData);
    loadHourlyForecast(weatherData);
  } catch (error) {
    console.error(error.message);
  }
}

function loadCurrentWeather(weather) {
  dvCurrTemp.textContent = `${Math.round(weather.current.temperature_2m)}`;
  pFeelslike.textContent = Math.round(weather.current.apparent_temperature);
  pHumidity.textContent = Math.round(weather.current.relative_humidity_2m);
  pWind.textContent = `${Math.round(weather.current.wind_speed_10m)} ${weather.current_units.wind_speed_10m.replace(/[/]/g, "")}`;
  pPrecipitation.textContent = `${Math.round(weather.current.precipitation)} ${weather.current_units.precipitation.replace(/[/]/g, "")}`;
}

function loadDailyForecast(weather) {
  let daily = weather.daily;

  for (let i = 0; i < 7; i++) {
    let date = new Date(daily.time[i]);
    let dayOfWeek = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
    }).format(date);
    let dvForecastDay = document.querySelector(`#dvForecastDay${i + 1}`);
    while (dvForecastDay.firstChild) {
      dvForecastDay.removeChild(dvForecastDay.firstChild);
    }
    let weatherCodeName = getWeatherCodeName(daily.weather_code[i]);
    let imgFilePath = `./assets/images/icon-${weatherCodeName}.webp`;
    let dailyHigh = Math.round(daily.temperature_2m_max[i]);
    let dailyLow = `${Math.round(daily.temperature_2m_min[i])} `;

    // add content
    addDailyElement(
      "p",
      "daily__day-title",
      dayOfWeek,
      dvForecastDay,
      "afterbegin",
      "",
    );
    addDailyElement(
      "img",
      "daily__day-icon",
      "",
      dvForecastDay,
      "beforeend",
      imgFilePath,
      weatherCodeName,
    );
    addDailyElement(
      "div",
      "daily__day-temps",
      "",
      dvForecastDay,
      "beforeend",
      "",
      "",
    );
    let dvDailyDayTemps = dvForecastDay.querySelector(".daily__day-temps");

    while (dvDailyDayTemps.firstChild) {
      dvDailyDayTemps.removeChild(dvDailyDayTemps.firstChild);
    }

    addDailyElement(
      "p",
      "daily__day-high",
      `${dailyHigh}°`,
      dvDailyDayTemps,
      "afterbegin",
      "",
      "",
    );
    addDailyElement(
      "p",
      "daily__day-low",
      `${dailyLow}°`,
      dvDailyDayTemps,
      "beforeend",
      "",
      "",
    );
  }
}

function addDailyElement(
  tag,
  className,
  Content,
  parentElement,
  position,
  filePath,
  altDescription,
) {
  if (!parentElement) {
    console.warn("Parent element missing, skipping");
    return;
  }
  const newElement = document.createElement(tag);
  newElement.className = className;
  if (Content !== "") {
    newElement.textContent = Content;
  }
  if (tag === "img") {
    newElement.setAttribute("src", filePath);
    newElement.setAttribute("alt", altDescription);
    newElement.setAttribute("width", "320");
    newElement.setAttribute("height", "320");
  }

  parentElement.insertAdjacentElement(position, newElement);
}

function loadHourlyForecast(weather) {
  let dayIndex = parseInt(ddLDay.value, 10);
  console.log(dayIndex + 1);
  let weatherCodes = weather.hourly.weather_code;
  let hours = weather.hourly.time;
  let temps = weather.hourly.temperature_2m;
  let firstHour = 24 * dayIndex;
  let lastHour = 24 * (dayIndex + 1) - 1;
  let id = 0;
  for (let h = firstHour; h <= lastHour; h++) {
    let weatherCodeName = getWeatherCodeName(weatherCodes[h]);
    let imgFilePath = `./assets/images/icon-${weatherCodeName}.webp`;
    let temp = Math.round(temps[h]) + "°";
    let hour = new Date(hours[h]).toLocaleString("en-US", {
      hour: "numeric",
      hour12: true,
    });

    let dvForecastHour = document.querySelector(`#dvForecastHour${id + 1}`);

    while (dvForecastHour.firstChild) {
      dvForecastHour.removeChild(dvForecastHour.firstChild);
    }

    addDailyElement(
      "img",
      "hourly__hour-icon",
      "",
      dvForecastHour,
      "afterbegin",
      imgFilePath,
      weatherCodeName,
    );
    addDailyElement(
      "p",
      "hourly__hour-time",
      hour,
      dvForecastHour,
      "beforeend",
      "",
      "",
    );
    addDailyElement(
      "p",
      "hourly__hour-temp",
      temp,
      dvForecastHour,
      "beforeend",
      "",
      "",
    );

    id++;
  }
}

function getWeatherCodeName(code) {
  // 0 --  sunny
  // 1, 2  -- partly-cloudy
  // 3 overcast
  // 45, 48 --  fog
  // 51, 53, 55, 56, 57 -- drizzle
  // 61, 63, 65, 66, 67, 80, 81, 82 -- rain
  // 71, 73, 75, 77 , 85, 86--  snow
  // 95, 96, 99 storm

  const weatherCodes = {
    0: "sunny",
    1: "partly-cloudy",
    2: "partly-cloudy",
    3: "overcast",
    45: "fog",
    48: "fog",
    51: "drizzle",
    53: "drizzle",
    55: "drizzle",
    56: "drizzle",
    57: "drizzle",
    61: "rain",
    63: "rain",
    65: "rain",
    66: "rain",
    67: "rain",
    80: "rain",
    81: "rain",
    82: "rain",
    71: "snow",
    73: "snow",
    75: "snow",
    77: "snow",
    85: "snow",
    86: "snow",
    95: "storm",
    96: "storm",
    99: "storm",
  };

  let codeName = weatherCodes[code];
  return codeName;
}

function populateDayOfWeek() {
  let currDate = new Date();

  for (let i = 0; i < 7; i++) {
    const formatted = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
    }).format(currDate);

    const newOption = document.createElement("option");
    newOption.setAttribute("class", "hourly__select-day");
    newOption.value = i;
    newOption.textContent = formatted;
    ddLDay.insertAdjacentElement("beforeend", newOption);
    currDate.setDate(currDate.getDate() + 1);
  }
}

populateDayOfWeek();
getGeoData();

btnSearch.addEventListener("click", getGeoData);
ddlUnits.addEventListener("change", getGeoData);
ddLDay.addEventListener("change", (e) => {
  loadHourlyForecast(weatherData);
});
