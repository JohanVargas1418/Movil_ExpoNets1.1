import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ListarProductos from "../../../Screen//";
import DetalleProducto from "../../../Screen//";
import EditarProducto from "../../../Screen//";

const Stack = createStackNavigator();

export default function ProductosStack () {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name= "ListarProductos"
                component={ListarProductos}
                options={{ title: "Productos" }}
            />
             <Stack.Screen 
                name= "DetalleProducto"
                component={DetalleProducto}
                options={{ title: "Detalle Producto" }}
            />
             <Stack.Screen 
                name= "EditarProducto"
                component={EditarProducto}
                options={{ title: "Nuevo/Editar Producto" }}
            />
        </Stack.Navigator>
    );
}