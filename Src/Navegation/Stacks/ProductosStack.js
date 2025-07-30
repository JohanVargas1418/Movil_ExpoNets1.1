import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ListarProductosScreen from "../../../Screen/Productos/ListarProductos";
import DetalleProducto from "../../../Screen//";
import EditarProducto from "../../../Screen//";

const Stack = createStackNavigator();

export default function ProductosStack () {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name= "ListarProductosScreen"
                component={ListarProductosScreen}
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