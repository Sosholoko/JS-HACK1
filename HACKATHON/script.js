//JAVASCRIPT CODE



let fieldd = document.getElementById("field");
let button = document.getElementById("add");
let area = document.getElementById("tasks");
let del = document.getElementById("del");
let arr = [];
let task;
//function for the add button to take the info from the field

fieldd.addEventListener('keypress', addNew);

function addNew(e){
    if(e.keyCode === 13){
        adding()
    }
};

//Add new todo

function adding(){
    let value = fieldd.value;
    if (value.length <= 0){
        alert("You need to create a task first")
    }
    else{
        console.log(value);
    let task = document.createElement("li");
    arr.push(value);
    console.log(arr);
    task.setAttribute("id", arr.indexOf(value));
    task.innerHTML = `${value}
    <button id="del" onclick="deleting(event)">✕</button>
    <input type="checkbox" id="check"></input>`; 
    area.appendChild(task);
    fieldd.value = '';
    };
    
};

//Delete single element

function deleting(e){
    e.target.parentNode.remove();
    arr.shift();
};


//Delete all todos

function deletall(){
    arr = [];
    area.innerHTML = "";
}



//Google search area

let gglbox = document.querySelector(".search-box");

gglbox.addEventListener("keypress", search);

function search(e){
    if(e.keyCode === 13){
        window.location='http://www.google.com/search?q='+escape(gglbox.value);
        gglbox.value = "";
    }
};





//Name adding to the top page

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


//Dynamic Clock

setInterval(()=>{
const time = document.querySelector('#time');
let greet = document.getElementById("greet");
let date = new Date();
let hours = date.getHours();
let minutes = date.getMinutes();
let seconds = date.getSeconds();
let day_night = 'AM';



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
if(day_night === "AM"){
    greet.textContent = "☀️ Good Morning,";
}
else if(hours < 5 && day_night === "PM"){
    greet.textContent = "⚡️ Good Afternoon,";
}
else if(hours > 5 && day_night === "PM"){
    greet.textContent = "🌙 Good Evening,";
}

time.textContent = hours + " " + ":" + " " + minutes + " " + ":" + " " + seconds + " " + day_night;
},1000);


//Weather API Query


const api = {
    key: "50ffb377a9e7fb850ce6795a293a99d2",
    base:  "https://api.openweathermap.org/data/2.5/"
};

const searchbox = document.querySelector('.google');
searchbox.addEventListener('keypress', setQuery);

function setQuery(e){
    if(e.keyCode === 13){
        getResults(searchbox.value)
        searchbox.value = "";
        
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

