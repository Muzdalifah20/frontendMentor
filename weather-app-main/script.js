const ddlUnits = document.querySelector("#ddlUnits");
const dvCityCountry = document.querySelector("#dvCityCountry");
const dvCurrDate = document.querySelector("#dvCurrDate");
const dvCurrTemp = document.querySelector("#dvCurrTemp");
const pFeelslike = document.querySelector("#pFeelslike");
const pHumidity = document.querySelector("#pHumidity");
const pWind = document.querySelector("#pWind");
const pPrecipitation = document.querySelector("#pPrecipitation");

let cityName, countryName;

async function getGeoData() {
  let search = "los angeles";
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

  let options = {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  let date = new Intl.DateTimeFormat("en-US", options).format(new Date());

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
    loadWeatherData(result);
  } catch (error) {
    console.error(error.message);
  }
}

function loadWeatherData(weather) {
  dvCurrTemp.textContent = `${Math.round(weather.current.temperature_2m)}`;
  pFeelslike.textContent = Math.round(weather.current.apparent_temperature);
  pHumidity.textContent = Math.round(weather.current.relative_humidity_2m);
  pWind.textContent = `${Math.round(weather.current.wind_speed_10m)} ${weather.current_units.wind_speed_10m.replace(/[/]/g, "")}`;
  pPrecipitation.textContent = `${Math.round(weather.current.precipitation)} ${weather.current_units.precipitation.replace(/[/]/g, "")}`;
}

function getWeatherFileName(code) {
  //51, 53, 55, 56, 57 -- drizzle
  // 45, 48 --  fog
  //3 overcast
  // 1, 2  -- partly-cloudy
  //61, 63, 65, 66, 67, 80, 81, 82 -- rain
  //71, 73, 75, 77 , 85, 86--  snow
  //95, 96, 99 storm
  //0 --  sunny

  const weatherCodes = {
    0: "sunny",
    1: "partly-cloudy",
  };

  return weatherCodes[code];
}

getGeoData();
getWeatherData();
