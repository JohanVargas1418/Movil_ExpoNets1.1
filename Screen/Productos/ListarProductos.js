import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";

import HeaderComponent from "../../Components/HeaderComponent";
import ChatButtonComponent from "../../Components/ChatButtonComponent";
import MenuComponent from "../../Components/MenuComponent";

import { ListarProductos } from "../../Src/Services/ProductoService";

const { width } = Dimensions.get('window');

export default function ListarProductosScreen() {
  const navigation = useNavigation();
  const categoriesScrollViewRef = useRef(null);
  const currentScrollX = useRef(0);

  const [showMenu, setShowMenu] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState(['Todos']);
  const [loading, setLoading] = useState(true);

  const toggleMenu = () => setShowMenu(!showMenu);

  useEffect(() => {
    const cargarProductos = async () => {
      setLoading(true);
      const res = await ListarProductos();
      if (res.success) {
        setProductos(res.data);

        const categoriasUnicas = [...new Set(res.data.map(p => p.categoria))];
        setCategorias(['Todos', ...categoriasUnicas]);
      } else {
        Alert.alert("Error", res.message || "No se pudieron cargar los productos.");
      }
      setLoading(false);
    };

    cargarProductos();
  }, []);

  const filteredProducts = productos.filter(product => {
    const matchCategoria = selectedCategory === 'Todos' || product.categoria === selectedCategory;
    const lower = searchText.toLowerCase();
    const nombre = product.nombre?.toLowerCase() || "";
    const descripcion = product.descripcion?.toLowerCase() || "";
    const vendedor = product.usuarios?.nombre?.toLowerCase() || "";

    const matchSearch = nombre.includes(lower) || descripcion.includes(lower) || vendedor.includes(lower);
    return matchCategoria && matchSearch;
  });

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

  const handleScroll = (event) => {
    currentScrollX.current = event.nativeEvent.contentOffset.x;
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#fff" }}>
        <ActivityIndicator size="large" color="#6A0DAD" />
        <Text style={{ marginTop: 10, fontSize: 16, color: "#6A0DAD" }}>Cargando productos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderComponent toggleMenu={toggleMenu} />

      <ScrollView contentContainerStyle={styles.mainScrollViewContent}>
        <View style={styles.titleContainer}>
          <Text style={styles.sectionTitle}>Explorar Productos</Text>
        </View>

        {/* Buscador */}
        <View style={styles.searchBarContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar productos..."
            placeholderTextColor="#888"
            value={searchText}
            onChangeText={setSearchText}
          />
          <TouchableOpacity style={styles.searchButton}>
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
              {categorias.map((cat, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[styles.categoryButton, selectedCategory === cat && styles.selectedCategoryButton]}
                  onPress={() => setSelectedCategory(cat)}
                >
                  <Text style={[styles.categoryText, selectedCategory === cat && styles.selectedCategoryText]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.arrowButton} onPress={scrollRight}>
              <Ionicons name="chevron-forward-outline" size={24} color="#6A0DAD" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Productos */}
        <View style={styles.productsGrid}>
          {filteredProducts.map((product) => (
            <TouchableOpacity
              key={product.id}
              style={styles.productCard}
              onPress={() => navigation.navigate("DetalleProducto", { product })}
            >
              <Image
                source={{
                  uri: `http://172.30.3.22:8000/storage/imagenes/${product.imagenes?.[0]?.nombreArchivo}`,
                }}
                style={styles.productImage}
                resizeMode="cover"
              />
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>{product.nombre}</Text>
                <Text style={styles.productPrice}>${product.precio}</Text>
                <Text style={styles.productSeller} numberOfLines={1}>
                  {product.usuarios?.nombre ? product.usuarios.nombre : "Vendedor desconocido"} 

                </Text>
              </View>
            </TouchableOpacity>
          ))}
          {filteredProducts.length === 0 && (
            <Text style={styles.noProductsText}>
              No hay productos que coincidan con tu búsqueda o categoría.
            </Text>
          )}
        </View>
      </ScrollView>

      <ChatButtonComponent />
      <MenuComponent isVisible={showMenu} onClose={toggleMenu} />
    </View>
  );
}

const styles = StyleSheet.create({
 
  container: { flex: 1, backgroundColor: "#F5F8FA", paddingTop: 60 },
  mainScrollViewContent: { flexGrow: 1, alignItems: "center", paddingBottom: 100 },
  titleContainer: { width: '100%', backgroundColor: '#6A0DAD', paddingVertical: 15, alignItems: 'center', marginBottom: 20, margin: 40 },
  sectionTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF' },
  searchBarContainer: { flexDirection: 'row', width: width * 0.9, backgroundColor: '#FFFFFF', borderRadius: 10, paddingHorizontal: 10, marginBottom: 20 },
  searchInput: { flex: 1, height: 45, fontSize: 16, color: '#333' },
  searchButton: { padding: 8, backgroundColor: '#6A0DAD', borderRadius: 8, marginLeft: 10 },
  categoriesSection: { flexDirection: 'row', justifyContent: 'center', paddingVertical: 10, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E0E0E0', width: '100%', marginBottom: 20 },
  categoriesContentWrapper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingHorizontal: 5 },
  arrowButton: { padding: 10 },
  categoriesScrollView: { alignItems: 'center', paddingHorizontal: 5 },
  categoryButton: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, backgroundColor: '#E0E0E0', marginHorizontal: 5 },
  selectedCategoryButton: { backgroundColor: '#6A0DAD' },
  categoryText: { fontSize: 16, color: '#333', fontWeight: '500' },
  selectedCategoryText: { color: '#FFFFFF' },
  productsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', width: width * 0.95, paddingHorizontal: 5 },
  productCard: { backgroundColor: '#FFFFFF', borderRadius: 15, width: (width * 0.95 / 2) - 15, marginBottom: 15, elevation: 5, overflow: 'hidden', marginHorizontal: 5 },
  productImage: { width: '100%', height: 150, resizeMode: 'cover', borderTopLeftRadius: 15, borderTopRightRadius: 15 },
  productInfo: { padding: 10 },
  productName: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  productPrice: { fontSize: 15, fontWeight: 'bold', color: '#6A0DAD', marginBottom: 5 },
  productSeller: { fontSize: 12, color: '#777' },
  noProductsText: { fontSize: 16, color: '#777', textAlign: 'center', marginTop: 20, width: '100%' },
});
