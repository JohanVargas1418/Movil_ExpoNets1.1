import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logoutUser } from "../Src/Services/AuthServeces"; // Asegúrate de que esta ruta sea correcta

export default function MenuComponent({ isVisible, onClose }) {
  const navigation = useNavigation();
  const isFocused = useIsFocused(); // Hook para saber si la pantalla está enfocada

  // Clave para almacenar el token de usuario, consistente con otros componentes
  const ASYNC_STORAGE_USER_TOKEN_KEY = "userToken";
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado para el estado de login

  // Efecto para verificar el estado de login cuando el menú se hace visible o la pantalla se enfoca
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userToken = await AsyncStorage.getItem(ASYNC_STORAGE_USER_TOKEN_KEY);
        setIsLoggedIn(!!userToken); // Si userToken existe (no es null/undefined), isLoggedIn será true
      } catch (error) {
        console.error("Error al verificar el estado de login en el menú:", error);
        setIsLoggedIn(false); // En caso de error, asumimos que no está logueado
      }
    };

    if (isVisible || isFocused) { // Ejecuta la verificación cuando el menú se abre o la pantalla se enfoca
      checkLoginStatus();
    }
  }, [isVisible, isFocused]); // Dependencias: se ejecuta cuando isVisible o isFocused cambian

  const handleMenuItemPress = (item) => {
    if (item === "Productos") {
      navigation.navigate("ListarProductos");
    }
    else if (item === "Eventos") {
      navigation.navigate("ListarEventos");
    }
    else if (item === "Carrito") {
      navigation.navigate("Carrito"); // Corregido para usar "CarritoScreen" según tu AppNavegacion.js
    }
    else if (item === "Home") {
      navigation.navigate("Home");
    }
    else if (item === "Nosotros") {
      navigation.navigate("Nosotros");
    }
    else if (item === "Perfil") {
      navigation.navigate("Perfil");
    }
    else if (item === "CerrarSesion") {
      handleLogout();
    }
    else if (item === "IniciarSesion") { // Nuevo caso para Iniciar Sesión
      navigation.navigate("Login"); // Navega a la pantalla de Login
    }
    else {
      Alert.alert("Navegación", `Simulando ir a ${item}`);
    }
    onClose(); // Cerrar el menú después de seleccionar un elemento
  };

  const handleLogout = async () => {
    try {
      const result = await logoutUser(); // Llama a la función de cerrar sesión de tus servicios
      if (result.success) {
        await AsyncStorage.removeItem(ASYNC_STORAGE_USER_TOKEN_KEY); // Elimina el token de AsyncStorage
        Alert.alert("Sesión Cerrada", "Has cerrado sesión exitosamente.");
        setIsLoggedIn(false); // Actualiza el estado a no logueado
        navigation.navigate("Login"); // Redirige a la pantalla de login
      } else {
        Alert.alert("Error al cerrar sesión", result.message || "No se pudo cerrar la sesión.");
      }
    } catch (error) {
      console.error("Error inesperado al cerrar sesión:", error);
      Alert.alert("Error", "Ocurrió un error inesperado al cerrar sesión.");
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.menuOverlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.closeMenuButton} onPress={onClose}>
            <Ionicons name="close-outline" size={30} color="#6A0DAD" />
          </TouchableOpacity>
          <Text style={styles.menuTitle}>Menú</Text>
          <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuItemPress("Home")}>
            <Text style={styles.menuItemText}>Inicio</Text>
            <Ionicons name="home-outline" size={24} color="#6A0DAD" style={styles.menuIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuItemPress("Nosotros")}>
            <Text style={styles.menuItemText}>Nosotros</Text>
            <Ionicons name="information-circle-outline" size={24} color="#6A0DAD" style={styles.menuIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuItemPress("Productos")}>
            <Text style={styles.menuItemText}>Productos</Text>
            <Ionicons name="pricetag-outline" size={24} color="#6A0DAD" style={styles.menuIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuItemPress("Eventos")}>
            <Text style={styles.menuItemText}>Eventos</Text>
            <Ionicons name="calendar-outline" size={24} color="#6A0DAD" style={styles.menuIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuItemPress("Carrito")}>
            <Text style={styles.menuItemText}>Carrito</Text>
            <Ionicons name="cart-outline" size={24} color="#6A0DAD" style={styles.menuIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuItemPress("Perfil")}>
            <Text style={styles.menuItemText}>Mi Perfil</Text>
            <Ionicons name="person-outline" size={24} color="#6A0DAD" style={styles.menuIcon} />
          </TouchableOpacity>

          {/* Renderizado condicional del botón de login/logout */}
          {isLoggedIn ? (
            <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuItemPress("CerrarSesion")}>
              <Text style={styles.menuItemText}>Cerrar Sesión</Text>
              <Ionicons name="log-out-outline" size={24} color="#6A0DAD" style={styles.menuIcon} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuItemPress("IniciarSesion")}>
              <Text style={styles.menuItemText}>Iniciar Sesión</Text>
              <Ionicons name="log-in-outline" size={24} color="#6A0DAD" style={styles.menuIcon} />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  menuContainer: {
    width: Dimensions.get('window').width * 0.75,
    height: '100%',
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: -5, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 10,
  },
  closeMenuButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    padding: 10,
    zIndex: 1,
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  menuItemText: {
    fontSize: 18,
    color: '#555',
    fontWeight: '600',
  },
  // Renombrado de cartIcon a menuIcon para ser más genérico
  menuIcon: {
    marginLeft: 10,
  },
});
