const ddlUnits = document.querySelector("#ddlUnits");
const dvCityCountry = document.querySelector("#dvCityCountry");
const dvCurrDate = document.querySelector("#dvCurrDate");
const dvCurrTemp = document.querySelector("#dvCurrTemp");
const pFeelslike = document.querySelector("#pFeelslike");
const pHumidity = document.querySelector("#pHumidity");
const pWind = document.querySelector("#pWind");
const pPrecipitation = document.querySelector("#pPrecipitation");
const dvForecastDay1 = document.querySelector("#dvForecastDay1");

let cityName, countryName;

async function getGeoData() {
  let search = "Cairo, egypt";
  const url =
    "https://corsproxy.io/?" +
    encodeURIComponent(
      `https://nominatim.openstreetmap.org/search?q=${search}&format=jsonv2&addressdetails=1`,
    );
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const result = await response.json();
    let lat = result[0].lat;
    let lon = result[0].lon;

    loadLocationData(result);
    getWeatherData(lat, lon);
    console.log(result);
  } catch (error) {
    console.error(error.message);
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
    const result = await response.json();
    console.log(result);
    loadCurrentWeather(result);
    loadDailyForecast(result);
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

    let weatherCode = daily.weather_code[i];
    console.log(weatherCode);

    // let dvDailyTemps = document
    //   .createElement("div")
    //   .className("daily__day-temps");
    // let dvday = document.querySelector(`#dvForecastDay${i + 1} .daily__day-title`);
    // console.log(dvday);
    // dvday.textContent = dayOfWeek;

    // const newDayofWeek = document.createElement("p");
    // newDayofWeek.className = "daily__day-title";
    // newDayofWeek.textContent = dayOfWeek;
    // dvForecastDay.insertAdjacentElement("afterbegin", newDayofWeek);
    // dvForecastDay.appendChild(newDayofWeek);

    // add content
    addDailyElement(
      "p",
      "daily__day-title",
      dayOfWeek,
      dvForecastDay,
      "afterbegin",
    );
    addDailyElement(
      "img",
      "daily__day-icon",
      "",
      dvForecastDay,
      "beforeend",
      getWeatherFileName(weatherCode),
    );
    // addDailyElement(
    //   "div",
    //   "daily__day-temps",
    //   "",
    //   dvForecastDay,
    //   "beforeend",
    //   "",
    // );
    // addDailyElement(
    //   "p",
    //   "daily__day-high",
    //   "",
    //   "daily__day-temps",
    //   "beforeend",
    //   "",
    // );
  }
}

function addDailyElement(
  tag,
  className,
  Content,
  parentElement,
  position,
  fileName,
) {
  const newElement = document.createElement(tag);
  newElement.className = className;
  if (Content !== "") {
    newElement.textContent = Content;
  }
  if (tag === "img") {
    newElement.setAttribute("src", fileName);
  }
  parentElement.insertAdjacentElement(position, newElement);
}

function getWeatherFileName(code) {
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

  let fileName = `./assets/images/icon-${weatherCodes[code]}.webp`;
  return fileName;
}

console.log(getWeatherFileName(75));
getGeoData();
getWeatherData();
