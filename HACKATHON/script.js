// let greet = document.getElementById("greet");
// var today = new Date();
// var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

// console.log(time.today.getHours);

let user = document.getElementById("user");
let field = document.getElementById("nameUser");
let username = field.value;

field.addEventListener("keypress", setName);

function setName(e){
    if(e.keyCode === 13){
        console.log(field.value);
        user.innerHTML = " "+ field.value;
        field.value = "";
    }
}


setInterval(()=>{
const time = document.querySelector('#time');
let greet = document.getElementById("greet");
let date = new Date();
let hours = date.getHours();
let minutes = date.getMinutes();
let seconds = date.getSeconds();
let day_night = 'AM';

if(hours < 12){
    greet.textContent = "Good Morning";
}
else if(hours > 12 || hours < 18){
    greet.textContent = "Good Afternoon";
}
else{
    greet.textContent = "Good Evening";
}

if (hours > 12){
    day_night = "PM";
    hours = hours -12;
}
if (hours < 10){
    hours = "0" + hours;
}
if (minutes < 10){
    minutes = "0" + minutes;
}
if (seconds < 10){
    seconds = "0" + seconds;
}

time.textContent = hours + " " + ":" + " " + minutes + " " + ":" + " " + seconds + " " + day_night;
},1000);

const api = {
    key: "50ffb377a9e7fb850ce6795a293a99d2",
    base:  "https://api.openweathermap.org/data/2.5/"
};

const searchbox = document.querySelector('.search-box');
searchbox.addEventListener('keypress', setQuery);

function setQuery(e){
    if(e.keyCode === 13){
        getResults(searchbox.value)
        
    }
};

function getResults(query){
    fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
    .then(weather =>{
        return weather.json();
    }).then(displayResults);
}

function displayResults(weather){
    console.log(weather);
    let city = document.querySelector('.location .city');
    city.innerHTML = `${weather.name}, ${weather.sys.country}`;
    let now = new Date();
    let date = document.querySelector('.location .date');
    date.innerHTML = dateBuilder(now);

    let temp = document.querySelector('.current .temp');
    temp.innerHTML = `${Math.round(weather.main.temp).toFixed(0)}<span>°c</span>`;

    let weather_el = document.querySelector('.current .weather');
    weather_el.innerText = weather.weather[0].main;
    
    let hilow = document.querySelector('.hi-low');
    hilow.innerText = `${Math.round(weather.main.temp_min)}°c / ${Math.round(weather.main.temp_max)}°c`;

}

function dateBuilder(d){
    let months = ["January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"];
    let days =["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let day = days[d.getDay()]
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`;
}

