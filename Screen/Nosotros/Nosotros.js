import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  ImageBackground,
    Alert,
} from "react-native";
import HeaderComponent from "../../Components/HeaderComponent";
import ChatButtonComponent from "../../Components/ChatButtonComponent";
import FooterComponent from "../../Components/FooterComponent";
import MenuComponent from "../../Components/MenuComponent";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get('window');

export default function NosotrosScreen() {
  const navigation = useNavigation();
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <View style={styles.container}>
      {/* Header Component */}
      <HeaderComponent toggleMenu={toggleMenu} />

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Sección de Encabezado de la Página */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageHeaderText}>Acerca de ExpoNets</Text>
        </View>

        {/* Sección de Imagen Principal con Texto */}
        <View style={styles.mainImageContainer}>
          <ImageBackground 
            source={require('../../Src/AssetsProductos/Images/Nosotros.jpeg')} // Asegúrate de tener esta imagen
            style={styles.mainImage}
            resizeMode="cover"
          >
            <View style={styles.mainImageOverlay}>
              <Text style={styles.mainImageTitle}>Conectando emprendedores, impulsando oportunidades</Text>
            </View>
          </ImageBackground>
        </View>

        {/* Sección de Texto Descriptivo */}
        <View style={styles.descriptionSection}>
          <Text style={styles.descriptionText}>
            ExpoNets es una plataforma innovadora que reúne emprendimientos y microempresas, brindándoles un
            espacio digital para exponer y vender sus productos. Más que un simple marketplace, ofrecemos una
            comunidad de negocios emergentes que buscan mayor reconocimiento y crecimiento.
          </Text>
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#6A0DAD" style={styles.featureIcon} />
              <Text style={styles.featureText}>Eventos Exclusivos: Ofrecemos ferias virtuales y físicas, descuentos especiales y colaboraciones estratégicas.</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#6A0DAD" style={styles.featureIcon} />
              <Text style={styles.featureText}>Capacitación y Recursos: Acceso a talleres, webinars y herramientas para mejorar sus habilidades empresariales.</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#6A0DAD" style={styles.featureIcon} />
              <Text style={styles.featureText}>Red de Contactos: Oportunidades para conectar con otros emprendedores, inversionistas y mentores.</Text>
            </View>
          </View>

          
        </View>

        {/* Sección 2: Expande tus fronteras */}
                <View style={styles.expandSection}>
                  <Image
                    source={require('../../Src/AssetsProductos/Images/fondo_home.jpg')}
                    style={styles.expandImage}
                    resizeMode="contain"
                  />
                  <Text style={styles.expandTitle}>Expande tus fronteras y lleva tu negocio al mundo</Text>
                  <Text style={styles.expandDescription}>
                    Abrir nuevas líneas de mercado fuera del país no solo diversifica tus ingresos, sino que te permite competir
                    en un escenario global, donde las oportunidades son infinitas. Acceder a mercados internacionales te brinda:
                  </Text>
                  <View style={styles.featureList}>
                    <View style={styles.featureItem}>
                      <Ionicons name="checkmark-circle" size={20} color="#6A0DAD" style={styles.featureIcon} />
                      <Text style={styles.featureText}>Mayor estabilidad financiera, al no depender de un solo mercado.</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Ionicons name="checkmark-circle" size={20} color="#6A0DAD" style={styles.featureIcon} />
                      <Text style={styles.featureText}>Expansión de clientes y socios estratégicos, aumentando tu alcance y reconocimiento.</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Ionicons name="checkmark-circle" size={20} color="#6A0DAD" style={styles.featureIcon} />
                      <Text style={styles.featureText}>Oportunidades de innovación y diferenciación, adaptándote a nuevas tendencias y demandas.</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.readMoreButton} onPress={() => Alert.alert("Leer Más", "Simulando leer más sobre la expansión")}>
                    <Text style={styles.readMoreButtonText}>Leer más <Ionicons name="arrow-forward-outline" size={16} color="#FFFFFF" /></Text>
                  </TouchableOpacity>
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
    paddingTop: 60, // Espacio para el header fijo
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 100, // Espacio para el botón de chat flotante
  },
  pageHeader: {
    width: '100%',
    backgroundColor: '#6A0DAD', // Color morado como en la imagen
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
    margin: 40, // Espacio alrededor del encabezado
  },
  pageHeaderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  mainImageContainer: {
    width: width * 0.95, // Ocupa casi todo el ancho
    borderRadius: 15,
    overflow: 'hidden', // Para que la imagen se recorte con el borderRadius
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  mainImage: {
    width: '100%',
    height: height * 0.3, // Altura de la imagen principal
    justifyContent: 'flex-end', // Alinea el contenido al final (inferior)
  },
  mainImageOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Fondo oscuro semitransparente
    padding: 15,
  },
  mainImageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'left', // Alineado a la izquierda como en la imagen
  },
  descriptionSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    width: width * 0.95,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: 20,
  },
  descriptionText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 15,
  },
  featureList: {
    width: '100%',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  featureIcon: {
    marginRight: 10,
    marginTop: 2, // Ajuste para alinear con el texto
  },
  featureText: {
    flex: 1, // Para que el texto ocupe el espacio restante
    fontSize: 14,
    color: '#555',
  },
  // Sección 2: Expande tus fronteras
  expandSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    width: width * 0.9,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  expandImage: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 15,
    resizeMode: 'contain',
  },
  expandTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  expandDescription: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 20,
  },
  featureList: {
    width: '100%',
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  featureIcon: {
    marginRight: 10,
    marginTop: 2, // Ajuste para alinear con el texto
  },
  featureText: {
    flex: 1, // Para que el texto ocupe el espacio restante
    fontSize: 14,
    color: '#555',
  },
  readMoreButton: {
    backgroundColor: '#6A0DAD',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  readMoreButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 5,
  },

  
});