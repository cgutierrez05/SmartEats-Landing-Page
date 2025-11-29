import { fetchRecetas } from './functions.js';
import { guardarRegistro, guardarFavorito, escucharFavoritos } from "./firebase.js";

const getOrCreateUserId = () => {
    let id = localStorage.getItem("smarteatsUserId");
    if (!id) {
        id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
        localStorage.setItem("smarteatsUserId", id);
    }
    return id;
};

const USER_ID = getOrCreateUserId();

const cargarRecetas = (recetasArray, contenedor, mostrarBtnFavorito = true) => {
    contenedor.innerHTML = "";

    if (!recetasArray || recetasArray.length === 0) {
        contenedor.innerHTML = `<p class="text-center text-slate-500 col-span-full">
        No se encontraron recetas con ese criterio.</p>`;
        return;
    }

    recetasArray.forEach(receta => {
        const botonFavorito = mostrarBtnFavorito ? `
            <button class="fav-btn" data-id="${receta.id}" data-title="${receta.title}"
            data-image="${receta.image}" data-minutes="${receta.readyInMinutes}" data-url="${receta.sourceUrl}">
                + Favoritos
            </button>
        ` : "";

        const recipeCard =  `
        <article class="recipe-card">
            <div class="card-img-box">
                <img src="${receta.image}" alt="${receta.title}">
            </div>

            <div class="card-detail-box p-4">
                <h3>${receta.title}</h3>
                <p class="recipe-time">
                    ⏱ ${receta.readyInMinutes} min
                </p>

                <div class="recipe-actions">
                    <a href="${receta.sourceUrl}" target="_blank" class="view-recipe-btn">
                        Ver receta
                    </a>
                    ${botonFavorito}
                </div>
            </div>
        </article>`;
        contenedor.innerHTML += recipeCard;
    });
};

const CargarYFiltrar = async (filtro, contenedor) => {
    contenedor.innerHTML = `<p>Buscando recetas de ${filtro}...</p>`;
    const respuesta = await fetchRecetas(filtro);

    if (respuesta.success) {
        cargarRecetas(respuesta.body.results, contenedor);
    } else {
        contenedor.innerHTML = `<p>Error al cargar: ${respuesta.body}</p>`;
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const recipeGrid = document.querySelector("#recetas .recipe-grid");
    const filterButtons = document.querySelectorAll(".filter-btn");

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            const categoriaboton = button.getAttribute("data-filter");
            document.querySelector(".filter-btn.active").classList.remove("active");
            button.classList.add("active");

            CargarYFiltrar(categoriaboton, recipeGrid);
        });
    })
    CargarYFiltrar("healthy", recipeGrid);
    
});

function mostrarModalFavorito() {
    const alerta = document.getElementById("favoritos-alerta");

    if (alerta) {
        alerta.classList.remove("hidden");
        alerta.classList.add("flex");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const alerta = document.getElementById("favoritos-alerta");

    if (alerta) {
        document.getElementById("cerrar-modal")?.addEventListener("click", () => {
            alerta.classList.add("hidden");
            alerta.classList.remove("flex");
        });
        
        document.getElementById("btn-ver-favoritos")?.addEventListener("click", () => {
            alerta.classList.add("hidden");
            alerta.classList.remove("flex");
        });
    }

    const recipeGrid = document.querySelector("#recetas .recipe-grid");

    if (recipeGrid) {
        recipeGrid.addEventListener("click", async (e) => {
            const btn = e.target.closest(".fav-btn");
            if (!btn) return;

            const recipe = {
                id: btn.dataset.id,
                title: btn.dataset.title,
                image: btn.dataset.image,
                readyInMinutes: Number(btn.dataset.minutes),
                sourceUrl: btn.dataset.url,
            };

            try {
                const result = await guardarFavorito(USER_ID, recipe);
                if (result.success) {
                    btn.textContent = "Guardado";
                    btn.disabled = true;
                    mostrarModalFavorito();
                } else {
                    console.error("Error al guardar favorito:", result.message);
                    alert("No se pudo guardar en favoritos. Intenta de nuevo.");
                }

            } catch (error) {
                console.error("Error al guardar favorito:", error);
                alert("No se pudo guardar en favoritos. Intenta de nuevo.");
            }
        });
    }

});


document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".carousel-item");
  const dots = document.querySelectorAll(".carousel-dot");

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {

      slides.forEach(slide => slide.classList.remove("active"));
      dots.forEach(d => d.classList.remove("active"));

      slides[index].classList.add("active");
      dot.classList.add("active");
    });
  });

  const registroForm = document.getElementById("registro-form");
  if (registroForm) {
    registroForm.addEventListener("submit", async (e) => {
        e.preventDefault()

        const nombre   = document.getElementById("nombre").value.trim();
        const email    = document.getElementById("email").value.trim();
        const objetivo = document.getElementById("objetivo").value;

        try {
            await guardarRegistro({ nombre, email, objetivo });
            registroForm.reset();
            alert("¡Gracias por unirte a la comunidad SmartEats!");
        } catch (error) {
            console.error("Error guardando registro:", error);
            alert("Ocurrió un error al registrar tus datos. Intenta de nuevo.");
        }
    });
    }
});

const favoritosGrid = document.getElementById("favoritos-grid");

document.addEventListener("DOMContentLoaded", () => {
    if (!favoritosGrid) return;

    escucharFavoritos(USER_ID, (data) => {
        if (!data) {
            favoritosGrid.innerHTML = `
                <p class="text-center text-slate-400">
                Aún no has agregado recetas a favoritos.
                </p>`;
            return;
        }
        const recetas = Object.values(data);
        cargarRecetas(recetas, favoritosGrid, false);
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const menuBtn = document.getElementById("menu-btn");
    const navMenu = document.getElementById("menu-pequeno");
    if (menuBtn && navMenu) {
        menuBtn.addEventListener("click", () => {
            navMenu.classList.toggle("hidden");
        });
    }

    navMenu.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
        navMenu.classList.add("hidden");
      }
    });
});
