import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./Conexion"; // Importa la instancia de Axios configurada

// Helper para decodificar JWT y obtener el payload
const decodeJwt = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Error decodificando JWT:", e);
        return null;
    }
};

// Función para iniciar sesión de un usuario
export const loginUser = async (email, password) => {
    try {
        // Realiza una solicitud POST a la API para iniciar sesión
        const response = await api.post("/login", { email, password });
        console.log("Respuesta completa de la API en loginUser:", response.data); 
        
        // Extrae el token y el objeto 'usuario' de la respuesta
        const { token, usuario } = response.data;
        let userId = null;

        // Intenta obtener el userId del objeto 'usuario' si está presente
        if (usuario && usuario.id) {
            userId = usuario.id;
        } else if (token) {
            // Si el objeto 'usuario' no está, intenta decodificar el token para obtener el userId del campo 'sub'
            const decodedToken = decodeJwt(token);
            if (decodedToken && decodedToken.sub) {
                userId = decodedToken.sub;
            }
        }

        // Verifica que se reciban el token y el ID del usuario (ya sea del objeto usuario o del token)
        if (token && userId) {
            // Si se recibe un token y un ID de usuario, los guarda en AsyncStorage
            await AsyncStorage.setItem("userToken", token);
            await AsyncStorage.setItem("userId", String(userId)); // Guarda el ID del usuario como string
            console.log("Token y UserId guardados:", { token, userId });
            return { success: true, token: token, userId: userId }; // Devuelve el éxito, el token y el ID del usuario
        } else {
            console.error("Token o ID de usuario no recibido en la respuesta de login."); 
            throw new Error("Token o ID de usuario no recibido"); 
        }
    } catch (error) {
        // Manejo de errores en caso de fallo en la solicitud
        console.error(
            "Error de login en AuthServeces:",
            error.response ? error.response.data : error.message
        );
        return {
            success: false, // Indica que la operación falló
            message: error.response
                ? error.response.data.message // Mensaje de error del backend si está disponible
                : "Error al conectar con el servidor", // Mensaje genérico si no hay respuesta del backend
        };
    }
};

// Función para cerrar sesión de un usuario
export const logoutUser = async () => {
    try {
        // Realiza una solicitud POST a la API para cerrar sesión
        await api.post("/logout");
        await AsyncStorage.removeItem("userToken"); // Elimina el token de AsyncStorage
        await AsyncStorage.removeItem("userId"); // Elimina también el ID del usuario al cerrar sesión
        console.log("Sesión cerrada y tokens eliminados.");
        return { success: true };
    } catch (error) {
        // Manejo de errores en caso de fallo en la solicitud
        console.error("Error al cerrar sesión en AuthServeces:", error.response ? error.response.data : error.message);
        return { 
            success: false, 
            message: error.response ? error.response.data.message : "Error al cerrar sesión"
        };
    }
};

// Función para registrar un nuevo usuario
export const registroUser = async (nombre, email, password, direccion, telefono) => {
    try {
        // Realiza una solicitud POST a la API para registrar un nuevo usuario
        const response = await api.post("/registrar", {
            nombre,
            email,
            password,
            direccion,
            telefono,
        });
        console.log("Respuesta de registro:", response.data);
        return response.data; // Devuelve los datos de la respuesta
    } catch (error) {
        console.error(
            "Error al registrar en AuthServeces:",
            error.response ? error.response.data : error.message
        );
        return {
            success: false, // Indica que la operación falló
            message: error.response
                ? error.response.data.message 
                : "Error de conexión",
        };
    }
};
