export default async function handler(request, response) {
    
    const { filtro } = request.query;

    const API_KEY = process.env.SPOONACULAR_API_KEY;

    const maxReadyTime = 20; 
    const number = 21;        
    const sort = 'healthiness'; 

    const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&query=${filtro}&sort=${sort}&number=${number}&maxReadyTime=${maxReadyTime}&addRecipeInformation=true`;

    try {
        const apiResponse = await fetch(url);
        
        if (!apiResponse.ok) {
            throw new Error(`Spoonacular falló: ${apiResponse.status}`);
        }

        const data = await apiResponse.json();

        response.status(200).json(data);

    } catch (error) {
        console.error("Error en api/recetas.js:", error);
        response.status(500).json({ error: error.message });
    }
}