import AsyncStorage from "@react-native-async-storage/async-storage"; 
import api from "..//Services/Conexion"; // Importa la instancia de Axios configurada

// Función para iniciar sesión de un usuario
export const loginUser  = async (email, password) => {
    try {
        // Realiza una solicitud POST a la API para iniciar sesión
        const response = await api.post("/login", { email, password });
        console.log("Respuesta de la API:", response.data); 
        const { token } = response.data; // Extrae el token de la respuesta

        if (token) {
            // Si se recibe un token, lo guarda en AsyncStorage
            await AsyncStorage.setItem("userToken", token);
            return { success: true, token: token }; // Devuelve el éxito y el token
        } else {
            console.error("Token no recibido en la respuesta"); 
            throw new Error("Token no recibido"); 
        }
    } catch (error) {
        // Manejo de errores en caso de fallo en la solicitud
        console.error(
            "Error de login:",
            error.response ? error.response.data : error.message
        );
        return {
            success: false, // Indica que la operación falló
            message: error.response
                ? error.response.data.message
                : "Error al conectar",
        };
    }
};

// Función para cerrar sesión de un usuario
export const logoutUser  = async () => {
    try {
        // Realiza una solicitud POST a la API para cerrar sesión
        await api.post("/logout");
        await AsyncStorage.removeItem("userToken"); // Elimina el token de AsyncStorage
        return { success: true };o
    } catch (error) {
        // Manejo de errores en caso de fallo en la solicitud
        console.error("Error al cerrar sesión:", error.response ? error.response.data : error.message);
        return { 
            success: false, 
            message: error.response ? error.response.data.message : "Error al cerrar sesión"
        };
    }
};

// Función para registrar un nuevo usuario
export const registroUser  = async (nombre, email, password ,direccion,telefono) => {
    try {
        // Realiza una solicitud POST a la API para registrar un nuevo usuario
        const response = await api.post("/registrar", {
            nombre,
            email,
            password,
            direccion,
            telefono,
            // username,
            // imagen,
        });

        return response.data; // Devuelve los datos de la respuesta
    } catch (error) {
        console.error(
            "Error al registrar:",
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
