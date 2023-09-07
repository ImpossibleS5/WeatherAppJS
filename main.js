const requestUrl =
  "http://api.weatherstack.com/current?access_key=04ae92211369d1c0fd9aa5755faf3db2";

const TYPES = {
  CLOUDCOVER: "CLOUDCOVER",
  HUMIDITY: "HUMIDITY",
  PRESSURE: "PRESSURE",
  FEELSLIKE: "FEELSLIKE",
  UV_INDEX: "UV_INDEX",
  WINDSPEED: "WINDSPEED",
};

let weatherData = {
  city: null,
  observationTime: "00:00 AM",
  temperature: 0,
  weatherIcon: [],
  weatherDescriptions: [],
  isDay: "yes",
  proporties: {
    [TYPES.WINDSPEED]: {
      icon: "wind-speed.png",
      title: "WIND SPEED",
      value: null,
    },
    [TYPES.FEELSLIKE]: {
      icon: "feelslike.png",
      title: "FEELSLIKE",
      value: null,
    },
    [TYPES.CLOUDCOVER]: {
      icon: "cloud-cover.png",
      title: "CLOUD COVER",
      value: null,
    },
    [TYPES.HUMIDITY]: {
      icon: "humidity.png",
      title: "HUMIDITY",
      value: null,
    },
    [TYPES.PRESSURE]: {
      icon: "pressure.png",
      title: "PRESSURE",
      value: null,
    },
    [TYPES.UV_INDEX]: {
      icon: "uv-index.png",
      title: "UV INDEX",
      value: null,
    },
  },
};

const fetchData = async (request = "London") => {
  try {
    const response = await fetch(`${requestUrl}&query=${request}`);
    const data = await response.json();

    const {
      current: {
        observation_time: observationTime,
        temperature,
        weather_icons: weatherIcon,
        weather_descriptions: weatherDescription,
        wind_speed: windSpeed,
        pressure,
        humidity,
        cloudcover,
        feelslike,
        uv_index: uvIndex,
        is_day: isDay,
      },
      location: { name: city },
    } = data;

    weatherData = {
      ...weatherData,
      city,
      observationTime,
      temperature,
      weatherIcon,
      weatherDescription,
      isDay,
      proporties: {
        [TYPES.WINDSPEED]: {
          icon: "wind-speed.png",
          title: "WIND SPEED",
          value: `${Math.round((windSpeed / 3.6) * 10) / 10} m/s`,
        },
        [TYPES.FEELSLIKE]: {
          icon: "feelslike.png",
          title: "FEELSLIKE",
          value: `${feelslike}°`,
        },
        [TYPES.CLOUDCOVER]: {
          icon: "cloud-cover.png",
          title: "CLOUD COVER",
          value: `${cloudcover}%`,
        },
        [TYPES.HUMIDITY]: {
          icon: "humidity.png",
          title: "HUMIDITY",
          value: `${humidity}%`,
        },
        [TYPES.PRESSURE]: {
          icon: "pressure.png",
          title: "PRESSURE",
          value: `${Math.floor(pressure * 0.750064)} mm Hg`,
        },
        [TYPES.UV_INDEX]: {
          icon: "uv-index.png",
          title: "UV INDEX",
          value: `${uvIndex} of 10`,
        },
      },
    };
    renderComponent();
    inputHandler();
  } catch (err) {
    console.error(err);
  }
};

const renderComponent = () => {
  const root = document.getElementById("root");
  root.innerHTML = markup();

  const showPopupButton = document.querySelector(".city__subtitle");
  showPopupButton.addEventListener("click", togglePopupClass);
};

const renderProperties = (proporties) =>
  Object.values(proporties)
    .map(
      ({ icon, value, title }) => `
        <div class="property">
          <img class="property-icon" src="./img/icons/${icon}" alt="">
          <div class="property-info">
            <div class="property-info__value">${value}</div>
            <div class="property-info__description">${title}</div>
          </div>
        </div>
  `
    )
    .join("");

const markup = () => {
  const {
    city,
    observationTime,
    temperature,
    weatherIcon,
    weatherDescription,
    isDay,
    proporties,
  } = weatherData;
  const containerType = isDay === "yes" ? "day" : "night";
  const icon = weatherIcon[0];
  const desc = weatherDescription[0];

  return `<div class="container ${containerType}">
  <div class="city">
    <div class="city__title">Weather Today in</div>
    <div class="city__subtitle" id="city">${city}</div>
  </div>
  <div class="top">
    <div class="top-left">
      <img class="top-left__icon" src="${icon}" alt="" />
      <div class="top-left__description">${desc}</div>
    </div>

    <div class="top-right">
      <div class="top-right__subtitle">as of ${observationTime}</div>
      <div class="top-right__title">${temperature}°</div>
    </div>
  </div>
  <div class="properties">${renderProperties(proporties)}</div>
</div>`;
};

const inputHandler = () => {
  const formInput = document.querySelector(".form__input");
  const formInputPlaceholder = formInput.placeholder;
  const closePopupButton = document.querySelector(".popup__close");

  formInput.addEventListener("input", (e) => {
    weatherData = {
      ...weatherData,
      city: e.target.value,
    };
  });

  formInput.addEventListener("focus", () => {
    formInput.placeholder = "";
  });

  formInput.addEventListener("blur", () => {
    formInput.placeholder = formInputPlaceholder;
  });

  closePopupButton.addEventListener("click", togglePopupClass);
};

const submitHandler = () => {
  const form = document.querySelector(".form");
  const formInput = document.querySelector(".form__input");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const city = weatherData.city;
    fetchData(city);
    togglePopupClass();
    formInput.value = "";
  });
};

const togglePopupClass = () => {
  const popup = document.querySelector(".popup");
  const isСontained = popup.classList.contains("hidden");

  if (isСontained) {
    popup.classList.remove("hidden");
    popup.classList.add("show");
    return;
  }

  popup.classList.remove("show");
  popup.classList.add("hidden");
};

fetchData();
submitHandler();
