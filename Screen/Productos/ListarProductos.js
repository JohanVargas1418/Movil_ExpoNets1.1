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
  NativeSyntheticEvent,
  NativeScrollEvent,
  TextInput,
} from "react-native";
import HeaderComponent from "../../Components/HeaderComponent";
import ChatButtonComponent from "../../Components/ChatButtonComponent";
import MenuComponent from "../../Components/MenuComponent";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get('window');

export default function ListarProductos() {
  const navigation = useNavigation();
  const [showMenu, setShowMenu] = useState(false);
  const categoriesScrollViewRef = useRef(null);
  const currentScrollX = useRef(0);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos'); // Nuevo estado para la categoría seleccionada

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleScroll = (event) => {
    currentScrollX.current = event.nativeEvent.contentOffset.x;
  };

  const scrollLeft = () => {
    if (categoriesScrollViewRef.current) {
      const newX = currentScrollX.current - (width * 0.3);
      categoriesScrollViewRef.current.scrollTo({ x: Math.max(0, newX), animated: true });
    }
  };

  const scrollRight = () => {
    if (categoriesScrollViewRef.current) {
      const newX = currentScrollX.current + (width * 0.3);
      categoriesScrollViewRef.current.scrollTo({ x: newX, animated: true });
    }
  };

  // La función handleSearch ahora solo actualiza el estado, el filtrado se hace en filteredProducts
  const handleSearch = () => {
    // No se necesita un Alert aquí, el filtrado es automático al cambiar searchText
    // Si quisieras un "botón de búsqueda" que dispare la búsqueda, podrías llamar a una función aquí
    // que fuerce la re-renderización o un filtro adicional, pero con onChangeText es más dinámico.
  };

  // Datos de ejemplo para las categorías
  const categories = [
    "Todos",
    "Delicias Artesanales",
    "Hogar y Decoración",
    "Juguetería",
    "Mascotas",
    "Ropa",
    "Accesorios",
  ];

  // Datos de ejemplo para los productos con descripciones detalladas y CATEGORÍA
  const products = [
    // Delicias Artesanales
    {
      id: '1',
      name: 'Cerveza Artesanal',
      price: '18.000',
      seller: 'El Cervecero',
      location: 'Bogotá',
      image: require('../../Src/AssetsProductos/Images/cerveza.jpg'),
      description: 'Cerveza artesanal de alta calidad, elaborada con maltas seleccionadas y lúpulos aromáticos. Un sabor robusto y un final suave que deleitará tu paladar. Perfecta para acompañar tus comidas favoritas o disfrutar en cualquier momento.',
      category: 'Delicias Artesanales',
    },
    {
      id: '2',
      name: 'Yogurt de Arándanos',
      price: '16.900',
      seller: 'Lácteos Frescos',
      location: 'Medellín',
      image: require('../../Src/AssetsProductos/Images/yogurtArandanos.jpeg'),
      description: 'Delicioso yogurt natural con trozos de arándanos frescos. Elaborado con leche 100% colombiana y sin conservantes. Ideal para un desayuno saludable o una merienda nutritiva.',
      category: 'Delicias Artesanales',
    },
    {
      id: '3',
      name: 'Miel Pura de Abeja',
      price: '40.000',
      seller: 'Apiario Dulce',
      location: 'Cali',
      image: require('../../Src/AssetsProductos/Images/miel.jpg'),
      description: 'Miel de abeja 100% pura, recolectada directamente de nuestros apiarios en el Valle del Cauca. Un endulzante natural con propiedades beneficiosas para la salud. Ideal para infusiones, postres o directamente del frasco.',
      category: 'Delicias Artesanales',
    },
    {
      id: '4',
      name: 'Pan Campesino',
      price: '8.500',
      seller: 'Panadería Tradición',
      location: 'Boyacá',
      image: require('../../Src/AssetsProductos/Images/cerveza.jpg'), // Imagen original
      description: 'Pan campesino horneado artesanalmente con masa madre. Crujiente por fuera y suave por dentro, con un sabor auténtico que te recordará el hogar. Perfecto para sándwiches o para acompañar tus comidas.',
      category: 'Delicias Artesanales',
    },

    // Hogar y Decoración
    {
      id: '5',
      name: 'Juego de Loza',
      price: '12.000',
      seller: 'Cerámica Artesanal',
      location: 'Cartagena',
      image: require('../../Src/AssetsProductos/Images/cerveza.jpg'),
      description: 'Juego de loza de cerámica pintado a mano, perfecto para darle un toque único y artístico a tu mesa. Incluye platos, tazas y cuencos con diseños exclusivos.',
      category: 'Hogar y Decoración',
    },
    {
      id: '6',
      name: 'Tetera de Barro',
      price: '25.000',
      seller: 'Alfarería Tradicional',
      location: 'Manizales',
      image: require('../../Src/AssetsProductos/Images/cerveza.jpg'),
      description: 'Tetera de barro cocido, ideal para preparar y servir tus infusiones favoritas. Mantiene el calor por más tiempo y añade un encanto rústico a tu cocina o sala de té.',
      category: 'Hogar y Decoración',
    },
    {
      id: '7',
      name: 'Vela Aromática Vainilla',
      price: '15.000',
      seller: 'Luz y Aroma',
      location: 'Pereira',
      image: require('../../Src/AssetsProductos/Images/cerveza.jpg'), // Imagen original
      description: 'Vela aromática con esencia de vainilla, perfecta para crear un ambiente cálido y acogedor. Fabricada con cera de soja natural y mecha de algodón para una combustión limpia y duradera.',
      category: 'Hogar y Decoración',
    },
    {
      id: '8',
      name: 'Manta Tejida a Mano',
      price: '80.000',
      seller: 'Tejidos del Alma',
      location: 'Bogotá',
      image: require('../../Src/AssetsProductos/Images/cerveza.jpg'), // Imagen original
      description: 'Manta suave y cálida tejida a mano con hilos de algodón orgánico. Ideal para decorar tu sofá o cama, añadiendo un toque artesanal y acogedor a tu hogar.',
      category: 'Hogar y Decoración',
    },

    // Juguetería
    {
      id: '9',
      name: 'Parques en Madera',
      price: '30.000',
      seller: 'Juguetes Felices',
      location: 'Pasto',
      image: require('../../Src/AssetsProductos/Images/cerveza.jpg'),
      description: 'Clásico juego de parques elaborado en madera, ideal para reuniones familiares y amigos. Incluye fichas y dados para horas de diversión garantizada.',
      category: 'Juguetería',
    },
    {
      id: '10',
      name: 'Elefante en Crochet',
      price: '65.000',
      seller: 'Bloques Creativos',
      location: 'Cali',
      image: require('../../Src/AssetsProductos/Images/cerveza.jpg'),
      description: 'Adorable elefante de juguete tejido a mano con la técnica de crochet. Suave, seguro y perfecto para bebés y niños pequeños como compañero de juegos y sueños.',
      category: 'Juguetería',
    },

    // Mascotas
    {
      id: '11',
      name: 'Correa para Perro',
      price: '20.000',
      seller: 'Mundo Mascota',
      location: 'Tunja',
      image: require('../../Src/AssetsProductos/Images/cerveza.jpg'), // Imagen original
      description: 'Correa resistente y cómoda para perros de tamaño mediano a grande. Fabricada con materiales duraderos y un diseño ergonómico para un mejor control durante los paseos.',
      category: 'Mascotas',
    },
    {
      id: '12',
      name: 'Juguete Interactivo Gato',
      price: '15.000',
      seller: 'Amigos Felinos',
      location: 'Medellín',
      image: require('../../Src/AssetsProductos/Images/cerveza.jpg'), // Imagen original
      description: 'Juguete interactivo con plumas y cascabel para estimular el instinto de caza de tu gato. Ayuda a mantener a tu mascota activa y entretenida por horas.',
      category: 'Mascotas',
    },

    // Ropa
    {
      id: '13',
      name: 'Camiseta Algodón Orgánico',
      price: '45.000',
      seller: 'Moda Sostenible',
      location: 'Cali',
      image: require('../../Src/AssetsProductos/Images/cerveza.jpg'), // Imagen original
      description: 'Camiseta de algodón 100% orgánico, suave al tacto y respetuosa con el medio ambiente. Diseño moderno y cómodo para el uso diario. Disponible en varias tallas y colores.',
      category: 'Ropa',
    },
    {
      id: '14',
      name: 'Suéter de Lana Tejido',
      price: '90.000',
      seller: 'Abrigos de Invierno',
      location: 'Bogotá',
      image: require('../../Src/AssetsProductos/Images/cerveza.jpg'), // Imagen original
      description: 'Suéter de lana tejido a mano, cálido y confortable para los días fríos. Diseño clásico y elegante, perfecto para combinar con cualquier atuendo invernal.',
      category: 'Ropa',
    },

    // Accesorios
    {
      id: '15',
      name: 'Anillo de Plata',
      price: '75.000',
      seller: 'Joyas Brillantes',
      location: 'Bogotá',
      image: require('../../Src/AssetsProductos/Images/cerveza.jpg'), // Imagen original
      description: 'Elegante anillo de plata 925 con un diseño minimalista. Perfecto para cualquier ocasión, añade un toque de sofisticación a tu estilo. Un regalo ideal para esa persona especial.',
      category: 'Accesorios',
    },
    {
      id: '16',
      name: 'Bolso de Cuero Artesanal',
      price: '120.000',
      seller: 'Marroquinería Fina',
      location: 'Medellín',
      image: require('../../Src/AssetsProductos/Images/cerveza.jpg'), // Imagen original
      description: 'Bolso de cuero genuino, hecho a mano con acabados de alta calidad. Diseño versátil y espacioso, ideal para el uso diario. Un accesorio duradero y con estilo.',
      category: 'Accesorios',
    },
  ];

  // Lógica para filtrar productos basada en la categoría seleccionada y el texto de búsqueda
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
    const lowerCaseSearchText = searchText.toLowerCase();
    const matchesSearch =
      product.name.toLowerCase().includes(lowerCaseSearchText) ||
      product.seller.toLowerCase().includes(lowerCaseSearchText) ||
      product.description.toLowerCase().includes(lowerCaseSearchText);
    return matchesCategory && matchesSearch;
  });

  return (
    <View style={styles.container}>
      {/* Header Component */}
      <HeaderComponent toggleMenu={toggleMenu} />

      <ScrollView contentContainerStyle={styles.mainScrollViewContent}>
        {/* Título de la sección para Productos */}
        <View style={styles.titleContainer}>
          <Text style={styles.sectionTitle}>Explorar Productos</Text>
        </View>

        {/* Barra de Búsqueda de Productos */}
        <View style={styles.searchBarContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar productos..."
            placeholderTextColor="#888"
            value={searchText}
            onChangeText={setSearchText} // Actualiza searchText en cada cambio
            onSubmitEditing={handleSearch} // Puedes mantener esto para una acción específica al presionar Enter
          />
          <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
            <Ionicons name="search-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Categorías */}
        <View style={styles.categoriesSection}>
          <View style={styles.categoriesContentWrapper}>
            <TouchableOpacity style={styles.arrowButton} onPress={scrollLeft}>
              <Ionicons name="chevron-back-outline" size={24} color="#6A0DAD" />
            </TouchableOpacity>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesScrollView}
              ref={categoriesScrollViewRef}
              onScroll={handleScroll}
              scrollEventThrottle={16}
            >
              {categories.map((category, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category && styles.selectedCategoryButton // Estilo para categoría seleccionada
                  ]}
                  onPress={() => setSelectedCategory(category)} // Actualiza la categoría seleccionada
                >
                  <Text style={[
                    styles.categoryText,
                    selectedCategory === category && styles.selectedCategoryText // Estilo para texto de categoría seleccionada
                  ]}>{category}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.arrowButton} onPress={scrollRight}>
              <Ionicons name="chevron-forward-outline" size={24} color="#6A0DAD" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Lista de Productos en Cuadrícula */}
        <View style={styles.productsGrid}>
          {filteredProducts.map(product => ( // Usar filteredProducts aquí
            <TouchableOpacity key={product.id} style={styles.productCard} onPress={() => navigation.navigate('DetalleProducto', { product })}>
              <Image
                source={product.image}
                style={styles.productImage}
                onError={(e) => console.log('Error loading image:', e.nativeEvent.error)}
                defaultSource={require('../../Src/AssetsProductos/Images/no-image.png')}
              />
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
                <Text style={styles.productPrice}>${product.price}</Text>
                <Text style={styles.productSeller} numberOfLines={1}>{product.seller} - {product.location}</Text>
              </View>
            </TouchableOpacity>
          ))}
          {filteredProducts.length === 0 && (
            <Text style={styles.noProductsText}>No hay productos que coincidan con tu búsqueda o categoría.</Text>
          )}
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
  mainScrollViewContent: {
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
  categoriesSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    width: '100%',
    marginBottom: 20,
  },
  categoriesContentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 5,
  },
  arrowButton: {
    padding: 10,
  },
  categoriesScrollView: {
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 5,
  },
  selectedCategoryButton: { // Nuevo estilo para el botón de categoría seleccionada
    backgroundColor: '#6A0DAD', // Color de fondo para la categoría activa
  },
  categoryText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  selectedCategoryText: { // Nuevo estilo para el texto de categoría seleccionada
    color: '#FFFFFF', // Color de texto para la categoría activa
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: width * 0.95,
    paddingHorizontal: 5,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    width: (width * 0.95 / 2) - 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    overflow: 'hidden',
    marginHorizontal: 5,
  },
  productImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  productInfo: {
    padding: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#6A0DAD',
    marginBottom: 5,
  },
  productSeller: {
    fontSize: 12,
    color: '#777',
  },
  noProductsText: { // Estilo para cuando no hay productos en la categoría
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
    width: '100%',
  },
});