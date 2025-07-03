// src/stacks/InicioStack.js

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

// Importa la pantalla de Inicio (el "dashboard" con las 4 casillas)
import Inicio from "../../../Screen/Inicio/Inicio";

// Importa los stacks secundarios que quieres anidar
import EventosStack from "./CitasStack";
import ProductosStack from "./EspecialidadesStack";

const Stack = createStackNavigator();

export default function InicioStack () {
    return (
        <Stack.Navigator>
            {/* 1. La pantalla principal de tu pestaña "Inicio" */}
            <Stack.Screen
                name="InicioPantalla" // Este es el nombre que usarás si necesitas navegar directamente a esta pantalla
                component={Inicio}
                options={{ headerShown: false }} // Oculta el encabezado en esta pantalla específica
            />

            {/* 2. Anidación de los Stacks completos */}
            {/* Es crucial que los 'name' aquí coincidan con lo que pasas a navigation.navigate() en Inicio.js */}
            <Stack.Screen
                name="EventosFlow" // Nombre consistente con la navegación en Inicio.js
                component={EventosStack}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="ProductosFlow" // Nombre consistente con la navegación en Inicio.js
                component={ProductosStack}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}