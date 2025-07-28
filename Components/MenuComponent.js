import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // Importar useNavigation

export default function MenuComponent({ isVisible, onClose }) {
 const navigation = useNavigation(); // Obtener la instancia de navegación

  const handleMenuItemPress = (item) => {
    if (item === "Productos") {
      navigation.navigate("ListarProductos"); // Navegar a la pantalla ListarProductos
    } 
    else if (item === "Eventos") {
      navigation.navigate("ListarEventos"); // Navegar a la pantalla ListarProductos
    } 
    else if (item === "Carrito") {
      navigation.navigate("Carrito"); // Navegar a la pantalla ListarProductos
    } 
    else if (item === "Home") {
      navigation.navigate("Home"); // Navegar a la pantalla Home
    }
    else if (item === "Nosotros") {
      navigation.navigate("Nosotros"); // Navegar a la pantalla Nosotros
    }
    else {
      Alert.alert("Navegación", `Simulando ir a ${item}`);
    }
    onClose(); // Cerrar el menú después de seleccionar un elemento
  };

  return (
    <Modal
      animationType="fade" // O "slide" para un efecto de deslizamiento
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose} // Para cerrar con el botón de retroceso de Android
    >
      <TouchableOpacity style={styles.menuOverlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.closeMenuButton} onPress={onClose}>
            <Ionicons name="close-outline" size={30} color="#6A0DAD" />
          </TouchableOpacity>
          <Text style={styles.menuTitle}>Menú</Text>
          <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuItemPress("Home")}>
            <Text style={styles.menuItemText}>Inicio</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuItemPress("Nosotros")}>
            <Text style={styles.menuItemText}>Nosotros</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuItemPress("Productos")}>
            <Text style={styles.menuItemText}>Productos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuItemPress("Eventos")}>
            <Text style={styles.menuItemText}>Eventos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuItemPress("Carrito")}>
            <Text style={styles.menuItemText}>Carrito</Text>
            <Ionicons name="cart-outline" size={24} color="#6A0DAD" style={styles.cartIcon} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente
    justifyContent: 'flex-start', // Alinea el menú a la parte superior
    alignItems: 'flex-end', // Alinea el menú a la derecha
  },
  menuContainer: {
    width: Dimensions.get('window').width * 0.75, // Ocupa el 75% del ancho de la pantalla
    height: '100%',
    backgroundColor: '#FFFFFF',
    paddingTop: 60, // Espacio para el header
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: -5, height: 0 }, // Sombra a la izquierda
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
  cartIcon: {
    marginLeft: 10,
  },
});