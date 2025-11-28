import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getDatabase, ref, set, push, get, child } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";
import { onValue } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export const guardarRegistro = async ({nombre, email, objetivo}) => {
    try {
        const registrosRef = ref(database, "registros");
        const nuevoRegistroRef = push(registrosRef);
        await set(nuevoRegistroRef, {
            nombre,
            email,
            objetivo,
            createdAt: Date.now(),
        }); 
        return { success: true, 
            message: "Registro guardado con éxito" };   

    } catch (error) {
        console.error(error);
        return { 
            success: false, 
            message: "Error al guardar registro" 
        };
    }
};

export const guardarFavorito = async (userId, recipe) => {
    try {
        const favRef = ref(database, `favoritos/${userId}/${recipe.id}`);
        await set(favRef, recipe);
        return {
            success: true,
            message: "Receta agregada a favoritos",
        }
    } catch (error) {
        console.error(error);
        return { 
            success: false, 
            message: "Error al guardar favorito" 
        };
    }

};

export const escucharFavoritos = (userId, callback) => {
    const favRef = ref(database, `favoritos/${userId}`);
    onValue(favRef, (snapshot) => {
        if (snapshot.exists()) {
            callback(snapshot.val());
        } else {
          callback(null);
        }
    });
};