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
import MenuComponent from "../../Components/MenuComponent";
import ChatButtonComponent from "../../Components/ChatButtonComponent";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from "@react-navigation/native";

const { width } = Dimensions.get('window');

export default function DetalleProducto() {
  const navigation = useNavigation();
  const route = useRoute();
  const { product } = route.params;
  const maxStock = Number(product.cantidad) || 1;


  const [quantity, setQuantity] = useState("1");
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const imageUrl = product.imagenes?.[0]?.nombreArchivo
    ? `http://172.30.6.28:8000/storage/imagenes/${product.imagenes[0].nombreArchivo}`
    : null;

  const handleIncreaseQuantity = () => {
    setQuantity(prev => {
      const current = parseInt(prev, 10);
      const next = current + 1;
      return next <= maxStock ? String(next) : String(current); // No pasar del stock
    });
  };

  const handleDecreaseQuantity = () => {
    setQuantity(prev => {
      const current = parseInt(prev, 10);
      return String(Math.max(1, current - 1)); // No bajar de 1
    });
  };

  const handleAddToCart = () => {
    const parsedPrice = Number(
      product.precio?.toString().replace(".", "").replace(",", ".")
    );
    const itemQuantity = parseInt(quantity, 10);

    if (isNaN(itemQuantity) || itemQuantity <= 0) {
      Alert.alert("Cantidad inválida", "Ingresa una cantidad válida.");
      return;
    }

    // Aquí podrías guardar el producto en un estado global o contexto si fuera necesario

    navigation.navigate("CarritoScreen", {
      addedProduct: {
        id: product.id,
        name: product.nombre,
        price: parsedPrice,
        quantity: itemQuantity,
        source: imageUrl
          ? { uri: imageUrl }
          : require("../../Src/AssetsProductos/Images/no-image.png")
      }
    });


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
            resizeMode="cover"
            onError={(e) =>
              console.log("Error al cargar imagen:", e.nativeEvent.error)
            }
          />
        </View>

        <View style={styles.detailsCard}>
          <Text style={styles.productName}>{product.nombre}</Text>

          <Text style={styles.productPrice}>
            Precio: ${Number(product.precio).toLocaleString("es-CO")}
          </Text>
          <Text style={styles.productSellerLocation}>
            Cantidad: {Number(product.cantidad).toLocaleString("es-CO")}
          </Text>

          <Text style={styles.productSellerLocation}>
            Vendedor: {product.usuario?.nombre || "No disponible"} desde {product.usuario?.direccion || "No disponible"}
          </Text>


          <View style={styles.quantityContainer}>
            <Text style={styles.quantityLabel}>Cantidad:</Text>
            <TouchableOpacity onPress={handleDecreaseQuantity} style={styles.quantityButton}>
              <Ionicons name="remove-outline" size={24} color="#6A0DAD" />
            </TouchableOpacity>
            <TextInput
              style={styles.quantityInput}
              keyboardType="numeric"
              value={quantity}
              onChangeText={(text) => {
                const cleaned = text.replace(/[^0-9]/g, '');
                const parsed = Math.max(1, parseInt(cleaned || '1', 10));
                setQuantity(String(Math.min(parsed, maxStock))); // Límite superior
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
    paddingTop: 60,
    margin: 'auto',
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    width: '90%',
    alignSelf: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  imageContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    width: width * 0.9,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: 20,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 15,
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    width: width * 0.9,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  productPrice: {
    fontSize: 20,
    color: '#6A0DAD',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  productSellerLocation: {
    fontSize: 14,
    color: '#777',
    marginBottom: 15,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    width: '100%',
  },
  quantityLabel: {
    fontSize: 18,
    color: '#555',
    marginRight: 10,
    fontWeight: '600',
  },
  quantityButton: {
    padding: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 8,
    fontSize: 16,
    color: '#333',
    width: 60,
    textAlign: 'center',
  },
  addToCartButton: {
    backgroundColor: '#6A0DAD',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  addToCartButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  descriptionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
});
