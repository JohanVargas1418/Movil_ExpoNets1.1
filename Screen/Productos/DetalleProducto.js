import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HeaderComponent from "../../Components/HeaderComponent";
import MenuComponent from "../../Components/MenuComponent";
import ChatButtonComponent from "../../Components/ChatButtonComponent";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

// Define las claves de AsyncStorage de forma consistente
const ASYNC_STORAGE_CART_PREFIX = 'cartItems_'; // Prefijo para el carrito de cada usuario
const ASYNC_STORAGE_USER_TOKEN_KEY = "userToken"; // Clave para el token de usuario
const ASYNC_STORAGE_USER_ID_KEY = "userId"; // Clave para el ID de usuario

export default function DetalleProducto() {
  const navigation = useNavigation();
  const route = useRoute();
  const { product } = route.params;

  const maxStock = Number(product.cantidad) > 0 ? Number(product.cantidad) : 999;
  const [quantity, setQuantity] = useState("1");
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => setShowMenu(!showMenu);

  const imageUrl = product.imagenes?.[0]?.nombreArchivo
    ? `http://172.30.6.28:8000/storage/imagenes/${product.imagenes[0].nombreArchivo}`
    : null;

  const handleIncreaseQuantity = () => {
    setQuantity((prev) => {
      const current = parseInt(prev, 10);
      const next = current + 1;
      return next <= maxStock ? String(next) : String(current);
    });
  };

  const handleDecreaseQuantity = () => {
    setQuantity((prev) => {
      const current = parseInt(prev, 10);
      return String(Math.max(1, current - 1));
    });
  };

  const handleAddToCart = async () => {
    // --- LÓGICA DE VERIFICACIÓN DE AUTENTICACIÓN Y OBTENCIÓN DE USERID ---
    const userToken = await AsyncStorage.getItem(ASYNC_STORAGE_USER_TOKEN_KEY);
    const userId = await AsyncStorage.getItem(ASYNC_STORAGE_USER_ID_KEY); // Obtener el ID del usuario

    if (!userToken || !userId) { // Verifica tanto el token como el userId
      Alert.alert(
        "Requiere Inicio de Sesión",
        "Para añadir productos al carrito, debes iniciar sesión.",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Iniciar Sesión", onPress: () => navigation.navigate("Login") }
        ]
      );
      return;
    }
    // --- FIN LÓGICA DE VERIFICACIÓN ---

    const parsedPrice = parseFloat(
      product.precio?.toString().replace(".", "").replace(",", ".")
    );
    const itemQuantity = parseInt(quantity, 10);

    if (isNaN(itemQuantity) || itemQuantity <= 0) {
      Alert.alert("Cantidad inválida", "Ingresa una cantidad válida para añadir al carrito.");
      return;
    }
    if (itemQuantity > maxStock) {
      Alert.alert("Cantidad excedida", `Solo hay ${maxStock} unidades disponibles de este producto.`);
      setQuantity(String(maxStock));
      return;
    }

    const newItem = {
      id: product.id,
      name: product.nombre,
      price: parsedPrice,
      quantity: itemQuantity,
      maxStock: maxStock,
      imageUri: imageUrl,
    };

    try {
      // Construye la clave específica para el carrito de este usuario
      const userCartKey = ASYNC_STORAGE_CART_PREFIX + userId;
      
      const existing = await AsyncStorage.getItem(userCartKey); // Usa la clave específica del usuario
      let cart = existing ? JSON.parse(existing) : [];

      const existingIndex = cart.findIndex(i => i.id === newItem.id);

      if (existingIndex >= 0) {
        const currentCartQty = cart[existingIndex].quantity;
        const newTotalQty = currentCartQty + newItem.quantity;
        cart[existingIndex].quantity = Math.min(newTotalQty, maxStock);
      } else {
        cart.push(newItem);
      }

      await AsyncStorage.setItem(userCartKey, JSON.stringify(cart)); // Usa la clave específica del usuario para guardar
      navigation.navigate("Carrito");
    } catch (error) {
      console.error("Error al añadir al carrito:", error);
      Alert.alert("Error", "No se pudo añadir al carrito. Intenta de nuevo.");
    }
  };

  return (
    <View style={styles.container}>
      <HeaderComponent toggleMenu={toggleMenu} />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.sectionTitle}>Información del producto</Text>

        <View style={styles.imageContainer}>
          <Image
            source={
              imageUrl
                ? { uri: imageUrl }
                : require("../../Src/AssetsProductos/Images/no-image.png")
            }
            style={styles.productImage}
            resizeMode="contain"
            onError={(e) => console.log("Error al cargar imagen del producto:", e.nativeEvent.error)}
          />
        </View>

        <View style={styles.detailsCard}>
          <Text style={styles.productName}>{product.nombre}</Text>
          <Text style={styles.productPrice}>
            Precio: ${Number(product.precio).toLocaleString("es-CO")}
          </Text>
          <Text style={styles.productSellerLocation}>
            Cantidad Disponible: {maxStock.toLocaleString("es-CO")}
          </Text>
          <Text style={styles.productSellerLocation}>
            Vendedor: {product.usuario?.nombre || "No disponible"} desde {product.usuario?.direccion || "No disponible"}
          </Text>

          <View style={styles.quantityContainer}>
            <Text style={styles.quantityLabel}>Cantidad a añadir:</Text>
            <TouchableOpacity onPress={handleDecreaseQuantity} style={styles.quantityButton}>
              <Ionicons name="remove-outline" size={24} color="#6A0DAD" />
            </TouchableOpacity>
            <TextInput
              style={styles.quantityInput}
              keyboardType="numeric"
              value={quantity}
              onChangeText={(text) => {
                const cleaned = text.replace(/[^0-9]/g, '');
                let parsed = parseInt(cleaned || '0', 10);
                if (isNaN(parsed) || parsed < 1) parsed = 1;

                setQuantity(String(Math.min(parsed, maxStock)));
              }}
              onBlur={() => {
                const parsed = parseInt(quantity, 10);
                if (isNaN(parsed) || parsed < 1) {
                  setQuantity('1');
                } else if (parsed > maxStock) {
                  setQuantity(String(maxStock));
                }
              }}
              maxLength={3}
              textAlign="center"
            />
            <TouchableOpacity onPress={handleIncreaseQuantity} style={styles.quantityButton}>
              <Ionicons name="add-outline" size={24} color="#6A0DAD" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
            <Text style={styles.addToCartButtonText}>Añadir al carrito</Text>
          </TouchableOpacity>

          <Text style={styles.descriptionTitle}>Descripción</Text>
          <Text style={styles.descriptionText}>{product.descripcion}</Text>
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
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingTop: 80,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  imageContainer: {
    width: "90%",
    aspectRatio: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    overflow: "hidden",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  detailsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    width: "90%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  productPrice: {
    fontSize: 20,
    fontWeight: "600",
    color: "#6A0DAD",
    marginBottom: 10,
  },
  productSellerLocation: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    backgroundColor: "#F8F8F8",
    borderRadius: 10,
    paddingVertical: 10,
  },
  quantityLabel: {
    fontSize: 16,
    color: "#333",
    marginRight: 10,
    fontWeight: "600",
  },
  quantityButton: {
    padding: 8,
    borderRadius: 5,
    backgroundColor: "#EFE0FF",
  },
  quantityInput: {
    width: 60,
    height: 40,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 8,
    marginHorizontal: 10,
    fontSize: 18,
    color: "#333",
    textAlign: "center",
    backgroundColor: "#FFF",
  },
  addToCartButton: {
    backgroundColor: "#6A0DAD",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  addToCartButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 30,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    paddingBottom: 5,
  },
  descriptionText: {
    fontSize: 16,
    color: "#555",
    lineHeight: 24,
  },
});

const { width } = Dimensions.get("window");
