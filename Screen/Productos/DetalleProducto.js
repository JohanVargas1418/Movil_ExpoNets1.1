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
import MenuComponent from "../../Components/MenuComponent";
import ChatButtonComponent from "../../Components/ChatButtonComponent";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from "@react-navigation/native";

const { width } = Dimensions.get('window');

export default function DetalleProducto() {
  const navigation = useNavigation();
  const route = useRoute();
  const [quantity, setQuantity] = useState('1'); // Estado para la cantidad del producto
  const [showMenu, setShowMenu] = useState(false);

  // Obtener el producto de los parámetros de navegación
  const product = route.params?.product || {
    id: 'default',
    name: 'Producto No Encontrado',
    price: 0,
    image: require('../../Src/AssetsProductos/Images/no-image.png'),
    description: 'Este producto no está disponible o no se ha cargado correctamente.',
    seller: 'N/A',
    location: 'N/A',
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  // Función para aumentar la cantidad
  const handleIncreaseQuantity = () => {
    setQuantity(prevQuantity => String(parseInt(prevQuantity, 10) + 1));
  };

  // Función para disminuir la cantidad
  const handleDecreaseQuantity = () => {
    setQuantity(prevQuantity => {
      const currentQty = parseInt(prevQuantity, 10);
      return String(Math.max(1, currentQty - 1)); // Asegura que no sea menor que 1
    });
  };

  const handleAddToCart = () => {
    // Asegurarse de que el precio sea un número para el cálculo
    const parsedPrice = parseFloat(product.price.replace('.', '').replace(',', '.'));
    const itemQuantity = parseInt(quantity, 10);

    if (isNaN(itemQuantity) || itemQuantity <= 0) {
      Alert.alert("Cantidad Inválida", "Por favor, ingresa una cantidad válida (número mayor que 0).");
      return;
    }

    Alert.alert("Añadir al Carrito", `Has añadido ${itemQuantity} unidades de "${product.name}" al carrito. Total: $${(parsedPrice * itemQuantity).toLocaleString('es-CO')}`);
    // Aquí iría la lógica para añadir el producto al carrito global o a un contexto/estado persistente
  };

  return (
    <View style={styles.container}>
      {/* Header Component */}
      <HeaderComponent toggleMenu={toggleMenu} />

      <ScrollView contentContainerStyle={styles.scrollViewContent}>

        {/* Título de la sección */}
        <Text style={styles.sectionTitle}>Información del producto</Text>

        {/* Imagen del Producto */}
        <View style={styles.imageContainer}>
          <Image
            source={product.image}
            style={styles.productImage}
            onError={(e) => console.log('Error loading image:', e.nativeEvent.error)}
            defaultSource={require('../../Src/AssetsProductos/Images/no-image.png')}
          />
        </View>

        {/* Detalles del Producto */}
        <View style={styles.detailsCard}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>Precio: ${parseFloat(product.price.replace('.', '').replace(',', '.')).toLocaleString('es-CO')}</Text>
          {product.seller && product.location && (
            <Text style={styles.productSellerLocation}>Vendedor: {product.seller} desde {product.location}</Text>
          )}

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
                // Limpia el texto para asegurar que solo haya números
                const cleanedText = text.replace(/[^0-9]/g, '');
                // Si el texto está vacío, establece la cantidad en '1' para evitar NaN o 0
                // De lo contrario, convierte a número, asegura que sea al menos 1, y luego a string
                setQuantity(String(Math.max(1, parseInt(cleanedText || '1', 10))));
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
          <Text style={styles.descriptionText}>{product.description}</Text>
        </View>

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
    paddingTop: 60,
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
    justifyContent: 'center', // Centra los controles de cantidad
    marginBottom: 20,
    width: '100%', // Asegura que ocupe todo el ancho de la tarjeta
  },
  quantityLabel: {
    fontSize: 18,
    color: '#555',
    marginRight: 10,
    fontWeight: '600',
  },
  quantityButton: { // Nuevo estilo para los botones de cantidad
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
    width: 60, // Ancho ajustado para el input de cantidad
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