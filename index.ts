let divJoke: HTMLElement | null;
let divWeather: HTMLElement | null;
let score: number;
let scoreBtns: HTMLCollectionOf<Element> | null; 
let reportJokes: Array<object> = [];
let chuckJokes: boolean = true;
//Para la peticion a la API
let options = {
  headers: {
    Accept: 'application/json',
  },
};


window.onload = function () {
  divJoke = document.getElementById('joke-container');
  divWeather = document.getElementById('weather');
  callJoke();
  callWeather();
};

//Función para hacer el request y trabajar con response.
let callJoke = function () {
  score = 0;
  if(chuckJokes){
    fetch('https://api.chucknorris.io/jokes/random', options)
        .then(response => response.json())
        .then(data => {
        showJoke(data.value);
        chuckJokes = false;
    });
  }else{
    fetch('https://icanhazdadjoke.com/', options)
        .then(response => response.json())
        .then(data => {
        showJoke(data.joke);
        chuckJokes = true;
    });
  }
}

//Se genera el bloque donde se mostrará la broma y los diferentes botones.
let showJoke = function (joke: string) {
  if (divJoke !== null) {
    divJoke.innerHTML = '<h3>Preparado para reir?<img src="./img/risa.png" alt="emoji risa" id="emoji-risa"></h3>'; //<i class="fa-solid fa-face-laugh-squint text-warning"></i>

    let p = document.createElement('p');
    p.setAttribute('id', 'joke');
    p.textContent = joke;

    divJoke.appendChild(p);
    divJoke.appendChild(makeScoreButtons());
    divJoke.appendChild(makeNextJokeButton('Siguiente Chiste'));

    eventListenerToNextJokeBtn();
  }
}

//=========================CREACIÓN DE BOTONES=========================
//Botón para que aparezca el siguiente chiste.
function makeNextJokeButton(value: string) {
  
  let btn = document.createElement('button'); 

  btn.textContent = value;
  btn.setAttribute('id', 'next-joke');
  addClass(btn, 'btn', 'btn-lg', 'col-12', 'col-md-10');

  return btn;
}
//Añadir listeners al botón "sigiente chiste".
function eventListenerToNextJokeBtn(){
  let btn = document.getElementById('next-joke');

  if(btn !== null){
    btn.addEventListener('click', report);
    btn.addEventListener('click', callJoke);
  }
}

//Botones para hacer la votación.
function makeScoreButtons(){
  let div = document.createElement('div');
  let contador: number = 0;
  let btn;

  while(contador<3){
    contador++;
    btn = document.createElement('button');
    btn.textContent = contador+'';
    addClass(btn, 'btn', 'btn-lg', 'score-btn', 'col-md-3');
    btn.setAttribute('onclick', 'getScore('+contador+')');
    div.appendChild(btn);
  }
  
  addClass(div, 'd-flex', 'flex-md-row', 'flex-column', 'col-12', 'justify-content-md-center');
  return div;
}

//función para añadir clases a los elementos html creados
function addClass(element: HTMLElement, ...classes: Array<string>){
  let arr = [...classes];
  arr.map(x => element.classList.add(x));
}

//Función para guardar el valor de la votación
function getScore(num: number){
  scoreBtns = document.getElementsByClassName('score-btn');
  let arrScoreBtns =  Array.from(scoreBtns);  //[btn1, btn2, btn3]

  arrScoreBtns.filter(btn => {if(Number(btn.textContent) === num) score = num;});
}

//Función para hacer el registro de la valoración del chiste
function report(){
  let obj: object;
  let joke: HTMLElement | null = document.getElementById('joke');
  let date = getDate();

  if(joke !== null){
    obj = {
      'joke':joke.textContent,
      'score': score,
      'date': date
    }

    reportJokes.push(obj);
  }
  console.log('Reporte de valoración de las bromas: ');
  reportJokes.map(rep => console.log(rep))
}

//Función para crear fecha en formato ISO
function getDate(){
  let clickDate: Date = new Date();
  let date: string = clickDate.getFullYear() +'-'+ (clickDate.getMonth()+1) +'-'+ clickDate.getDate()
  
  return date;
}

//=========================CREACIÓN DE FUNCTION WEATHER=========================
function callWeather(){
  fetch("https://www.el-tiempo.net/api/json/v2/provincias/08/municipios/08001", options)
    .then(response => response.json())
    .then(data => showWeather(data.stateSky.description, data.temperaturas.max, data.temperaturas.min));
}

function showWeather(descrition: string, maxTemp: string, minTemp: string){
  let h = document.createElement('p');
  h.setAttribute('id', 'weather-p');
  h.textContent = 'Barcelona: '+descrition+'  ('+maxTemp+'ºC | '+minTemp+'ºC)';

  divWeather?.appendChild(h);
}
