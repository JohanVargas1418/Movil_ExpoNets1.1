import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Importa todas tus pantallas
import LoginScreen from '../../Screen/Auth/Login';
import RegisterScreen from '../../Screen/Auth/Registro';
import ListarProductos from '../../Screen/Productos/ListarProductos';
import DetalleProducto from '../../Screen/Productos/DetalleProducto';
import ListarEventos from '../../Screen/Eventos/ListarEventos';
import CarritoScreen from '../../Screen/Carrito/Carrito';
import HomeScreen from '../../Screen/Home/Home';
import NosotrosScreen from '../../Screen/Nosotros/Nosotros';
import OrdenScreen from '../../Screen/Carrito/orden'; // Asegúrate de que esta ruta sea correcta
import RecuperarPassword from '../../Screen/Auth/RecuperarPassword';
import PaymentScreen from '../../Screen/pago/PaymentScreen'; // ¡Nueva pantalla de pago! Asegúrate de que esta ruta sea correcta

const Stack = createStackNavigator();

export default function AppNavegacion() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }} // Oculta el encabezado para esta pantalla
        />

        
        <Stack.Screen
          name="Registro"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />

        
        <Stack.Screen
          name="ListarProductos"
          component={ListarProductos}
          options={{ headerShown: false }}
        />

        
        <Stack.Screen
          name="DetalleProducto"
          component={DetalleProducto}
          options={{ headerShown: false }}
        />

        
        <Stack.Screen
          name="ListarEventos"
          component={ListarEventos}
          options={{ headerShown: false }}
        />

        
        <Stack.Screen
          name="Carrito"
          component={CarritoScreen}
          options={{ headerShown: false }}
        />

        
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />

        
        <Stack.Screen
          name="Nosotros"
          component={NosotrosScreen}
          options={{ headerShown: false }}
        />

        
        <Stack.Screen
          name="Orden"
          component={OrdenScreen}
          options={{ headerShown: false }}
        />

        {/* ¡Nueva Pantalla de Pago! */}
        <Stack.Screen
          name="PaymentScreen"
          component={PaymentScreen}
          options={{ headerShown: false }}
        />

        
        <Stack.Screen
          name="RecuperarPassword"
          component={RecuperarPassword}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}