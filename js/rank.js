
//Combinaciones posibles para comparar las peliculas.
let combinaciones = [
  [0, 1], [0, 2], [0, 3], [0, 4],
  [1, 2], [1, 3], [1, 4],
  [2, 3], [2, 4],
  [3, 4]
];

let parActual = 0;
let peliculasGlobal = [];
let usuarioGlobal = "";

//Paso elementos del DOM a constantes para que sea mas legible.
const tituloPeli1 = document.getElementById("titulo-peli-1");
const tituloPeli2 = document.getElementById("titulo-peli-2");
const botonElegir1 = document.getElementById("btn-elegir-1");
const botonElegir2 = document.getElementById("btn-elegir-2");

//Muestro el ranking anterior guardado
export function rankingAnterior(usuario) {
  const guardado = localStorage.getItem(`ranking_${usuario}`);
  
  if (guardado) {
    const ranking = JSON.parse(guardado);
    
    const listaHTML = ranking.map(peli => {
      return `<li>${peli.nombre}: ${peli.puntaje} puntos</li>`;
    }).join('');

    document.getElementById("ranking-anterior").innerHTML = `
      <h3>📊 Último ranking guardado:</h3>
      <ul>${listaHTML}</ul>
    `;
  }
}

//Primera comparacion.
export function iniciarComparacion(peliculas, usuario) {
  peliculasGlobal = peliculas;
  usuarioGlobal = usuario;
  parActual = 0;
  mostrarSiguientePar();
}

//Siguiente par de peliculas a comparar.
function mostrarSiguientePar() {
  if (parActual < combinaciones.length) {
    const [i, j] = combinaciones[parActual];

    tituloPeli1.innerHTML = crearDivPelicula(peliculasGlobal[i]);
    tituloPeli2.innerHTML = crearDivPelicula(peliculasGlobal[j]);

    botonElegir1.onclick = function () {
      peliculasGlobal[i].puntaje++;
      parActual++;
      mostrarSiguientePar();
    };

    botonElegir2.onclick = function () {
      peliculasGlobal[j].puntaje++;
      parActual++;
      mostrarSiguientePar();
    };

  } else {
    verificarEmpates();
  }
}

//El usuario vuelve a voptar si hay películas con el mismo puntaje.
function verificarEmpates() {
  for (let i = 0; i < peliculasGlobal.length - 1; i++) {
    for (let j = i + 1; j < peliculasGlobal.length; j++) {
      if (peliculasGlobal[i].puntaje === peliculasGlobal[j].puntaje) {

        tituloPeli1.innerHTML = crearDivPelicula(peliculasGlobal[i], true);
        tituloPeli2.innerHTML = crearDivPelicula(peliculasGlobal[j], true);

        botonElegir1.onclick = function () {
          peliculasGlobal[i].puntaje++;
          verificarEmpates();
        };

        botonElegir2.onclick = function () {
          peliculasGlobal[j].puntaje++;
          verificarEmpates();
        };

        return; //Salgo para ir al siguiente desempate (si es que hay).
      }
    }
  }

  mostrarRankingFinal();
}


function mostrarRankingFinal() {
  peliculasGlobal.sort(function (a, b) {
    return b.puntaje - a.puntaje;
  });

  const htmlNuevo = `
    <h3>🎬 Tu ranking final:</h3>
    <ol>
      ${peliculasGlobal.map(function (p) {
        return `<li>${p.nombre}: ${p.puntaje} puntos</li>`;
      }).join('')}
    </ol>
  `;

  document.getElementById("ranking-nuevo").innerHTML = htmlNuevo;

  //Guardo el ranking del usuario en el localSotorage
  localStorage.setItem(`ranking_${usuarioGlobal}`, JSON.stringify(peliculasGlobal));

  //Vacío los divs de las películas.
  tituloPeli1.textContent = "";
  tituloPeli2.textContent = "";
  botonElegir1.style.display = "none";
  botonElegir2.style.display = "none";
}


function crearDivPelicula(pelicula, desempate) {
  return `
    ${desempate ? '<p class="desempate">Desempate</p>' : ''}
    <img src="${pelicula.poster}" alt="${pelicula.nombre}" style="max-height:200px"><br>
    <span>${pelicula.nombre}</span>
  `;
}