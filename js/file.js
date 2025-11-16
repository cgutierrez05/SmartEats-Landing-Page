import { fetchRecetas } from './functions';

const cargarRecetas = (recetasArray, contenedor) => {
    contenedor.innerHTML = "";

    if (!recetasArray || recetasArray.length === 0) {
        contenedor.innerHTML = "<p>No se encontraron recetas con ese criterio.</p>";
        return;}

    recetasArray.forEach(receta => {
        const recipeCard = `
            <div class="recipe-card">
              <div class="card-img-box">
                  <img src="${receta.image}" alt="${receta.title}">
              </div>
              <div class="card-detail-box">
                  <h3>${receta.title}</h3>
                  <p>Tiempo: ${receta.readyInMinutes} min</p>
                  <a href="${receta.sourceUrl}" target="_blank" class="view-recipe-btn">Ver Receta</a>
              </div>
            </div>
        `;
        contenedor.innerHTML += recipeCard;
    });
}

const CargarYFiltrar = async (filtro, contenedor) => {
    contenedor.innerHTML = `<p>Buscando recetas de ${filtro}...</p>`;
    const respuesta = await fetchRecetas(`/api/recetas?filtro=${filtro}`);

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