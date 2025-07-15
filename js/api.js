const CLAVE = "fd7b51b8";
const URL = `https://www.omdbapi.com/?apikey=${CLAVE}`;

//El buscador sugiere títulos cuando el usuario haya ingresado al menos dos letras.
export function iniciarAutocompletado(inputElement) {
  const sugerenciasDiv = document.getElementById("sugerencias");

  inputElement.addEventListener("input", () => {
    const texto = inputElement.value.trim();
    sugerenciasDiv.innerHTML = "";

    if (texto.length >= 2) {
      //encodeURIComponent para que reconozca el titulo sin signos o espacios que a veces los usuarios no ponen.
      fetch(`${URL}&s=${encodeURIComponent(texto)}`) 
        .then(res => res.json())
        .then(data => {
          if (data.Response === "True") {
            const sugerencias = data.Search.slice(0, 5);
            sugerencias.forEach(peli => {
              const item = document.createElement("div");
              item.textContent = `${peli.Title} (${peli.Year})`;

              item.addEventListener("click", () => {
                inputElement.value = peli.Title;
                sugerenciasDiv.innerHTML = "";
              });

              sugerenciasDiv.appendChild(item);
            });
          }
        })
        .catch(error => {
          console.error("Error al buscar sugerencias:", error);
        });
    }
  });
}


export async function buscarPelicula(nombre, peliculas) {
  const sugerenciasDiv = document.getElementById("sugerencias");

  if (!nombre) {
    Toastify({ 
            text: "Ingresa un título válido!",
            duration: 3000,
            gravity: "top",
            position: "right",
            style: {
                background: "linear-gradient(to right, rgb(255, 95, 109), rgb(255, 195, 113))",
            }
        }).showToast();
        return null;
  }

  try {
    const respuesta = await fetch(`${URL}&t=${encodeURIComponent(nombre)}`);
    const data = await respuesta.json();

    if (data.Response === "True") {
      const tituloOficial = `${data.Title} (${data.Year})`;
      const poster = (data.Poster && data.Poster !== "N/A")
        ? data.Poster
        : "https://via.placeholder.com/200x300?text=Sin+imagen";

      const pelicula = {
        nombre: tituloOficial,
        puntaje: 0,
        poster: poster
      };

      //Agrego las peliculas que elige el usuario a un array que luego se va a usar para compararlas.
      peliculas.push(pelicula);
      sugerenciasDiv.innerHTML = "";
      return pelicula;

    } else {
      Toastify({ 
            text: "No se encontró la película.",
            duration: 3000,
            gravity: "top",
            position: "right",
            style: {
                background: "linear-gradient(to right, rgb(255, 95, 109), rgb(255, 195, 113))",
            }
        }).showToast();
      return null;
    }

  } catch (error) {
    console.error("Error al buscar en OMDb:", error);
    Toastify({ 
            text: "Ocurrió un error al buscar la película. Disculpá!",
            duration: 3000,
            gravity: "top",
            position: "right",
            style: {
                background: "linear-gradient(to right, rgb(255, 95, 109), rgb(255, 195, 113))",
            }
        }).showToast();
    return null;
  }
}
