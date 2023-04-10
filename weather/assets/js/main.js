const API_KEY = '8d37205d373adab4be7a26a90854fb11';

const wrapper = document.querySelector('.wrapper');

// SEARCH
const searchField = document.querySelector('.search__field');
const searchBtn = document.querySelector('.search__btn');

// CARD
const card = document.querySelector('.card');
const cardCountry = document.querySelector('.card__country');
const cardCity = document.querySelector('.card__city');
const cardTemperature = document.querySelector('.card__temperature span');
const cardWeather = document.querySelector('.card__weather span');
const cardHumidity = document.querySelector('.card__humidity span');
const cardWindSpeed = document.querySelector('.card__wind-speed span');

// MODES
// const modes = {
//   sun: {
//     weatherId: [8, 7],
//     background: '#42c2ff',
//     bigPictureSrc: './img/big-pictures/sun.png',
//     cardIconSrc: './img/icons/sun-icon.png'
//   },
//   moon: {
//     weatherId: [],
//     background: '#712b75',
//     bigPictureSrc: './img/big-pictures/moon.png',
//     cardIconSrc: './img/icons/moon-icon.png'
//   },
//   rain: {
//     weatherId: [2, 3, 5],
//     background: '#a8aac4',
//     bigPictureSrc: './img/big-pictures/rain.png',
//     cardIconSrc: './img/icons/rain-icon.png'
//   },
//   snow: {
//     weatherId: [6],
//     background: '#6ba7cc',
//     bigPictureSrc: './img/big-pictures/snow.png',
//     cardIconSrc: './img/icons/snow-icon.png'
//   }
// };

// all the modes https://openweathermap.org/weather-conditions
const modes = {
  sun: [8, 7],
  moon: [],
  rain: [2, 3, 5],
  snow: [6]
};
// 600...699
let activeMode;

const body = document.body;
const bigPicture = document.querySelector('.big-picture');
const cardWeatherIcon = document.querySelector('.card__weather-icon');

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

function setMode(modes, weatherId, currentTime, sunsetTime, sunriseTime) {
  for (const currentMode in modes) {
    if (modes[currentMode].includes(Math.floor(weatherId / 100))) {
      activeMode = currentMode;
      if (currentMode === 'sun' && (currentTime >= sunsetTime || currentTime < sunriseTime)) {
        activeMode = 'moon';
      }

      break;
    }
  }
}

function cardRender([country, city, degreeCelsius, weather, humidity, windSpeed], activeMode) {
  cardCountry.innerText = country;
  cardCity.innerText = city;
  cardTemperature.innerText = degreeCelsius;
  cardWeather.innerText = weather;
  cardWeatherIcon.classList = `card__weather-icon ${activeMode}-icon`;
  cardHumidity.innerText = humidity;
  cardWindSpeed.innerText = windSpeed;
}

async function render(activeMode, ...cardInfo) {
  activeMode = activeMode || 'sun';

  bigPicture.classList.add('hide');
  await delay(300);
  wrapper.classList.add('hide');
  await delay(800);

  body.classList = `${activeMode}-mode`;
  bigPicture.classList = `big-picture ${activeMode} hide`;
  cardRender(cardInfo, activeMode);

  wrapper.classList.remove('hide');
  await delay(300);
  bigPicture.classList.remove('hide');

  // activeMode = activeMode || 'sun';

  // bigPicture.classList.add('hide');
  // setTimeout(() => {
  //   wrapper.classList.add('hide');
  //   setTimeout(() => {
  //     body.classList = `${activeMode}-mode`;
  //     bigPicture.classList = `big-picture ${activeMode} hide`;
  //     cardRender(cardInfo, activeMode);

  //     wrapper.classList.remove('hide');
  //     setTimeout(() => {
  //       bigPicture.classList.remove('hide');
  //     }, 300);
  //   }, 800);
  // }, 300);
}

async function getWeatherForecast(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();

  try {
    console.log(data);

    const country = data.sys.country; // in process...
    const city = data.name;
    const degreeCelsius = Math.round(data.main.temp);
    const weather = data.weather[0].main;
    const weatherId = data.weather[0].id;
    const humidity = data.main.humidity;
    const windSpeed = Math.round(data.wind.speed);

    const currentTime = new Date(data.dt * 1000).getTime();
    const sunsetTime = new Date(data.sys.sunset * 1000).getTime();
    const sunriseTime = new Date(data.sys.sunrise * 1000).getTime();
    console.log('getWeatherForecast ~ currentTime', new Date(currentTime));
    console.log('getWeatherForecast ~ sunsetTime', new Date(sunsetTime));
    console.log('getWeatherForecast ~ sunriseTime', new Date(sunriseTime));

    setMode(modes, weatherId, currentTime, sunsetTime, sunriseTime);
    render(activeMode, country, city, degreeCelsius, weather, humidity, windSpeed);
  } catch (err) {
    console.log(data.message);
  }

  // fetch(url)
  //   .then(response => response.json())
  //   .then(data => {
  //     console.log(data);

  //     const country = data.sys.country; // in process...
  //     const city = data.name;
  //     const degreeCelsius = Math.round(data.main.temp);
  //     const weather = data.weather[0].main;
  //     const weatherId = data.weather[0].id;
  //     const humidity = data.main.humidity;
  //     const windSpeed = Math.round(data.wind.speed);

  //     const currentTime = new Date(data.dt * 1000).getTime();
  //     const sunsetTime = new Date(data.sys.sunset * 1000).getTime();
  //     const sunriseTime = new Date(data.sys.sunrise * 1000).getTime();
  //     console.log('getWeatherForecast ~ currentTime', new Date(currentTime));
  //     console.log('getWeatherForecast ~ sunsetTime', new Date(sunsetTime));
  //     console.log('getWeatherForecast ~ sunriseTime', new Date(sunriseTime));

  //     setMode(modes, weatherId, currentTime, sunsetTime, sunriseTime);
  //     render(activeMode, country, city, degreeCelsius, weather, humidity, windSpeed);
  //   })
  //   .catch(err => console.log(err));
}

function onSearchBtnClick() {
  const cityName = searchField.value;
  searchField.value = '';

  getWeatherForecast(cityName);
}

searchBtn.addEventListener('click', onSearchBtnClick);
searchField.addEventListener('keydown', (e) => {
  if (e.code === 'Enter') {
    onSearchBtnClick();
  }
});