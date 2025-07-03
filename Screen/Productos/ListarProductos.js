import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  NativeSyntheticEvent, // Importar para tipado de eventos de scroll
  NativeScrollEvent,     // Importar para tipado de eventos de scroll
} from "react-native";
import HeaderComponent from "../../Components/HeaderComponent";
import ChatButtonComponent from "../../Components/ChatButtonComponent";
import MenuComponent from "../../Components/MenuComponent";
import { Ionicons } from '@expo/vector-icons';
import FooterComponent from "../../Components/FooterComponent"; // Importar FooterComponent
import { useNavigation } from "@react-navigation/native"; // Importar useNavigation para navegación


const { width } = Dimensions.get('window');

export default function ListarProductos() {
    const navigation = useNavigation(); // Obtener la instancia de navegación
  const [showMenu, setShowMenu] = useState(false);
  const categoriesScrollViewRef = useRef(null);
  const currentScrollX = useRef(0); // Referencia para almacenar la posición actual del scroll

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  // Función para manejar el evento de scroll y actualizar la posición actual
  const handleScroll = (event) => {
    currentScrollX.current = event.nativeEvent.contentOffset.x;
  };

  // Función para desplazar el ScrollView de categorías hacia la izquierda
  const scrollLeft = () => {
    if (categoriesScrollViewRef.current) {
      const newX = currentScrollX.current - (width * 0.3); // Calcula la nueva posición
      categoriesScrollViewRef.current.scrollTo({ x: Math.max(0, newX), animated: true }); // Asegura que no sea menor que 0
    }
  };

  // Función para desplazar el ScrollView de categorías hacia la derecha
  const scrollRight = () => {
    if (categoriesScrollViewRef.current) {
      const newX = currentScrollX.current + (width * 0.3); // Calcula la nueva posición
      categoriesScrollViewRef.current.scrollTo({ x: newX, animated: true });
    }
  };

  // Datos de ejemplo para las categorías
  const categories = [
    "Ropa",
    "Accesorios",
    "Despensa",
    "Electrónica",
    "Juguetes",
    "Libros",
    "Deportes",
  ];

  // Datos de ejemplo para los productos
  const products = [
    // Ejemplo con imágenes locales. Asegúrate de que estas rutas existan en tu proyecto.
    // Por ejemplo, si tienes una imagen 'cerveza.jpg' en Src/assets/images/
    { id: '1', name: 'Cerveza Eisenbahn', image: require('../../Src/AssetsProductos/Images/cerveza.jpg') },
    { id: '2', name: 'Yogurt Artesanal', image: require('../../Src/AssetsProductos/Images/yogurtArandanos.jpeg') },
    { id: '3', name: 'Miel de Abeja Pura', image: require('../../Src/AssetsProductos/Images/miel.jpg') },

    // Si no tienes las imágenes locales, puedes usar placeholders temporales:
    // { id: '1', name: 'Cerveza Eisenbahn', image: 'https://placehold.co/300x200/F5F8FA/000000?text=Cerveza' },
    // { id: '2', name: 'Yogurt Artesanal', image: 'https://placehold.co/300x200/F5F8FA/000000?text=Yogurt' },
    // { id: '3', name: 'Miel de Abeja Pura', image: 'https://placehold.co/300x200/F5F8FA/000000?text=Miel' },
    // { id: '4', name: 'Pan Artesanal', image: 'https://placehold.co/300x200/F5F8FA/000000?text=Pan' },
    // { id: '5', name: 'Café Orgánico', image: 'https://placehold.co/300x200/F5F8FA/000000?text=Cafe' },
    // { id: '6', name: 'Jabón Artesanal', image: 'https://placehold.co/300x200/F5F8FA/000000?text=Jabon' },
  ];

  return (
    <View style={styles.container}>
      {/* Header Component */}
      <HeaderComponent toggleMenu={toggleMenu} />

       {/* Título de la sección para Productos */}
       <View style={styles.titleContainer}>
          <Text style={styles.sectionTitle}>Productos</Text> {/* Texto cambiado a "Productos" */}
        </View>
        
      {/* Categorías */}
      <View style={styles.categoriesSection}>
        {/* Nuevo View para envolver el contenido y aplicar padding horizontal */}
        <View style={styles.categoriesContentWrapper}>
          <TouchableOpacity style={styles.arrowButton} onPress={scrollLeft}>
            <Ionicons name="chevron-back-outline" size={24} color="#6A0DAD" />
          </TouchableOpacity>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScrollView}
            ref={categoriesScrollViewRef}
            onScroll={handleScroll} // Añadir el manejador de scroll
            scrollEventThrottle={16} // Ajustar para una actualización más frecuente del scroll
          >
            {categories.map((category, index) => (
              <TouchableOpacity key={index} style={styles.categoryButton}>
                <Text style={styles.categoryText}>{category}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.arrowButton} onPress={scrollRight}>
            <Ionicons name="chevron-forward-outline" size={24} color="#6A0DAD" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Lista de Productos */}
      <ScrollView contentContainerStyle={styles.productsScrollView} style={styles.productsContainer}>
        {products.map(product => (
          <TouchableOpacity key={product.id} style={styles.productCard} onPress={() =>  navigation.navigate('DetalleProducto', { product })}>
            <Image
              source={product.image} // La fuente ahora es el require()
              style={styles.productImage}
              onError={(e) => console.log('Error loading image:', e.nativeEvent.error)}
              defaultSource={require('../../Src/AssetsProductos/Images/no-image.png')} // Fallback image local
            />
            <Text style={styles.productName}>{product.name}</Text>
          </TouchableOpacity>
        ))}
        {/* FooterComponent se coloca aquí si es parte del ScrollView principal */}
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
    width: '100%', // Asegura que ocupe todo el ancho
    backgroundColor: '#6A0DAD', // Color de fondo del título
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 0, // Asegura que no haya margen horizontal
    paddingHorizontal: 0, // Asegura que no haya padding horizontal
    margin: 40, // Añade margen para separar del borde de la pantalla
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF', // Color del texto del título
  },
  categoriesSection: {
    // Eliminado paddingHorizontal de aquí para que el fondo se extienda
    flexDirection: 'row', // Se mantiene para el layout interno del wrapper
    alignItems: 'center', // Se mantiene para el layout interno del wrapper
    justifyContent: 'center', // Centra el categoriesContentWrapper
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    width: '100%', // Asegura que ocupe todo el ancho
  },
  categoriesContentWrapper: { // NUEVO ESTILO para el contenido interno de categoriesSection
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%', // Este wrapper ocupa el 100% del categoriesSection
    paddingHorizontal: 5, // Aplica el padding horizontal aquí
  },
  arrowButton: {
    padding: 10,
  },
  categoriesScrollView: {
    alignItems: 'center',
    paddingHorizontal: 5, // Se mantiene para el padding interno del scroll
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 5,
  },
  categoryText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  productsContainer: {
    flex: 1,
    paddingHorizontal: 10, // Se mantiene el padding horizontal para los productos
    paddingTop: 10,
  },
  productsScrollView: {
    alignItems: 'center',
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    width: width * 0.9, // Ocupa el 90% del ancho de la pantalla
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    overflow: 'hidden', // Asegura que la imagen no se salga de los bordes redondeados
  },
  productImage: {
    width: '100%',
    height: 200, // Altura fija para las imágenes
    resizeMode: 'cover',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    padding: 15,
    textAlign: 'center',
  },
});
