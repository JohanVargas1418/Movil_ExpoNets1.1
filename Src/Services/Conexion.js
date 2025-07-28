import axios from 'axios'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const API_BASE_URL = "http://172.30.3.22:8000/api"; // URL base de la API (usa tu IP real)

// Crea una instancia de Axios con la configuración base
const api = axios.create({
    baseURL: API_BASE_URL, // Establece la URL base
    headers: {
        'Accept': 'application/json', // Acepta respuestas en formato JSON
        'Content-Type': 'application/json', // Envía datos en formato JSON
    },
});

// Rutas públicas que no requieren autenticación
const RutasPublicas = ['/login', '/registrar'];

// Interceptor para las solicitudes
api.interceptors.request.use(
    async (config) => {
        // Verifica si la ruta es pública
        const isRutaPublica = RutasPublicas.some(route => config.url.includes(route));

        if (!isRutaPublica) {
            // Si no es pública, intenta obtener el token del usuario
            const userToken = await AsyncStorage.getItem('userToken');
            if (userToken) {
                // Si hay un token, lo agrega a los encabezados de la solicitud
                config.headers.Authorization = `Bearer ${userToken}`;
            }
        }
        return config; // Devuelve la configuración de la solicitud
    },
    (error) => {
        return Promise.reject(error); 
    }
);

// Interceptor para manejar respuestas
api.interceptors.response.use(
    (response) => response, // Devuelve la respuesta si es exitosa
    async (error) => {
        const originalRequest = error.config; // Guarda la solicitud original
        // Verifica si la ruta es pública
        const isRutaPublica = RutasPublicas.some(route => originalRequest.url.includes(route));

        // Manejo de errores 401 (no autorizado)
        if (error.response && error.response.status === 401 && !originalRequest._retry && !isRutaPublica) {
            originalRequest._retry = true; // Marca la solicitud como reintentada

            console.log("Token expirado o no autorizado. Redirigiendo al login.");
            await AsyncStorage.removeItem('userToken'); // Elimina el token del almacenamiento
        }
        return Promise.reject(error); 
    }
);

export default api;