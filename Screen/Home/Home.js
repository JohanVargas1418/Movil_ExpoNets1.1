import React, { useState, useRef, useEffect } from "react";
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
  ImageBackground,
} from "react-native";
import HeaderComponent from "../../Components/HeaderComponent";
import ChatButtonComponent from "../../Components/ChatButtonComponent";
import MenuComponent from "../../Components/MenuComponent";
import FooterComponent from "../../Components/FooterComponent";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get('window');

// Define el ancho efectivo de una tarjeta para el carrusel (ancho de la tarjeta + margen horizontal)
const CARD_WIDTH_CAROUSEL = width * 0.8; // Cada tarjeta ocupará el 80% del ancho de la pantalla
const CARD_MARGIN_HORIZONTAL_CAROUSEL = 15; // Margen entre tarjetas
const SNAP_INTERVAL_CAROUSEL = CARD_WIDTH_CAROUSEL + (CARD_MARGIN_HORIZONTAL_CAROUSEL * 2); // Ancho de la tarjeta + sus márgenes

export default function HomeScreen() {
  const navigation = useNavigation();
  const [showMenu, setShowMenu] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [searchText, setSearchText] = useState(''); // Estado para el texto de búsqueda
  const popularProductsScrollViewRef = useRef(null);
  const [popularProductScrollIndex, setPopularProductScrollIndex] = useState(0);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  // Función para manejar la búsqueda: ahora navega a ListarProductos y limpia el campo
  const handleSearch = () => {
    if (searchText.trim() === '') {
      Alert.alert("Búsqueda Vacía", "Por favor, ingresa algo para buscar.");
      return;
    }
    // Navegar a la pantalla ListarProductos y pasar el texto de búsqueda como 'query'
    navigation.navigate('ListarProductos', { query: searchText });
    setSearchText(''); // Limpiar el campo de búsqueda después de navegar
  };

  // Función para manejar el clic en una categoría
  const handleCategoryPress = (categoryName) => {
    navigation.navigate('ListarProductos', { category: categoryName });
    setSearchText(''); // Limpiar el campo de búsqueda también al seleccionar una categoría
  };

  // Datos de ejemplo para productos populares
  const popularProducts = [
    { id: 'p1', name: 'Yogurt de Arándanos', price: '16.900', image: require('../../Src/AssetsProductos/Images/yogurtArandanos.jpeg') },
    { id: 'p2', name: 'Miel Pura de Abeja', price: '40.000', image: require('../../Src/AssetsProductos/Images/miel.jpg') },
    { id: 'p3', name: 'Cerveza Artesanal', price: '18.000', image: require('../../Src/AssetsProductos/Images/cerveza.jpg') },
    { id: 'p4', name: 'Pan Campesino', price: '8.500', image: require('../../Src/AssetsProductos/Images/miel.jpg') },
  ];

  // Datos de ejemplo para la nueva sección "Novedades"
  const newArrivals = [
    { id: 'n1', name: 'Jabon Artesanal Lavanda', price: '12.000', image: require('../../Src/AssetsProductos/Images/BatidoMango.jpeg') },
    { id: 'n2', name: 'Porta Retratos Madera', price: '25.000', image: require('../../Src/AssetsProductos/Images/miel.jpg') },
    { id: 'n3', name: 'Vela Aromática Vainilla', price: '15.000', image: require('../../Src/AssetsProductos/Images/yogurtArandanos.jpeg') },
    { id: 'n4', name: 'Taza de Cerámica Hecha a Mano', price: '30.000', image: require('../../Src/AssetsProductos/Images/cerveza.jpg') },
    { id: 'n5', name: 'Bufanda de Lana Tejida', price: '50.000', image: require('../../Src/AssetsProductos/Images/miel.jpg') },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPopularProductScrollIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % popularProducts.length;
        if (popularProductsScrollViewRef.current) {
          popularProductsScrollViewRef.current.scrollTo({ x: nextIndex * SNAP_INTERVAL_CAROUSEL, animated: true });
        }
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [popularProducts.length]);

  return (
    <View style={styles.container}>
      {/* Header Component */}
      <HeaderComponent toggleMenu={toggleMenu} />

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Barra de Búsqueda */}
        <View style={styles.searchBarContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar productos, tiendas..."
            placeholderTextColor="#888"
            value={searchText}
            onChangeText={setSearchText} // Actualiza el estado searchText con cada cambio
            onSubmitEditing={handleSearch} // Llama a handleSearch al presionar Enter/Submit
          />
          <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
            <Ionicons name="search-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Sección 1: Vitrina Digital (Hero Section) */}
        <ImageBackground
          source={require('../../Src/AssetsProductos/Images/home3.jpg')}
          style={styles.heroSection}
          resizeMode="cover"
        >
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>Descubre productos únicos</Text>
            <Text style={styles.heroSubtitle}>Compra y vende de forma fácil y segura.</Text>
            <TouchableOpacity style={styles.heroButton} onPress={() => navigation.navigate("ListarProductos")}>
              <Text style={styles.heroButtonText}>Explorar Productos</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>

        {/* Sección "Vender tus productos" - C2C */}
        <View style={styles.sellProductSection}>
          <Text style={styles.sellProductTitle}>¿Tienes algo que vender?</Text>
          <Text style={styles.sellProductSubtitle}>Publica tus productos y llega a miles de compradores.</Text>
          <TouchableOpacity style={styles.sellProductButton} onPress={() => navigation.navigate("Login")}>
            <Text style={styles.sellProductButtonText}>Vender tus productos <Ionicons name="add-circle-outline" size={18} color="#6A0DAD" /></Text>
          </TouchableOpacity>
        </View>

        {/* Sección 3: Categorías */}
        <Text style={styles.sectionHeading}>CATEGORÍAS</Text>
        <View style={styles.categoriesGrid}>
          <TouchableOpacity style={styles.categoryCard} onPress={() => handleCategoryPress("Delicias Artesanales")}>
            <Ionicons name="cafe-outline" size={30} color="#6A0DAD" />
            <Text style={styles.categoryCardText}>Delicias Artesanales</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryCard} onPress={() => handleCategoryPress("Hogar y Decoración")}>
            <Ionicons name="home-outline" size={30} color="#6A0DAD" />
            <Text style={styles.categoryCardText}>Hogar y Decoración</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryCard} onPress={() => handleCategoryPress("Juguetería")}>
            <Ionicons name="game-controller-outline" size={30} color="#6A0DAD" />
            <Text style={styles.categoryCardText}>Juguetería</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryCard} onPress={() => handleCategoryPress("Mascotas")}>
            <Ionicons name="paw-outline" size={30} color="#6A0DAD" />
            <Text style={styles.categoryCardText}>Mascotas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryCard} onPress={() => handleCategoryPress("Ropa")}>
            <Ionicons name="shirt-outline" size={30} color="#6A0DAD" />
            <Text style={styles.categoryCardText}>Ropa</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryCard} onPress={() => handleCategoryPress("Accesorios")}>
            <Ionicons name="sparkles-outline" size={30} color="#6A0DAD" />
            <Text style={styles.categoryCardText}>Accesorios</Text>
          </TouchableOpacity>
        </View>

        {/* Sección "Novedades" (New Arrivals) - Nueva sección C2C */}
        <Text style={styles.sectionHeading}>NOVEDADES</Text>
        <View style={styles.newArrivalsGrid}>
          {newArrivals.map(product => (
            <TouchableOpacity
              key={product.id}
              style={styles.newArrivalCard}
              onPress={() => navigation.navigate('DetalleProducto', { product: { id: product.id, name: product.name, price: product.price, image: product.image, description: 'Descripción de ' + product.name } })}
            >
              <Image
                source={product.image}
                style={styles.newArrivalImage}
                onError={(e) => console.log('Error loading image:', e.nativeEvent.error)}
                defaultSource={require('../../Src/AssetsProductos/Images/no-image.png')}
              />
              <Text style={styles.newArrivalName}>{product.name}</Text>
              <Text style={styles.newArrivalPrice}>${product.price}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.viewAllButton} onPress={() => Alert.alert("Ver Todo", "Simulando ir a la pantalla de todas las novedades")}>
          <Text style={styles.viewAllButtonText}>Ver todas las Novedades <Ionicons name="arrow-forward-outline" size={16} color="#6A0DAD" /></Text>
        </TouchableOpacity>


        {/* Sección 4: Productos Populares - Carrusel */}
        <Text style={styles.sectionHeading}>PRODUCTOS POPULARES</Text>
        <View style={styles.popularProductsCarouselContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            ref={popularProductsScrollViewRef}
            contentContainerStyle={styles.popularProductsScrollViewContent}
            snapToInterval={SNAP_INTERVAL_CAROUSEL}
            decelerationRate="fast"
            onMomentumScrollEnd={(event) => {
              const contentOffsetX = event.nativeEvent.contentOffset.x;
              const newIndex = Math.round(contentOffsetX / SNAP_INTERVAL_CAROUSEL);
              setPopularProductScrollIndex(newIndex);
            }}
          >
            {popularProducts.map(product => (
              <TouchableOpacity
                key={product.id}
                style={styles.popularProductCardCarousel}
                onPress={() => navigation.navigate('DetalleProducto', { product: { id: product.id, name: product.name, price: product.price, image: product.image, description: 'Descripción de ' + product.name } })}
              >
                <Image
                  source={product.image}
                  style={styles.popularProductImageCarousel}
                  onError={(e) => console.log('Error loading image:', e.nativeEvent.error)}
                  defaultSource={require('../../Src/AssetsProductos/Images/no-image.png')}
                />
                {/* Contenedor para el nombre y el precio para mejor control de espaciado */}
                <View style={styles.popularProductTextContainer}>
                  <TouchableOpacity style={styles.popularProductLabelButton}>
                    <Text style={styles.popularProductLabelText}>{product.name}</Text>
                  </TouchableOpacity>
                  <Text style={styles.popularProductPriceCarousel}>${product.price}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
    paddingTop: 0, // Eliminado el padding superior aquí
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 100, // Espacio para el botón de chat flotante
    paddingTop: 60, // Añadido un padding superior para el contenido debajo del header fijo
  },
  // Barra de Búsqueda
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width * 0.9,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginTop:40,

    // Eliminado: margin:50, // Este margen ya no es necesario aquí
  },
  searchInput: {
    flex: 1,
    height: 45,
    fontSize: 16,
    color: '#333',
  },
  searchButton: {
    padding: 8,
    backgroundColor: '#6A0DAD',
    borderRadius: 8,
    marginLeft: 10,
  },

  // Sección 1: Vitrina Digital (Hero Section)
  heroSection: {
    width: width,
    height: height * 0.55, // Ajustado a 40% del alto de la pantalla
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  heroOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Fondo oscuro semitransparente
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '90%',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#E0E0E0',
    textAlign: 'center',
    marginBottom: 20,
  },
  heroButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  heroButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // Sección "Vender tus productos"
  sellProductSection: {
    backgroundColor: '#6A0DAD', // Color de fondo morado
    borderRadius: 15,
    width: width * 0.9,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  sellProductTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  sellProductSubtitle: {
    fontSize: 14,
    color: '#E0E0E0',
    textAlign: 'center',
    marginBottom: 20,
  },
  sellProductButton: {
    backgroundColor: '#FFFFFF', // Botón blanco
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sellProductButtonText: {
    color: '#6A0DAD', // Texto morado
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 5,
  },

  // Título de sección general
  sectionHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    marginTop: 10,
    alignSelf: 'flex-start', // Alinea a la izquierda
    marginLeft: width * 0.05, // Margen para que coincida con el contenido
  },

  // Sección 3: Categorías
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Permite que las tarjetas se envuelvan a la siguiente línea
    justifyContent: 'space-around', // Espacia las tarjetas uniformemente
    width: width * 0.95,
    marginBottom: 20,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.45, // Aproximadamente la mitad del ancho de la pantalla
    aspectRatio: 1.2, // Relación de aspecto para que sean rectangulares
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  categoryCardText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    textAlign: 'center',
  },

  // Sección "Novedades"
  newArrivalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: width * 0.95,
    marginBottom: 10, // Espacio antes del botón "Ver todas"
  },
  newArrivalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    width: width * 0.45, // Aproximadamente la mitad del ancho para 2 columnas
    marginBottom: 15,
    padding: 10,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  newArrivalImage: {
    width: '100%',
    height: 120, // Altura fija para la imagen
    borderRadius: 10,
    resizeMode: 'cover', // Ajustado a 'cover' para llenar el espacio
    marginBottom: 10,
  },
  newArrivalName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  newArrivalPrice: {
    fontSize: 14,
    color: '#6A0DAD',
    fontWeight: 'bold',
  },
  viewAllButton: {
    backgroundColor: 'transparent',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#6A0DAD',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  viewAllButtonText: {
    color: '#6A0DAD',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 5,
  },

  // Sección 4: Productos Populares - Carrusel
  popularProductsCarouselContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width,
    marginBottom: 20,
    height: 350,
    justifyContent: 'center',
  },
  popularProductsScrollViewContent: {
    paddingHorizontal: CARD_MARGIN_HORIZONTAL_CAROUSEL,
    alignItems: 'center',
  },
  popularProductCardCarousel: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    width: CARD_WIDTH_CAROUSEL,
    marginHorizontal: CARD_MARGIN_HORIZONTAL_CAROUSEL,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    alignItems: 'center',
    height: 320,
  },
  popularProductImageCarousel: {
    width: '90%',
    height: 230,
    borderRadius: 10,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  popularProductTextContainer: {
    width: '100%',
    alignItems: 'center',
  },
  popularProductLabelButton: {
    backgroundColor: '#6A0DAD',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 8,
  },
  popularProductLabelText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  popularProductPriceCarousel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },

  // Sección 5: Vendedores Destacados
  featuredCompaniesContainer: {
    width: width * 0.9,
    marginBottom: 20,
  },
  companyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  companyImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
    resizeMode: 'contain',
  },
  companyDetails: {
    flex: 1,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  companyDescription: {
    fontSize: 14,
    color: '#6A0DAD',
    marginBottom: 5,
  },
  companyLongDescription: {
    fontSize: 12,
    color: '#777',
    marginBottom: 10,
  },
  companySocialIcons: {
    flexDirection: 'row',
  },
  socialIcon: {
    marginRight: 10,
  },

  // Sección 6: Boletín de Noticias (Eliminada del JSX)
  newsletterSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    width: width * 0.95,
    padding: 20,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: 20,
  },
  newsletterTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  newsletterSubtitle: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  newsletterInputContainer: {
    flexDirection: 'row',
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  newsletterInput: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
    height: 50,
  },
  subscribeButton: {
    backgroundColor: '#6A0DAD',
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subscribeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});