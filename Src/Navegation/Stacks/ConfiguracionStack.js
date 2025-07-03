import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Configuración from "../../../Screen/Configuración/Configuracion";

const Stack = createStackNavigator();

export default function ConfiguracionesStack () {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name= "Configuracion" // El nombre de la pantalla
                component={Configuración} // El componente de la pantalla
                options={{ title: "Configuraciones" }}
            />
        </Stack.Navigator>
    );
}