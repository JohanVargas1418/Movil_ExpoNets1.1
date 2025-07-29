import api from "./Conexion";

export const ListarEventos = async () => {
    try {
        const response = await api.get("/listarEventos");
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error al listar Productos:", error.response ? error.response.data : error.message);
        return {
            success: false,
            message: error.response ? error.response.data : "Error de conexión",
        };
    }
};