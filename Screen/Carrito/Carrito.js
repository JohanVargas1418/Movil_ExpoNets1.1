import React, { useState, useEffect, useCallback } from "react";
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import HeaderComponent from "../../Components/HeaderComponent";
import ChatButtonComponent from "../../Components/ChatButtonComponent";
import MenuComponent from "../../Components/MenuComponent";

const { width } = Dimensions.get('window');

// Define un prefijo para la clave del carrito, al cual se le añadirá el ID del usuario
const ASYNC_STORAGE_CART_PREFIX = 'cartItems_';

export default function CarritoScreen() {
  const navigation = useNavigation();

  const [showMenu, setShowMenu] = useState(false);
  const [activeDeleteProductId, setActiveDeleteProductId] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isCartLoaded, setIsCartLoaded] = useState(false); // Estado para saber si el carrito ya se cargó

  const toggleMenu = () => setShowMenu(!showMenu);

  // Función para cargar el carrito desde AsyncStorage, ahora específica por usuario
  const loadCart = useCallback(async () => {
    try {
      const userId = await AsyncStorage.getItem("userId"); // Obtiene el ID del usuario logueado

      if (!userId) {
        // Si no hay ID de usuario, significa que no hay sesión activa
        setCartItems([]); // Asegura que el carrito esté vacío
        setIsCartLoaded(true);
        // Opcional: Podrías redirigir al login si el carrito es una pantalla que siempre requiere autenticación
        // Alert.alert("No logueado", "Por favor, inicia sesión para ver tu carrito.");
        // navigation.navigate("Login");
        return;
      }

      // Construye la clave específica para el carrito de este usuario
      const userCartKey = ASYNC_STORAGE_CART_PREFIX + userId;
      const storedCart = await AsyncStorage.getItem(userCartKey);

      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      } else {
        setCartItems([]); // Si no hay carrito para este usuario, inicializa vacío
      }
      setIsCartLoaded(true); // Marca el carrito como cargado
    } catch (error) {
      console.error("Error al cargar el carrito:", error);
      setIsCartLoaded(true); // Marca como cargado incluso si hay error
    }
  }, []);

  // Carga el carrito cada vez que la pantalla obtiene el foco
  useFocusEffect(
    useCallback(() => {
      loadCart();
      return () => {
        // Limpieza opcional al perder el foco
      };
    }, [loadCart])
  );

  // Guarda el carrito en AsyncStorage cada vez que 'cartItems' cambia
  useEffect(() => {
    if (isCartLoaded) { // Solo guarda si el carrito ya se cargó inicialmente
      const saveCart = async () => {
        try {
          const userId = await AsyncStorage.getItem("userId"); // Obtiene el ID del usuario logueado
          if (userId) {
            // Si hay un usuario logueado, guarda el carrito con su clave específica
            const userCartKey = ASYNC_STORAGE_CART_PREFIX + userId;
            await AsyncStorage.setItem(userCartKey, JSON.stringify(cartItems));
          } else {
            // Si no hay usuario logueado, podrías limpiar cualquier carrito genérico antiguo
            // Esto es importante para evitar que carritos de sesiones anteriores persistan sin usuario
            await AsyncStorage.removeItem('cartItems'); // Elimina la clave genérica antigua si existiera
          }
        } catch (error) {
          console.error("Error al guardar el carrito:", error);
        }
      };
      saveCart();
    }
  }, [cartItems, isCartLoaded]);

  // --- Funciones de gestión de ítems del carrito ---

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
            setActiveDeleteProductId(null); // Oculta el icono de eliminar
            Alert.alert("Eliminado", "Producto eliminado del carrito.");
          },
          style: "destructive"
        }
      ]
    );
  };

  const handleIncrement = (itemId) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId && item.quantity < (item.maxStock || 999)
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const handleDecrement = (itemId) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const handleQuantityChange = (itemId, text) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    let parsed = parseInt(cleaned || '0', 10);
    if (isNaN(parsed) || parsed < 1) parsed = 1;

    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item.id === itemId) {
          const max = item.maxStock || 999;
          const newQty = Math.min(parsed, max);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => {
      const qty = parseInt(item.quantity, 10);
      if (isNaN(qty) || qty < 1) return sum;
      return sum + (item.price * qty);
    }, 0);
  };

  const handleViewOrder = () => {
    if (cartItems.length === 0) {
      Alert.alert("Carrito Vacío", "No puedes ver una orden sin productos en el carrito.");
      return;
    }

    navigation.navigate("Orden", { // Corregido para usar "OrdenScreen" según tu AppNavegacion.js
      cartItems: cartItems.map(item => ({
        nombre: item.name,
        cantidad: parseInt(item.quantity, 10) || 1,
        precio: item.price,
        imagen: item.imageUri ?? null,
      })),
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

          {!isCartLoaded ? (
            <Text style={{ padding: 20, textAlign: 'center', color: '#777' }}>
              Cargando carrito...
            </Text>
          ) : cartItems.length === 0 ? (
            <Text style={{ padding: 20, textAlign: 'center', color: '#777' }}>
              Tu carrito está vacío.
            </Text>
          ) : (
            cartItems.map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.tableRow}
                onPress={() => setActiveDeleteProductId(item.id === activeDeleteProductId ? null : item.id)}
              >
                <View style={[styles.rowProductInfoCol, styles.productInfoCell]}>
                  <View style={styles.thumbnailWrapper}>
                    <Image
                      source={
                        item.imageUri
                          ? { uri: item.imageUri }
                          : require("../../Src/AssetsProductos/Images/no-image.png")
                      }
                      style={styles.productThumbnail}
                      resizeMode="cover"
                      onError={(e) => console.log("Error al cargar imagen:", e.nativeEvent.error)}
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
                <Text style={[styles.rowText, styles.rowPriceCol]}>
                  ${item.price.toLocaleString('es-CO')}
                </Text>
                <View style={[styles.quantityInputWrapper, styles.rowQuantityCol]}>
                  <TouchableOpacity onPress={() => handleDecrement(item.id)} style={styles.quantityArrowButton}>
                    <Ionicons name="chevron-down-outline" size={16} color="#6A0DAD" />
                  </TouchableOpacity>
                  <TextInput
                    style={styles.quantityInput}
                    keyboardType="numeric"
                    maxLength={3}
                    value={String(item.quantity)}
                    onChangeText={text => handleQuantityChange(item.id, text)}
                    onBlur={() => {
                      const qty = parseInt(item.quantity, 10);
                      if (isNaN(qty) || qty < 1) {
                        handleQuantityChange(item.id, '1');
                      } else if (qty > (item.maxStock || 999)) {
                        handleQuantityChange(item.id, String(item.maxStock || 999));
                      }
                    }}
                  />
                  <TouchableOpacity onPress={() => handleIncrement(item.id)} style={styles.quantityArrowButton}>
                    <Ionicons name="chevron-up-outline" size={16} color="#6A0DAD" />
                  </TouchableOpacity>
                </View>
                <Text style={[styles.rowText, styles.rowTotalCol]}>
                  ${((item.price) * (parseInt(item.quantity, 10) || 1)).toLocaleString('es-CO')}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={styles.summaryContainer}>
          <Text style={styles.subtotalTitle}>SUBTOTAL</Text>
          <Text style={styles.subtotalValue}>${calculateSubtotal().toLocaleString('es-CO')}</Text>
          <TouchableOpacity
            style={[
              styles.viewOrderButton,
              cartItems.length === 0 && { backgroundColor: '#aaa' }
            ]}
            onPress={handleViewOrder}
            disabled={cartItems.length === 0}
          >
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
    paddingTop: 60,
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 100,
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
    width: width * 0.95,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: 20,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#E0E0E0',
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
    alignItems: 'center',
  },
  rowText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
  headerProductInfoCol: { width: '30%' },
  headerPriceCol: { width: '18%' },
  headerQuantityCol: { width: '27%' },
  headerTotalCol: { width: '25%' },
  rowProductInfoCol: {
    width: '30%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  thumbnailWrapper: {
    position: 'relative',
    width: 60,
    height: 60,
    marginBottom: 5,
  },
  productThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  productNameInRow: {
    fontSize: 12,
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  rowPriceCol: { width: '18%' },
  rowQuantityCol: {
    width: '27%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowTotalCol: {
    width: '25%',
    textAlign: 'center',
  },
  quantityInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#CCC',
    borderRadius: 5,
    width: '90%',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  quantityInput: {
    textAlign: 'center',
    fontSize: 14,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 5,
    width: 40,
  },
  quantityArrowButton: {
    padding: 5,
  },
  deleteIconContainer: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 15,
    padding: 2,
    zIndex: 1,
  },
  summaryContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    width: width * 0.95,
    padding: 20,
    alignItems: 'flex-end',
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
    marginBottom: 15,
  },
  viewOrderButton: {
    backgroundColor: '#6A0DAD',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  viewOrderButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
