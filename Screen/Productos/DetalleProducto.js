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
import HeaderComponent from "../../Components/HeaderComponent"; // Importar el HeaderComponent
import ChatButtonComponent from "../../Components/ChatButtonComponent"; // Importar el ChatButtonComponent
import { Ionicons } from '@expo/vector-icons'; // Importar Ionicons si se usan en esta pantalla
import FooterComponent from "../../Components/FooterComponent"; // Importar el FooterComponent

const { width } = Dimensions.get('window'); // Obtener el ancho de la pantalla

export default function DetalleProducto() {
  const [quantity, setQuantity] = useState('1'); // Estado para la cantidad del producto

  // Datos de ejemplo para el producto (pueden venir de navegación o una API)
  const product = {
    id: '1',
    name: 'Cerveza Eisenbahn',
    price: 18000.0,
    image: require('../../Src/AssetsProductos/Images/cerveza.jpg'), // Usar imagen local
    description: 'Cerveza artesanal Eisenbahn, elaborada con los mejores ingredientes y un sabor inigualable. Perfecta para cualquier ocasión. Disfruta de la calidad y tradición en cada sorbo. Contenido neto: 355ml.',
  };

  const handleAddToCart = () => {
    Alert.alert("Añadir al Carrito", `Has añadido ${quantity} unidades de "${product.name}" al carrito.`);
    // Aquí iría la lógica para añadir el producto al carrito
  };

  return (
    <View style={styles.container}>
      {/* Header Component - No necesita toggleMenu si no tiene menú */}
      <HeaderComponent />

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Breadcrumb / Ruta de navegación */}
        <View style={styles.breadcrumb}>
          <Text style={styles.breadcrumbText}>Home / Producto</Text>
        </View>

        {/* Título de la sección */}
        <Text style={styles.sectionTitle}>Información del producto</Text>

        {/* Imagen del Producto */}
        <View style={styles.imageContainer}>
          <Image
            source={product.image}
            style={styles.productImage}
            onError={(e) => console.log('Error loading image:', e.nativeEvent.error)}
            defaultSource={require('../../Src/AssetsProductos/Images/no-image.png')} // Fallback image local
          />
        </View>

        {/* Detalles del Producto */}
        <View style={styles.detailsCard}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>Precio: ${product.price.toLocaleString('es-CO')}</Text>

          <View style={styles.quantityContainer}>
            <Text style={styles.quantityLabel}>Cantidad:</Text>
            <TextInput
              style={styles.quantityInput}
              keyboardType="numeric"
              value={quantity}
              onChangeText={(text) => setQuantity(text.replace(/[^0-9]/g, ''))} // Solo números
              maxLength={3} // Limitar a 3 dígitos
            />
          </View>

          <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
            <Text style={styles.addToCartButtonText}>Añadir al carrito</Text>
          </TouchableOpacity>

          <Text style={styles.descriptionTitle}>Descripción</Text>
          <Text style={styles.descriptionText}>{product.description}</Text>
        </View>
        <FooterComponent />
      </ScrollView>

      {/* Chat Button Component */}
      <ChatButtonComponent />
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
  breadcrumb: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
  breadcrumbText: {
    fontSize: 14,
    color: '#777',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    width: '90%',
    alignSelf: 'center',
    marginBottom: 20,
  },
  imageContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    width: width * 0.9, // Ocupa el 90% del ancho de la pantalla
    aspectRatio: 1, // Mantiene la relación de aspecto 1:1
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: 20,
    overflow: 'hidden', // Asegura que la imagen no se salga de los bordes redondeados
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain', // Asegura que la imagen se ajuste dentro del contenedor
    borderRadius: 15, // Para que la imagen también tenga bordes redondeados
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    width: width * 0.9, // Ocupa el 90% del ancho de la pantalla
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
    marginBottom: 15,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  quantityLabel: {
    fontSize: 18,
    color: '#555',
    marginRight: 10,
    fontWeight: '600',
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 8,
    fontSize: 16,
    color: '#333',
    width: 70, // Ancho fijo para el input de cantidad
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
