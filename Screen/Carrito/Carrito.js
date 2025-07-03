import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  Alert,
} from "react-native";
import HeaderComponent from "../../Components/HeaderComponent";
import ChatButtonComponent from "../../Components/ChatButtonComponent";
import FooterComponent from "../../Components/FooterComponent";
import MenuComponent from "../../Components/MenuComponent";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get('window');

export default function CarritoScreen() {
  const navigation = useNavigation();
  const [showMenu, setShowMenu] = useState(false);

  // Datos de ejemplo para los productos en el carrito
  const [cartItems, setCartItems] = useState([
    { id: '1', name: 'Miel', price: 40000.0, quantity: 1, image: require('../../Src/AssetsProductos/Images/miel.jpg') },
    { id: '2', name: 'Cerveza', price: 18000.0, quantity: 1, image: require('../../Src/AssetsProductos/Images/cerveza.jpg') },
    { id: '3', name: 'Yogurt', price: 12000.0, quantity: 2, image: require('../../Src/AssetsProductos/Images/yogurtArandanos.jpeg') },
  ]);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleRemoveItem = (itemId) => {
    Alert.alert(
      "Eliminar Producto",
      "¿Estás seguro de que quieres eliminar este producto del carrito?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Eliminar",
          onPress: () => {
            setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
            Alert.alert("Eliminado", "Producto eliminado del carrito.");
          },
          style: "destructive"
        }
      ]
    );
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    const parsedQuantity = parseInt(newQuantity, 10);
    if (!isNaN(parsedQuantity) && parsedQuantity > 0) {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId ? { ...item, quantity: parsedQuantity } : item
        )
      );
    } else if (newQuantity === '') {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId ? { ...item, quantity: '' } : item
        )
      );
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleViewOrder = () => {
    Alert.alert("Ver Orden", "Simulando la visualización de la orden.");
    // Aquí iría la lógica para proceder con la orden
  };

  return (
    <View style={styles.container}>
      {/* Header Component */}
      <HeaderComponent toggleMenu={toggleMenu} />

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Título de la sección */}
        <View style={styles.titleContainer}>
          <Text style={styles.sectionTitle}>Carrito de Compras</Text>
        </View>

        {/* Breadcrumb / Ruta de navegación */}
        <View style={styles.breadcrumb}>
          <Text style={styles.breadcrumbText}>Home / Carrito</Text>
        </View>

        {/* Tabla de Productos en el Carrito */}
        <View style={styles.tableContainer}>
          {/* Encabezados de la tabla */}
          <View style={styles.tableHeader}>
            <Text style={[styles.headerText, styles.headerImageCol]}>Imagen</Text> {/* Nueva columna para imagen */}
            <Text style={[styles.headerText, styles.headerProductCol]}>Producto</Text>
            <Text style={[styles.headerText, styles.headerPriceCol]}>Precio</Text>
            <Text style={[styles.headerText, styles.headerQuantityCol]}>Cantidad</Text>
            <Text style={[styles.headerText, styles.headerTotalCol]}>Total</Text>
            <Text style={[styles.headerText, styles.headerActionCol]}>Acción</Text>
          </View>

          {/* Filas de productos */}
          {cartItems.map(item => (
            <View key={item.id} style={styles.tableRow}>
              <View style={styles.rowImageCol}>
                <Image
                  source={item.image}
                  style={styles.productThumbnail}
                  onError={(e) => console.log('Error loading image:', e.nativeEvent.error)}
                  defaultSource={require('../../Src/AssetsProductos/Images/no-image.png')} // Fallback
                />
              </View>
              <Text style={[styles.rowText, styles.rowProductCol]}>{item.name}</Text>
              <Text style={[styles.rowText, styles.rowPriceCol]}>${item.price.toLocaleString('es-CO')}</Text>
              <TextInput
                style={[styles.quantityInput, styles.rowQuantityCol]}
                keyboardType="numeric"
                value={String(item.quantity)}
                onChangeText={(text) => handleQuantityChange(item.id, text)}
                onBlur={() => { // Al perder el foco, si está vacío, se establece en 1
                  if (String(item.quantity).trim() === '' || String(item.quantity) === '0') {
                    handleQuantityChange(item.id, '1');
                  }
                }}
              />
              <Text style={[styles.rowText, styles.rowTotalCol]}>${(item.price * item.quantity).toLocaleString('es-CO')}</Text>
              <TouchableOpacity
                style={[styles.removeButton, styles.rowActionCol]}
                onPress={() => handleRemoveItem(item.id)}
              >
                <Text style={styles.removeButtonText}>Quitar</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Subtotal y botón de orden */}
        <View style={styles.summaryContainer}>
          <Text style={styles.subtotalTitle}>SUBTOTAL</Text>
          <Text style={styles.subtotalValue}>${calculateSubtotal().toLocaleString('es-CO')}</Text>
          <TouchableOpacity style={styles.viewOrderButton} onPress={handleViewOrder}>
            <Text style={styles.viewOrderButtonText}>Ver orden</Text>
          </TouchableOpacity>
        </View>

        {/* Footer Component */}
        <FooterComponent />
      </ScrollView>

      {/* Chat Button Component */}
      <ChatButtonComponent />

      {/* Menu Component */}
      <MenuComponent isVisible={showMenu} onClose={toggleMenu} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F8FA",
    paddingTop: 60, // Espacio para el header fijo
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 100, // Espacio para el botón de chat
  },
  titleContainer: {
    width: '100%',
    backgroundColor: '#6A0DAD',
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  breadcrumb: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  breadcrumbText: {
    fontSize: 14,
    color: '#777',
  },
  tableContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    width: width * 0.95, // Ocupa casi todo el ancho para la tabla
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: 20,
    overflow: 'hidden', // Para que los bordes redondeados se apliquen bien
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#E0E0E0', // Fondo para el encabezado de la tabla
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    alignItems: 'center', // Centra verticalmente los elementos de la fila
  },
  rowText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
  // Definición de anchos para las columnas del encabezado
  headerImageCol: { width: '15%' }, // Columna para la imagen
  headerProductCol: { width: '25%' },
  headerPriceCol: { width: '15%' },
  headerQuantityCol: { width: '15%' },
  headerTotalCol: { width: '15%' },
  headerActionCol: { width: '15%' },

  // Definición de anchos para las columnas de las filas
  rowImageCol: { width: '15%', alignItems: 'center' },
  rowProductCol: { width: '25%' },
  rowPriceCol: { width: '15%' },
  rowQuantityCol: { width: '15%' },
  rowTotalCol: { width: '15%' },
  rowActionCol: { width: '15%', alignItems: 'center' },

  productThumbnail: {
    width: 40,
    height: 40,
    borderRadius: 5,
    resizeMode: 'cover',
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 5,
    textAlign: 'center',
    fontSize: 14,
    width: '80%', // Ajuste para que quepa en la columna
    alignSelf: 'center',
  },
  removeButton: {
    backgroundColor: '#DC3545', // Rojo para eliminar
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%', // Ajuste para que quepa en la columna
    alignSelf: 'center',
  },
  removeButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  summaryContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    width: width * 0.95,
    padding: 20,
    alignItems: 'flex-end', // Alinea el contenido a la derecha
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: 20,
  },
  subtotalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtotalValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6A0DAD',
    marginBottom: 20,
  },
  viewOrderButton: {
    backgroundColor: '#6A0DAD',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%', // Ocupa todo el ancho del contenedor de resumen
  },
  viewOrderButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
