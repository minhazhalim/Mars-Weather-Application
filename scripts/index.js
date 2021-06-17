const apiKey = 'DEMO_KEY';
const apiURL = `https://api.nasa.gov/insight_weather/?api_key=${apiKey}&feedtype=json&ver=1.0`;
const previousWeatherToggle = document.querySelector('.show-previous-weather');
const previousWeather = document.querySelector('.previous-weather');
const currentSolElement = document.querySelector('[data-current-sol]');
const currentDateElement = document.querySelector('[data-current-date');
const currentTemperatureHighElement = document.querySelector('[data-current-temperature-high]');
const currentTemperatureLowElement = document.querySelector('[data-current-temperature-low]');
const windSpeedElement = document.querySelector('[data-wind-speed]');
const windDirectionText = document.querySelector('[data-wind-direction-text]');
const windDirectionArrow = document.querySelector('[data-wind-direction-arrow]');
const previousSolTemplate = document.querySelector('[data-previous-sol-templates]');
const previousSolContainer = document.querySelector('[data-previous-sols]');
const unitToggle = document.querySelector('[data-unit-toggle]');
const metricRadio = document.getElementById('cel');
const imperialRadio = document.getElementById('fah');
let selectedSolIndex;
previousWeatherToggle.addEventListener('click',() => {
     previousWeather.classList.toggle('show-weather');
});
getWeather().then(sols => {
     selectedSolIndex = sols.length - 1;
     displaySelectedSol(sols);
     displayPreviousSols(sols);
     updateUnits();
     unitToggle.addEventListener('click',() => {
          let metricUnits = !isMetric();
          metricRadio.checked = metricUnits;
          imperialRadio.checked = !metricUnits;
          displaySelectedSol(sols);
          displayPreviousSols(sols);
          updateUnits();
     });
     metricRadio.addEventListener('change',() => {
          displaySelectedSol(sols);
          displayPreviousSols(sols);
          updateUnits();
     });
     imperialRadio.addEventListener('change',() => {
          displaySelectedSol(sols);
          displaySelectedSols(sols);
          updateUnits();
     });
});
function displaySelectedSol(sols){
     const selectedSol = sols[selectedSolIndex];
     currentSolElement.innerText = selectedSol.sol;
     currentDateElement.innerText = displayDate(selectedSol.date);
     currentTemperatureHighElement.innerText = displayTemperature(selectedSol.maximumTemperature);
     currentTemperatureLowElement.innerText = displayTemperature(selectedSol.minimumTemperature);
     windSpeedElement.innerText = displaySpeed(selectedSol.windSpeed);
     windDirectionArrow.style.setProperty('--direction',`${selectedSol.windDirectionDegrees}deg`);
     windDirectionText.innerText = selectedSol.windDirectionCardinal;
}
function displayPreviousSols(sols){
     previousSolContainer.innerHTML = '';
     sols.forEach((solData,index) => {
          const solContainer = previousSolTemplate.content.cloneNode(true);
          solContainer.querySelector('[data-sol]').innerText = solData.sol;
          solContainer.querySelector('[data-date]').innerText = displayDate(solData.date);
          solContainer.querySelector('[data-temperature-high]').innerText = displayTemperature(solData.maximumTemperature);
          solContainer.querySelector('[data-temperature-low]').innerText = displayTemperature(solData.minimumTemperature);
          solContainer.querySelector('[data-select-button]').addEventListener('click',() => {
               selectedSolIndex = index;
               displaySelectedSol(sols);
          });
          previousSolContainer.appendChild(solContainer);
     });
}
function displayDate(date){
     return date.toLocaleDateString(undefined,{day: 'numeric',month: 'long'});
}
function displayTemperature(temperature){
     let returnTemperature = temperature;
     if(!isMetric()){
          returnTemperature = (temperature - 32) * (5 / 9);
     }
     return Math.round(returnTemperature);
}
function displaySpeed(speed){
     let returnSpeed = speed;
     if(!isMetric()){
          returnSpeed = speed / 1.609;
     }
     return Math.round(returnSpeed);
}
function getWeather(){
     return fetch(apiURL)
          .then(res => res.json())
          .then(data => {
               const {sol_keys,validity_checks,...solData} = data;
               return Object.entries(solData).map(([sol,data]) => {
                    return {
                         sol: sol,
                         maximumTemperature: data.AT.mx,
                         minimumTemperature: data.AT.mn,
                         windSpeed: data.HWS.av,
                         windDirectionDegrees: data.WD.Most_common.compass_degrees,
                         windDirectionCardinal: data.WD.most_common.compass_point,
                         date: new Date(data.First_UTC),
                    };
               });
          });
}
function updateUnits(){
     const speedUnits = document.querySelectorAll('[data-speed-unit]');
     const temperatureUnits = document.querySelectorAll('[data-temperature-unit]');
     speedUnits.forEach(unit => {
          unit.innerText = isMetric() ? "kph" : "mph";
     });
     temperatureUnits.forEach(unit => {
          unit.innerText = isMetric() ? "C" : "F";
     });
}
function isMetric(){
     return metricRadio.checked;
}