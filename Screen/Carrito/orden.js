import React, { useState, useEffect } from "react"; // Importar useEffect
import { // Eliminar useRef si no se usa
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from "react-native";
import HeaderComponent from "../../Components/HeaderComponent";
import ChatButtonComponent from "../../Components/ChatButtonComponent";
import MenuComponent from "../../Components/MenuComponent";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from "@react-navigation/native"; // Importar useRoute

const { width } = Dimensions.get('window');

export default function OrdenScreen() {
  const navigation = useNavigation();
  const route = useRoute(); // Obtener los parámetros de la ruta
  const [showMenu, setShowMenu] = useState(false);
  const [orderDetails, setOrderDetails] = useState({ // Usar estado para orderDetails
    id: 'ORD-PENDIENTE', // ID inicial, se podría generar al confirmar la orden
    date: new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' }),
    status: 'Pendiente',
    total: 0.00,
    items: [],
    shippingAddress: {
      recipient: 'Nombre del Cliente',
      street: 'Dirección de Envío',
      city: 'Ciudad',
      country: 'País',
      zip: 'Código Postal',
    },
    paymentMethod: 'Método de Pago',
    paymentStatus: 'No Pagado',
  });

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    // Verificar si se pasaron items del carrito a través de los parámetros de navegación
    if (route.params?.cartItems) {
      const cartItems = route.params.cartItems;
      const calculatedTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      setOrderDetails(prevDetails => ({
        ...prevDetails,
        id: `ORD-${Date.now()}`, // Generar un ID de orden más dinámico
        status: 'Pendiente de Pago',
        total: calculatedTotal,
        items: cartItems,
        // Aquí podrías añadir lógica para obtener la dirección y método de pago reales
        // Por ahora, se mantienen los placeholders o se usan los datos de ejemplo si no hay otros
      }));
    } else {
      // Si no hay items del carrito, usar los datos de ejemplo hardcodeados
      setOrderDetails({
        id: 'ORD-20250727-001',
        date: '27 de Julio, 2025',
        status: 'Completada',
        total: 74900.00,
        items: [
          { id: 'p1', name: 'Yogurt de Arándanos', quantity: 2, price: 16900.00, image: require('../../Src/AssetsProductos/Images/yogurtArandanos.jpeg') },
          { id: 'p2', name: 'Miel Pura de Abeja', quantity: 1, price: 40000.00, image: require('../../Src/AssetsProductos/Images/miel.jpg') },
          { id: 'p3', name: 'Jabon Artesanal Lavanda', quantity: 1, price: 12000.00, image: require('../../Src/AssetsProductos/Images/cerveza.jpg') },
        ],
        shippingAddress: {
          recipient: 'Juan Pérez',
          street: 'Calle 123 #45-67',
          city: 'Bogotá',
          country: 'Colombia',
          zip: '110111',
        },
        paymentMethod: 'Tarjeta de Crédito (**** 1234)',
        paymentStatus: 'Pagado',
      });
    }
  }, [route.params?.cartItems]); // Dependencia para re-ejecutar cuando cambien los items del carrito

  const handleGoHome = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      {/* Header Component */}
      <HeaderComponent toggleMenu={toggleMenu} />

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Título de la sección */}
        <View style={styles.titleContainer}>
          <Text style={styles.sectionTitle}>Detalles de tu Orden</Text>
        </View>

        {/* Resumen de la Orden */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Resumen del Pedido</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>ID de Orden:</Text>
            <Text style={styles.summaryValue}>{orderDetails.id}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Fecha:</Text>
            <Text style={styles.summaryValue}>{orderDetails.date}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Estado:</Text>
            <Text style={[styles.summaryValue, orderDetails.status === 'Completada' || orderDetails.status === 'Pagado' ? styles.statusTextSuccess : styles.statusTextPending]}>{orderDetails.status}</Text>
          </View>
          <View style={styles.summaryRowTotal}>
            <Text style={styles.summaryLabelTotal}>Total:</Text>
            <Text style={styles.summaryValueTotal}>${orderDetails.total.toLocaleString('es-CO')}</Text>
          </View>
        </View>

        {/* Productos de la Orden */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Productos</Text>
          {orderDetails.items.length > 0 ? (
            orderDetails.items.map(item => (
              <View key={item.id} style={styles.itemRow}>
                <Image source={item.image} style={styles.itemImage} />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemQuantity}>Cantidad: {item.quantity}</Text>
                </View>
                <Text style={styles.itemPrice}>${(item.price * item.quantity).toLocaleString('es-CO')}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noItemsText}>No hay productos en esta orden.</Text>
          )}
        </View>

        {/* Información de Envío */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Información de Envío</Text>
          <Text style={styles.shippingText}>Destinatario: {orderDetails.shippingAddress.recipient}</Text>
          <Text style={styles.shippingText}>Dirección: {orderDetails.shippingAddress.street}</Text>
          <Text style={styles.shippingText}>{orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.country} {orderDetails.shippingAddress.zip}</Text>
        </View>

        {/* Información de Pago */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Información de Pago</Text>
          <Text style={styles.paymentText}>Método: {orderDetails.paymentMethod}</Text>
          <Text style={styles.paymentText}>Estado: <Text style={orderDetails.paymentStatus === 'Pagado' ? styles.statusTextSuccess : styles.statusTextPending}>{orderDetails.paymentStatus}</Text></Text>
        </View>

        {/* Botón de Volver a Inicio */}
        <TouchableOpacity style={styles.goHomeButton} onPress={handleGoHome}>
          <Ionicons name="home-outline" size={20} color="#FFFFFF" style={styles.goHomeIcon} />
          <Text style={styles.goHomeButtonText}>Volver al Inicio</Text>
        </TouchableOpacity>

       
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
  titleContainer: {
    width: '100%',
    backgroundColor: '#6A0DAD',
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
    margin: 40, // Espacio alrededor del título
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  card: {
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
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#555',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  summaryRowTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 10,
  },
  summaryLabelTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  summaryValueTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6A0DAD',
  },
  statusTextSuccess: { // Nuevo estilo para estado exitoso
    color: '#28a745', // Verde
    fontWeight: 'bold',
  },
  statusTextPending: { // Nuevo estilo para estado pendiente
    color: '#ffc107', // Amarillo/Naranja
    fontWeight: 'bold',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    paddingBottom: 10,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
    resizeMode: 'cover',
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  itemQuantity: {
    fontSize: 14,
    color: '#777',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6A0DAD',
  },
  shippingText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  paymentText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  goHomeButton: {
    backgroundColor: '#6A0DAD',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    width: width * 0.9,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  goHomeIcon: {
    marginRight: 10,
  },
  goHomeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  noItemsText: { // Nuevo estilo para cuando no hay productos
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    paddingVertical: 20,
  },
});