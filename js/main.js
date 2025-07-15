import { iniciarAutocompletado, buscarPelicula } from './api.js';
import { iniciarComparacion, rankingAnterior } from './rank.js';

export let peliculas = [];
export let usuario = "";

//Pido el nombre con SweetAlert.
Swal.fire({
    title: '¡Hola!',
    text: 'Por favor, ingresá tu nombre:',
    input: 'text',
    inputPlaceholder: 'Tu nombre...',
    confirmButtonText: 'Empezar'
}).then((result) => {
    if (result.isConfirmed && result.value.trim() !== "") {
        usuario = result.value.trim();
        document.getElementById("saludo").textContent = `¡Hola ${usuario}! Vamos a hacer un ranking de 5 películas.`;
        rankingAnterior(usuario);
    } else {
        location.reload(); //Vuelvo a mostrar el alert si el usuario no escribió nada.
    }
});

const inputPelicula = document.getElementById("name-peli");
const botonAgregar = document.getElementById("btn-agregar");
iniciarAutocompletado(inputPelicula);

let contadorPeliculas = 0;

botonAgregar.addEventListener("click", () => {
    if (contadorPeliculas >= 5) return;

    const tituloIngresado = inputPelicula.value.trim();

    if (peliculas.some(p => p.nombre.includes(tituloIngresado))) {
        Toastify({ //Alertas avisos para el usuario.
            text: "Esta película ya esta en tu lista! Proba con otra.",
            duration: 3000,
            gravity: "top",
            position: "right",
            style: {
                background: "linear-gradient(to right, rgb(255, 95, 109), rgb(255, 195, 113))",
            }
        }).showToast();
        return null;
    }

    buscarPelicula(tituloIngresado, peliculas)
        .then(pelicula => {
            if (pelicula) {
                const lista = document.querySelectorAll("#lista-peliculas li");
                lista[contadorPeliculas].textContent =
                    `Película ${contadorPeliculas + 1}: ${pelicula.nombre}`;
                contadorPeliculas++;
                inputPelicula.value = "";

                Toastify({ //Alertas de confirmacion para el usuario.
                    text: "Película agregada!",
                    duration: 2000,
                    gravity: "top",
                    position: "right",
                    style: {
                        background: "linear-gradient(to right, #00b09b, #96c93d)",
                    }
                }).showToast();

                if (contadorPeliculas === 5) {
                    botonAgregar.disabled = true;
                    inputPelicula.disabled = true;
                    iniciarComparacion(peliculas, usuario);
                }
            }
        });
});
