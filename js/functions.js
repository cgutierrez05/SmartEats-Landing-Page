const fetchRecetas = async (url) => {
    try {
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
}

export {fetchRecetas};