import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ListarEventosScreen from "../../../Screen/Eventos/ListarEventos";
import DetalleEvento from "../../../Screen//Detalle";
import EditarCita from "../../../Screen//Editar";

const Stack = createStackNavigator();

export default function EventosStack () {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name= "ListarEventos"
                component={ListarEventosScreen}
                options={{ title: "Eventos" }}
            />
             <Stack.Screen 
                name= "DetalleEvento"
                component={DetalleEvento}
                options={{ title: "Detalle Evento" }}
            />
             <Stack.Screen 
                name= "EditarEvento"
                component={EditarEvento}
                options={{ title: "Nuevo/Editar Evento" }}
            />
        </Stack.Navigator>
    );
}