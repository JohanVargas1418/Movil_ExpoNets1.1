import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  TextInput,
} from "react-native";
import HeaderComponent from "../../Components/HeaderComponent";
import ChatButtonComponent from "../../Components/ChatButtonComponent";
import MenuComponent from "../../Components/MenuComponent";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from "@react-navigation/native";
import { Picker } from '@react-native-picker/picker';

const { width } = Dimensions.get('window');

export default function OrdenScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [showMenu, setShowMenu] = useState(false);
  const [isEditingShipping, setIsEditingShipping] = useState(false); // Estado para controlar la edición de envío

  // Estados para la información de envío (para edición en los TextInput)
  const [recipient, setRecipient] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [zip, setZip] = useState('');

  // Estado para el método de pago
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Tarjeta de Crédito');

  // Estado para los detalles de la orden
  const [orderDetails, setOrderDetails] = useState({
    id: 'ORD-PENDIENTE',
    date: new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' }),
    status: 'Pendiente',
    total: 0.00,
    items: [],
    shippingAddress: { // Asegurarse de que el objeto shippingAddress exista con valores por defecto
      recipient: 'Nombre del Cliente',
      street: 'Dirección de Envío',
      city: 'Ciudad',
      country: 'País',
      zip: 'Código Postal',
    },
    paymentMethod: 'Tarjeta de Crédito', // Valor por defecto para el picker
  });

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    // Función auxiliar para parsear el precio de forma segura
    const parsePrice = (price) => {
      // Si el precio ya es un número, retornarlo directamente.
      if (typeof price === 'number') {
        return price;
      }
      // Si es una cadena, limpiarla y luego parsearla a flotante.
      return parseFloat(String(price || '0').replace('.', '').replace(',', '.'));
    };

    let initialOrderDetails = { ...orderDetails }; // Copia para modificar

    if (route.params?.cartItems) {
      const cartItems = route.params.cartItems;
      const calculatedTotal = cartItems.reduce((sum, item) => sum + (parsePrice(item.price) * item.quantity), 0);

      initialOrderDetails = {
        ...initialOrderDetails,
        id: `ORD-${Date.now()}`,
        status: 'Pendiente',
        total: calculatedTotal,
        items: cartItems,
      };
    } else if (route.params?.orderDetails) {
      const existingOrder = route.params.orderDetails;
      initialOrderDetails = {
        ...initialOrderDetails,
        ...existingOrder, // Sobrescribe con los detalles de la orden existente
        status: 'Pendiente', // Asegurar que el estado sea Pendiente si se carga una orden
        items: existingOrder.items || [], // Asegurarse de que items sea un array
      };
    } else {
      // Si no hay items ni orden existente, usar datos de ejemplo para una orden "Pendiente"
      initialOrderDetails = {
        id: 'ORD-20250727-001',
        date: '27 de Julio, 2025',
        status: 'Pendiente',
        total: 74900.00,
        items: [
          { id: 'p1', name: 'Yogurt de Arándanos', quantity: 2, price: 16900.00, image: require('../../Src/AssetsProductos/Images/yogurtArandanos.jpeg') },
          { id: 'p2', name: 'Miel Pura de Abeja', quantity: 1, price: 40000.00, image: require('../../Src/AssetsProductos/Images/miel.jpg') },
          { id: 'p3', name: 'Jabon Artesanal Lavanda', quantity: 1, price: 12000.00, image: require('../../Src/AssetsProductos/Images/cerveza.jpg') },
        ],
        shippingAddress: { // Datos de ejemplo para la dirección de envío
          recipient: 'Juan Pérez',
          street: 'Calle 123 #45-67',
          city: 'Bogotá',
          country: 'Colombia',
          zip: '110111',
        },
        paymentMethod: 'Tarjeta de Crédito',
      };
    }

    setOrderDetails(initialOrderDetails);

    // Inicializar los estados de edición de envío y pago con los datos de orderDetails
    // Usar el operador de encadenamiento opcional (?) para evitar errores si shippingAddress es undefined
    setRecipient(initialOrderDetails.shippingAddress?.recipient || '');
    setStreet(initialOrderDetails.shippingAddress?.street || '');
    setCity(initialOrderDetails.shippingAddress?.city || '');
    setCountry(initialOrderDetails.shippingAddress?.country || '');
    setZip(initialOrderDetails.shippingAddress?.zip || '');
    setSelectedPaymentMethod(initialOrderDetails.paymentMethod || 'Tarjeta de Crédito');

  }, [route.params?.cartItems, route.params?.orderDetails]); // Dependencias para re-ejecutar

  // Función para verificar si todos los campos requeridos están llenos
  const isFormValid = () => {
    // Asegurarse de que orderDetails.shippingAddress no sea undefined antes de acceder a sus propiedades
    const shippingAddress = orderDetails.shippingAddress;
    return (
      shippingAddress && // Verificar que el objeto exista
      shippingAddress.recipient?.trim() !== '' &&
      shippingAddress.street?.trim() !== '' &&
      shippingAddress.city?.trim() !== '' &&
      shippingAddress.country?.trim() !== '' &&
      shippingAddress.zip?.trim() !== '' &&
      selectedPaymentMethod !== '' &&
      orderDetails.items.length > 0
    );
  };

  // Función para guardar los cambios de envío
  const handleSaveShipping = () => {
    // Validar que los campos de envío no estén vacíos antes de guardar
    if (recipient.trim() === '' || street.trim() === '' || city.trim() === '' || country.trim() === '' || zip.trim() === '') {
      Alert.alert("Campos de Envío Incompletos", "Por favor, completa todos los campos de la dirección de envío.");
      return false; // Indicar que la validación falló
    }

    setOrderDetails(prevDetails => ({
      ...prevDetails,
      shippingAddress: {
        recipient,
        street,
        city,
        country,
        zip,
      },
    }));
    setIsEditingShipping(false); // Salir del modo de edición solo si la validación pasa
    return true; // Indicar éxito
  };

  const handleFinalizePurchase = () => {
    if (isFormValid()) {
      Alert.alert(
        "Compra Finalizada",
        `Tu orden ${orderDetails.id} ha sido finalizada con éxito.
        Método de Pago: ${selectedPaymentMethod}
        Envío a: ${orderDetails.shippingAddress?.recipient}, ${orderDetails.shippingAddress?.street}, ${orderDetails.shippingAddress?.city}, ${orderDetails.shippingAddress?.country}, ${orderDetails.shippingAddress?.zip}`
      );
      // Aquí iría la lógica real para procesar la compra:
      // - Enviar los datos de la orden a un backend
      // - Limpiar el carrito del usuario
      // - Navegar a una pantalla de confirmación o al inicio
      navigation.navigate('Home');
    } else {
      Alert.alert("Información Incompleta", "Por favor, completa todos los detalles de envío y selecciona un método de pago.");
    }
  };

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
          {/* Aplicar cardTitleContainer al título de Resumen del Pedido */}
          <View style={styles.cardTitleContainer}>
            <Text style={styles.cardTitle}>Resumen del Pedido</Text>
          </View>
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
            <Text style={[styles.summaryValue, styles.statusTextPending]}>{orderDetails.status}</Text>
          </View>
          <View style={styles.summaryRowTotal}>
            <Text style={styles.summaryLabelTotal}>Total:</Text>
            <Text style={styles.summaryValueTotal}>${orderDetails.total.toLocaleString('es-CO')}</Text>
          </View>
        </View>

        {/* Productos de la Orden */}
        <View style={styles.card}>
          {/* Aplicar cardTitleContainer al título de Productos */}
          <View style={styles.cardTitleContainer}>
            <Text style={styles.cardTitle}>Productos</Text>
          </View>
          {orderDetails.items.length > 0 ? (
            orderDetails.items.map(item => (
              <View key={item.id} style={styles.itemRow}>
                <Image source={item.image} style={styles.itemImage} />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemQuantity}>Cantidad: {item.quantity}</Text>
                </View>
                {/* Usar la función parsePrice para asegurar que item.price sea un número */}
                <Text style={styles.itemPrice}>${(parseFloat(String(item.price || '0').replace('.', '').replace(',', '.')) * item.quantity).toLocaleString('es-CO')}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noItemsText}>No hay productos en esta orden.</Text>
          )}
        </View>

        {/* Información de Envío */}
        <View style={styles.card}>
          <View style={styles.cardTitleContainer}>
            <Text style={styles.cardTitle}>Información de Envío</Text>
            <TouchableOpacity
              onPress={() => {
                if (isEditingShipping) {
                  // Si está editando, intenta guardar y salir del modo de edición
                  handleSaveShipping();
                } else {
                  // Si no está editando, entra en modo de edición
                  setIsEditingShipping(true);
                }
              }}
              style={styles.editIcon}
            >
              {/* Cambia el icono según el modo de edición */}
              <Ionicons name={isEditingShipping ? "checkmark-outline" : "create-outline"} size={24} color="#6A0DAD" />
            </TouchableOpacity>
          </View>

          {isEditingShipping ? (
            <>
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Destinatario:</Text>
                <TextInput
                  style={styles.input}
                  value={recipient}
                  onChangeText={setRecipient}
                  placeholder="Nombre del destinatario"
                  placeholderTextColor="#888"
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Dirección:</Text>
                <TextInput
                  style={styles.input}
                  value={street}
                  onChangeText={setStreet}
                  placeholder="Calle, número, apto/casa"
                  placeholderTextColor="#888"
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Ciudad:</Text>
                <TextInput
                  style={styles.input}
                  value={city}
                  onChangeText={setCity}
                  placeholder="Ciudad"
                  placeholderTextColor="#888"
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>País:</Text>
                <TextInput
                  style={styles.input}
                  value={country}
                  onChangeText={setCountry}
                  placeholder="País"
                  placeholderTextColor="#888"
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Código Postal:</Text>
                <TextInput
                  style={styles.input}
                  value={zip}
                  onChangeText={setZip}
                  placeholder="Código Postal"
                  keyboardType="numeric"
                  maxLength={10}
                  placeholderTextColor="#888"
                />
              </View>
              {/* El botón de guardar explícito ha sido eliminado */}
            </>
          ) : (
            <>
              {/* Mostrar los datos actuales de orderDetails.shippingAddress */}
              <Text style={styles.shippingText}>Destinatario: {orderDetails.shippingAddress?.recipient || 'N/A'}</Text>
              <Text style={styles.shippingText}>Dirección: {orderDetails.shippingAddress?.street || 'N/A'}</Text>
              <Text style={styles.shippingText}>{orderDetails.shippingAddress?.city || 'N/A'}, {orderDetails.shippingAddress?.country || 'N/A'} {orderDetails.shippingAddress?.zip || 'N/A'}</Text>
            </>
          )}
        </View>

        {/* Información de Pago */}
        <View style={styles.card}>
          {/* Aplicar cardTitleContainer al título de Método de Pago */}
          <View style={styles.cardTitleContainer}>
            <Text style={styles.cardTitle}>Método de Pago</Text>
          </View>
          <View style={styles.inputContainer}>
            <Picker
              selectedValue={selectedPaymentMethod}
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) => setSelectedPaymentMethod(itemValue)}
            >
              <Picker.Item label="Selecciona un método de pago" value="" />
              <Picker.Item label="Tarjeta de Crédito" value="Tarjeta de Crédito" />
              <Picker.Item label="PayPal" value="PayPal" />
              <Picker.Item label="Transferencia Bancaria" value="Transferencia Bancaria" />
              <Picker.Item label="Pago contra entrega" value="Pago contra entrega" />
            </Picker>
          </View>
        </View>

        {/* Botón Finalizar Compra */}
        <TouchableOpacity
          style={[styles.finalizeButton, !isFormValid() && styles.finalizeButtonDisabled]}
          onPress={handleFinalizePurchase}
          disabled={!isFormValid()}
        >
          <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" style={styles.finalizeButtonIcon} />
          <Text style={styles.finalizeButtonText}>Finalizar Compra</Text>
        </TouchableOpacity>

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
    paddingTop: 60,
  },
  scrollViewContent: {
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
    margin: 40, // Espacio alrededor del encabezado
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
  cardTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    // Eliminado borderBottomWidth y borderBottomColor de aquí, ahora están en cardTitleContainer
  },
  editIcon: {
    padding: 5,
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
  statusTextSuccess: {
    color: '#28a745',
    fontWeight: 'bold',
  },
  statusTextPending: {
    color: '#ffc107',
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
  formGroup: {
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#F8F8F8',
  },
  saveButton: { // Este estilo ya no se usa para un botón explícito, pero se mantiene si se reutiliza
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    alignSelf: 'flex-end',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#F8F8F8',
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#333',
  },
  finalizeButton: {
    backgroundColor: '#6A0DAD',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    width: width * 0.9,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  finalizeButtonDisabled: {
    backgroundColor: '#B0B0B0',
  },
  finalizeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  finalizeButtonIcon: {
    marginRight: 5,
  },
  goHomeButton: {
    backgroundColor: '#555',
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
  noItemsText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    paddingVertical: 20,
  },
});