import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from '../../Screen/Auth/Login';
import RegisterScreen from '../../Screen/Auth/Registro';
import ListarProductos from '../../Screen/Productos/ListarProductos';
import DetalleProducto from '../../Screen/Productos/DetalleProducto';
import ListarEventos from '../../Screen/Eventos/ListarEventos';
import CarritoScreen from '../../Screen/Carrito/Carrito';
import HomeScreen from '../../Screen/Home/Home';
import NosotrosScreen from '../../Screen/Nosotros/Nosotros';
import OrdenScreen from '../../Screen/Carrito/orden'; // Asegúrate de que la ruta sea correcta
import RecuperarPassword from '../../Screen/Auth/RecuperarPassword'; // Importa RecuperarPassword

const Stack = createStackNavigator();

export default function AppNavegacion() {
  // Opciones de estilo comunes para el encabezado
  const commonHeaderOptions = {
    headerShown: true, // Asegura que el encabezado esté visible por defecto
    headerStyle: {
      backgroundColor: '#6A0DAD', // Color morado para el fondo
      height: 100, // Aumenta la altura del encabezado
    },
    headerTintColor: '#FFFFFF', // Color blanco para el texto y los iconos (como el botón de retroceso)
    headerTitleStyle: {
      fontWeight: 'bold', // Título en negrita
      fontSize: 21, // Tamaño de fuente del título
    },
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }} // Se mantiene oculto
        />
        <Stack.Screen
          name="Registro"
          component={RegisterScreen}
          options={{ ...commonHeaderOptions, title: 'Registro de Usuario' }} // Aplica estilos comunes y título específico
        />
        <Stack.Screen
          name="ListarProductos"
          component={ListarProductos}
          options={{ ...commonHeaderOptions, title: 'Explorar Productos' }} // Aplica estilos comunes y título específico
        />
        <Stack.Screen
          name="DetalleProducto"
          component={DetalleProducto}
          options={{ ...commonHeaderOptions, title: 'Detalle del Producto' }} // Aplica estilos comunes y título específico
        />
        <Stack.Screen
          name="ListarEventos"
          component={ListarEventos}
          options={{ ...commonHeaderOptions, title: 'Eventos' }} // Aplica estilos comunes y título específico
        />
        <Stack.Screen
          name="Carrito"
          component={CarritoScreen}
          options={{ ...commonHeaderOptions, title: 'Carrito de Compras' }} // Aplica estilos comunes y título específico
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }} // Se mantiene oculto
        />
        <Stack.Screen
          name="Nosotros"
          component={NosotrosScreen}
          options={{ ...commonHeaderOptions, title: 'Acerca de ExpoNets' }} // Aplica estilos comunes y título específico
        />
        <Stack.Screen
          name="Orden"
          component={OrdenScreen}
          options={{ ...commonHeaderOptions, title: 'Detalles de tu Orden' }} // Aplica estilos comunes y título específico
        />
        {/* <Stack.Screen
          name="Perfil"
          component={PerfilScreen}
          options={{ ...commonHeaderOptions, title: 'Mi Perfil' }} // Aplica estilos comunes y título específico
        /> */}
        <Stack.Screen
          name="RecuperarPassword"
          component={RecuperarPassword}
          options={{ ...commonHeaderOptions, title: 'Recuperar Contraseña' }} // Aplica estilos comunes y título específico
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}