import { fetchRecetas } from './functions.js';

const cargarRecetas = (recetasArray, contenedor) => {
    contenedor.innerHTML = "";

    if (!recetasArray || recetasArray.length === 0) {
        contenedor.innerHTML = `<p class="text-center text-slate-500 col-span-full">
        No se encontraron recetas con ese criterio.</p>`;
        return;
    }

    recetasArray.forEach(receta => {
        const recipeCard =  `
        <article class="recipe-card">
            <div class="card-img-box">
                <img src="${receta.image}" alt="${receta.title}">
            </div>

            <div class="card-detail-box">
                <h3>${receta.title}</h3>
                <p class="recipe-time">
                    ⏱ ${receta.readyInMinutes} min
                </p>

                <div class="recipe-actions">
                    <a href="${receta.sourceUrl}" target="_blank" class="view-recipe-btn">
                        Ver receta
                    </a>

                    <button class="fav-btn" data-recipe-id="${receta.id}">
                        + Favoritos
                    </button>
                </div>
            </div>
        </article>`;
        contenedor.innerHTML += recipeCard;
    });
}

const CargarYFiltrar = async (filtro, contenedor) => {
    contenedor.innerHTML = `<p>Buscando recetas de ${filtro}...</p>`;
    const respuesta = await fetchRecetas(filtro);

    if (respuesta.success) {
        cargarRecetas(respuesta.body.results, contenedor);
    } else {
        contenedor.innerHTML = `<p>Error al cargar: ${respuesta.body}</p>`;
    }
}

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

document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".carousel-item");
  const dots = document.querySelectorAll(".carousel-dot");

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {

      // Quitar active de todas las slides y puntos
      slides.forEach(slide => slide.classList.remove("active"));
      dots.forEach(d => d.classList.remove("active"));

      // Activar slide y punto clickeado
      slides[index].classList.add("active");
      dot.classList.add("active");
    });
  });
});