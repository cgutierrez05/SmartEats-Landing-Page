const fetchRecetas = async (filtro) => {
    try {

        const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;
        const maxReadyTime = 20;
        const number = 21;
        const sort = 'healthiness';

        const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&query=${filtro}&sort=${sort}&number=${number}&maxReadyTime=${maxReadyTime}&addRecipeInformation=true`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        let data = await response.json(); 

        return {
            success: true,
            body: data 
        };

    } catch (error) {
        console.error("Error al hacer fetch:", error);
        return {
            success: false,
            body: error.message
        };
    }
};

export {fetchRecetas};