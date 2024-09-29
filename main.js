const weatherData = {
  country: "",
  city: "",
  API_KEY: "2de4b6d9ae0c1521950ad724458c869d",
  async getWeather() {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${this.city},${this.country}&units=metric&appid=${this.API_KEY}`
      );

      // Check if the response is successful
      if (!res.ok) {
        throw new Error(`City or country not found`);
      }

      const { name, main, weather } = await res.json();
      console.log(name, main, weather);
      return {
        name,
        main,
        weather,
      };
    } catch (err) {
      UI.showMassage("Please, insert valid city and country names.");
    }
  },
};

const storage = {
  city: "",
  country: "",
  saveItem() {
    localStorage.setItem("BD-city", this.city);
    localStorage.setItem("BD-country", this.country);
  },
  getItem() {
    const city = localStorage.getItem("BD-city", this.city);
    const country = localStorage.getItem("BD-country", this.country);
    return {
      city,
      country,
    };
  },
};

const UI = {
  //every selectors
  loadSelectors() {
    const cityElm = document.querySelector("#city");
    const cityInfoElm = document.querySelector(".city-name");
    const temperatureElm = document.querySelector("#w-temp");
    const pressureElm = document.querySelector("#w-pressure");
    const humidityElm = document.querySelector("#w-humidity");
    const feelElm = document.querySelector(".weather-condition");
    const formElm = document.querySelector("#weatherForm");
    const countryElm = document.querySelector("#country");
    const iconElm = document.querySelector("#icon");
    const massageElm = document.querySelector(".massage");
    return {
      cityElm,
      cityInfoElm,
      temperatureElm,
      pressureElm,
      humidityElm,
      feelElm,
      formElm,
      countryElm,
      massageElm,
      iconElm,
    };
  },

  //hide massage after 2 seconds
  hideMassage() {
    const { massageElm } = this.loadSelectors();
    setTimeout(() => {
      massageElm.textContent = "";
    }, 2000);
  },

  //showing invalid message
  showMassage(msg) {
    const { massageElm } = this.loadSelectors();
    massageElm.textContent = msg;
    //remove massage
    this.hideMassage();
  },

  //checking validate value
  validateInput(country, city) {
    if (country === "" || city === "") {
      this.showMassage("Please, enter a valid country and city.");
      return true;
    } else {
      return false;
    }
  },

  //getting our input
  getInputValues() {
    const { countryElm, cityElm } = this.loadSelectors();
    // check the values
    const isInValid = this.validateInput(countryElm.value, cityElm.value);
    //if the values are invalid, it won't proceed next.
    if (isInValid) {
      return;
    }

    //giving the valid values
    return {
      country: countryElm.value,
      city: cityElm.value,
    };
  },

  //clear the values after submit
  clearInputValue() {
    const { countryElm, cityElm } = this.loadSelectors();
    countryElm.value = "";
    cityElm.value = "";
  },

  //getting infos by calling getWeather
  async handleData() {
    const informations = await weatherData.getWeather();
    return informations;
  },

  //get icon as weather
  getIcon(iconCode) {
    return `http://openweathermap.org/img/w/${iconCode}.png`;
  },

  //giving informations to UI
  populateUI(informations) {
    const {
      cityInfoElm,
      temperatureElm,
      pressureElm,
      humidityElm,
      feelElm,
      iconElm,
    } = this.loadSelectors();

    const {
      name,
      main: { temp, pressure, humidity },
      weather,
    } = informations;

    cityInfoElm.textContent = name;
    temperatureElm.textContent = `${temp}°C`;
    pressureElm.textContent = `${pressure}Kpa`;
    humidityElm.textContent = `${humidity}%`;
    feelElm.textContent = weather[0].description;
    iconElm.setAttribute("src", this.getIcon(weather[0].icon));
  },

  init() {
    const { formElm } = this.loadSelectors();
    formElm.addEventListener("submit", async (e) => {
      e.preventDefault();

      //get input values
      const inputValues = this.getInputValues();
      // If inputValues is undefined, do nothing
      if (!inputValues) return;
      // now we won't get any undefined value
      const { country, city } = inputValues;

      //sending country and city
      weatherData.city = city;
      weatherData.country = country;
      storage.city = city;
      storage.country = country;

      //update to localStorage
      storage.saveItem();

      //clear the values after submit
      this.clearInputValue();

      //send data to API
      const informations = await this.handleData();
      //populate ti UI
      this.populateUI(informations);
    });

    window.addEventListener("DOMContentLoaded", async () => {
      let { city, country } = storage.getItem();
      if (!city || !country) {
        city = "Khulna";
        country = "Bangladesh";
      }

      weatherData.city = city;
      weatherData.country = country;

      //send data to API
      const informations = await this.handleData();
      //populate ti UI
      this.populateUI(informations);
    });
  },
};

UI.init();
