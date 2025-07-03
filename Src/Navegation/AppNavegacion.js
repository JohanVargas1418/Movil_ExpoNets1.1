import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from '../../Screen/Auth/Login'; // Asegúrate de que esta ruta sea correcta
import RegisterScreen from '../../Screen/Auth/Registro'; // Asegúrate de que esta ruta sea correcta
import ListarProductos from '../../Screen/Productos/ListarProductos'; // Asegúrate de que esta ruta sea correcta
import DetalleProducto from '../../Screen/Productos/DetalleProducto'; // Asegúrate de que esta ruta sea correcta
import ListarEventos from '../../Screen/Eventos/ListarEventos'; // Asegúrate de que esta ruta sea correcta
import CarritoScreen from '../../Screen/Carrito/Carrito'; // Asegúrate de que esta ruta sea correcta
// Importa cualquier otra pantalla que necesites aquí

const Stack = createStackNavigator();

export default function AppNavegacion() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login"> 
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }} // Oculta el encabezado por defecto
        />
        <Stack.Screen
          name="Registro"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen // Añade la pantalla ListarProductos al Stack Navigator
          name="ListarProductos"
          component={ListarProductos}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DetalleProducto"
          component={DetalleProducto}
          options={{ headerShown: false }}
        />
         <Stack.Screen // Añade la pantalla ListarProductos al Stack Navigator
          name="ListarEventos"
          component={ListarEventos}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Carrito"
          component={CarritoScreen}
          options={{ headerShown: false }}
        />
       
      </Stack.Navigator>
    </NavigationContainer>
  );
}
