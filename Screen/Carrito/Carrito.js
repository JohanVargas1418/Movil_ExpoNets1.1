import React, { useState, useEffect } from "react";
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
import { useNavigation, useRoute } from "@react-navigation/native";

const { width } = Dimensions.get('window');

export default function CarritoScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const addedProduct = route.params?.addedProduct;

  const [showMenu, setShowMenu] = useState(false);
  const [activeDeleteProductId, setActiveDeleteProductId] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (addedProduct) {
      setCartItems((prevItems) => {
        const existingItem = prevItems.find(item => item.id === addedProduct.id);
        if (existingItem) {
          return prevItems.map(item =>
            item.id === addedProduct.id
              ? { ...item, quantity: item.quantity + addedProduct.quantity }
              : item
          );
        } else {
          return [...prevItems, addedProduct];
        }
      });
    }
  }, [addedProduct]);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleRemoveItem = (itemId) => {
    Alert.alert(
      "Eliminar Producto",
      "¿Estás seguro de que quieres eliminar este producto del carrito?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          onPress: () => {
            setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
            setActiveDeleteProductId(null);
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

  const handleIncrement = (itemId) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecrement = (itemId) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
      )
    );
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

 const handleViewOrder = () => {
  navigation.navigate("OrdenScreen", {
    cartItems: cartItems.map(item => ({
      nombre: item.name,
      cantidad: item.quantity,
      precio: item.price,
      imagen: item.source?.uri ?? null
    }))
  });
};




  return (
    <View style={styles.container}>
      <HeaderComponent toggleMenu={toggleMenu} />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.titleContainer}>
          <Text style={styles.sectionTitle}>Carrito de Compras</Text>
        </View>

        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerText, styles.headerProductInfoCol]}>Producto</Text>
            <Text style={[styles.headerText, styles.headerPriceCol]}>Precio</Text>
            <Text style={[styles.headerText, styles.headerQuantityCol]}>Cantidad</Text>
            <Text style={[styles.headerText, styles.headerTotalCol]}>Total</Text>
          </View>

          {cartItems.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.tableRow}
              onPress={() => setActiveDeleteProductId(item.id === activeDeleteProductId ? null : item.id)}
            >
              <View style={[styles.rowProductInfoCol, styles.productInfoCell]}>
                <View style={styles.thumbnailWrapper}>
                  <Image
                    source={item.source}
                    style={styles.productThumbnail}
                    resizeMode="cover"
                    onError={(e) =>
                      console.log("Error al cargar imagen:", e.nativeEvent.error)
                    }
                  />


                  {activeDeleteProductId === item.id && (
                    <TouchableOpacity
                      style={styles.deleteIconContainer}
                      onPress={() => handleRemoveItem(item.id)}
                    >
                      <Ionicons name="close-circle" size={20} color="#DC3545" />
                    </TouchableOpacity>
                  )}
                </View>
                <Text style={styles.productNameInRow}>{item.name}</Text>
              </View>
              <Text style={[styles.rowText, styles.rowPriceCol]}>${item.price.toLocaleString('es-CO')}</Text>
              <View style={[styles.quantityInputWrapper, styles.rowQuantityCol]}>
                <TouchableOpacity onPress={() => handleDecrement(item.id)} style={styles.quantityArrowButton}>
                  <Ionicons name="chevron-down-outline" size={16} color="#6A0DAD" />
                </TouchableOpacity>
                <TextInput
                  style={styles.quantityInput}
                  keyboardType="numeric"
                  value={String(item.quantity)}
                  onChangeText={(text) => handleQuantityChange(item.id, text)}
                  onBlur={() => {
                    if (String(item.quantity).trim() === '' || String(item.quantity) === '0') {
                      handleQuantityChange(item.id, '1');
                    }
                  }}
                />
                <TouchableOpacity onPress={() => handleIncrement(item.id)} style={styles.quantityArrowButton}>
                  <Ionicons name="chevron-up-outline" size={16} color="#6A0DAD" />
                </TouchableOpacity>
              </View>
              <Text style={[styles.rowText, styles.rowTotalCol]}>${(item.price * item.quantity).toLocaleString('es-CO')}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.summaryContainer}>
          <Text style={styles.subtotalTitle}>SUBTOTAL</Text>
          <Text style={styles.subtotalValue}>${calculateSubtotal().toLocaleString('es-CO')}</Text>
          <TouchableOpacity style={styles.viewOrderButton} onPress={handleViewOrder}>
            <Text style={styles.viewOrderButtonText}>Ver orden</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ChatButtonComponent />
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
    margin: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
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
  headerProductInfoCol: { width: '30%' }, // Reducido para dar más espacio
  headerPriceCol: { width: '18%' }, // Aumentado ligeramente
  headerQuantityCol: { width: '27%' }, // Aumentado para el TextInput y flechas
  headerTotalCol: { width: '25%' }, // Se mantiene el mismo
  // headerActionCol: { width: '0%' }, // Eliminada la columna de acción

  // Definición de anchos para las columnas de las filas
  rowProductInfoCol: {
    width: '30%', // Ancho ajustado
    flexDirection: 'column', // Apila imagen y texto
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5, // Pequeño padding para el contenido
    // position: 'relative', // Se movió al thumbnailWrapper
  },
  thumbnailWrapper: { // Nuevo estilo para el contenedor de la imagen y el icono
    position: 'relative',
    width: 60, // Mismo tamaño que la miniatura
    height: 60, // Mismo tamaño que la miniatura
    marginBottom: 5,
  },
  productThumbnail: {
    width: 60, // Aumentado el tamaño de la miniatura
    height: 60, // Aumentado el tamaño de la miniatura
    borderRadius: 8, // Bordes más redondeados
    resizeMode: 'cover',
    // marginBottom: 5, // Se movió al thumbnailWrapper
  },
  productNameInRow: {
    fontSize: 12, // Tamaño de fuente más pequeño para el nombre en la fila
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'center',
    flexWrap: 'wrap', // Permite que el texto se ajuste si es largo
  },
  rowPriceCol: { width: '18%' }, // Ancho ajustado
  rowQuantityCol: {
    width: '27%', // Ancho ajustado para la columna de cantidad
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowTotalCol: { width: '25%' }, // Ancho ajustado
  // rowActionCol: { width: '0%', alignItems: 'center' }, // Eliminada la columna de acción

  quantityInputWrapper: { // Nuevo estilo para el wrapper del input y las flechas
    flexDirection: 'row',
    alignItems: 'center',

    borderColor: '#CCC',
    borderRadius: 5,
    width: '90%', // Ocupa casi todo el ancho de su columna
    justifyContent: 'space-between', // Espacia el input y las flechas
    paddingHorizontal: 2, // Pequeño padding interno
  },
  quantityInput: {
    // Permite que el input ocupe el espacio restante
    textAlign: 'center',
    fontSize: 14,
    paddingVertical: 5,

  },
  quantityArrowButton: { // Estilo para los botones de flecha
    padding: 5,
  },
  deleteIconContainer: { // Nuevo estilo para el contenedor del icono de eliminar
    position: 'absolute',
    top: -5, // Ajusta la posición vertical
    right: -5, // Ajusta la posición horizontal
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Fondo semitransparente para el icono
    borderRadius: 15, // Para que sea un círculo o un cuadrado redondeado
    padding: 2,
    zIndex: 1, // Asegura que esté por encima de la imagen
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
