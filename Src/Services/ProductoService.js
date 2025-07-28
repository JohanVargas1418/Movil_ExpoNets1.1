import api from "./Conexion";

export const ListarProductos = async () => {
    try {
        const response = await api.get("/listarProducto");
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error al listar Productos:", error.response ? error.response.data : error.message);
        return {
            success: false,
            message: error.response ? error.response.data : "Error de conexión",
        };
    }
};