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
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";

const { width } = Dimensions.get("window");

export default function OrdenScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [showMenu, setShowMenu] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Tarjeta de Crédito");

  const [orderDetails, setOrderDetails] = useState({
    id: `ORD-${Date.now()}`,
    date: new Date().toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    status: "Pendiente",
    total: 0,
    shipping: 5000,
    items: [],
    shippingAddress: {
      recipient: "Nombre del Cliente",
      street: "Dirección de Envío",
      city: "Ciudad",
      country: "País",
      zip: "000000",
    },
    paymentMethod: "Método de Pago",
    paymentStatus: "No Pagado",
  });

  // Campos individuales para editar información de envío
  const [recipient, setRecipient] = useState(orderDetails.shippingAddress.recipient);
  const [street, setStreet] = useState(orderDetails.shippingAddress.street);
  const [city, setCity] = useState(orderDetails.shippingAddress.city);
  const [country, setCountry] = useState(orderDetails.shippingAddress.country);
  const [zip, setZip] = useState(orderDetails.shippingAddress.zip);
  const [isEditingShipping, setIsEditingShipping] = useState(false);

  const handleSaveShipping = () => {
    if (
      recipient.trim() === '' ||
      street.trim() === '' ||
      city.trim() === '' ||
      country.trim() === '' ||
      zip.trim() === ''
    ) {
      Alert.alert("Campos de Envío Incompletos", "Por favor, completa todos los campos.");
      return false;
    }

    setOrderDetails(prevDetails => ({
      ...prevDetails,
      shippingAddress: { recipient, street, city, country, zip },
    }));
    setIsEditingShipping(false);
    return true;
  };

  const toggleMenu = () => setShowMenu(!showMenu);

  useEffect(() => {
    if (route.params?.cartItems) {
      const cartItems = route.params.cartItems;
      const subtotal = cartItems.reduce(
        (sum, item) => sum + item.precio * item.cantidad,
        0
      );
      setOrderDetails(prev => ({
        ...prev,
        items: cartItems,
        total: subtotal,
      }));
    }
  }, [route.params?.cartItems]);

  const handleConfirmOrder = () => {
    // Validar que la dirección de envío esté completa antes de proceder
    if (!handleSaveShipping()) {
      return; // Si la validación falla, no continúa
    }

    if (paymentMethod === "") {
      Alert.alert("Método de Pago No Seleccionado", "Por favor, selecciona un método de pago para continuar.");
      return;
    }

    Alert.alert("Confirmación", "¿Deseas confirmar tu orden?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Confirmar",
        onPress: () => {
          if (paymentMethod === "Tarjeta de Crédito" || paymentMethod === "PayPal") {
            // Si el método de pago es Tarjeta de Crédito o PayPal, redirige a PaymentScreen
            navigation.navigate("PaymentScreen", {
              orderDetails: {
                ...orderDetails,
                paymentMethod: paymentMethod, // Asegura que el método de pago esté actualizado
              },
            });
          } else {
            // Para otros métodos de pago (ej. Pago contra entrega, Transferencia Bancaria),
            // actualiza el estado de la orden directamente.
            setOrderDetails(prev => ({
              ...prev,
              status: "Completada",
              paymentStatus: paymentMethod === "Pago contra entrega" ? "Pendiente" : "Pagado", // Ajusta el estado de pago según el método
              paymentMethod: paymentMethod,
            }));
            Alert.alert("Orden Confirmada", "Tu orden ha sido enviada con éxito.");
          }
        },
      },
    ]);
  };

  const handleGoHome = () => navigation.navigate("Home");

  return (
    <View style={styles.container}>
      <HeaderComponent toggleMenu={toggleMenu} />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.titleContainer}>
          <Text style={styles.sectionTitle}>Detalles de tu Orden</Text>
        </View>

        {/* RESUMEN */}
        <View style={styles.card}>
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
            <Text
              style={[
                styles.summaryValue,
                orderDetails.status === "Completada"
                  ? styles.statusTextSuccess
                  : styles.statusTextPending,
              ]}
            >
              {orderDetails.status}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Envío:</Text>
            <Text style={styles.summaryValue}>
              ${orderDetails.shipping.toLocaleString("es-CO")}
            </Text>
          </View>
          <View style={styles.summaryRowTotal}>
            <Text style={styles.summaryLabelTotal}>Total:</Text>
            <Text style={styles.summaryValueTotal}>
              {(orderDetails.total + orderDetails.shipping).toLocaleString("es-CO")}
            </Text>
          </View>
        </View>

        {/* PRODUCTOS */}
        <View style={styles.card}>
          <View style={styles.cardTitleContainer}>
            <Text style={styles.cardTitle}>Productos</Text>
          </View>
          {orderDetails.items.length > 0 ? (
            orderDetails.items.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <Image
                  source={
                    item.imagen
                      ? { uri: item.imagen }
                      : require("../../Src/AssetsProductos/Images/no-image.png")
                  }
                  style={styles.itemImage}
                />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{item.nombre}</Text>
                  <Text style={styles.itemQuantity}>Cantidad: {item.cantidad}</Text>
                </View>
                <Text style={styles.itemPrice}>
                  ${(item.precio * item.cantidad).toLocaleString("es-CO")}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.noItemsText}>No hay productos en esta orden.</Text>
          )}
        </View>

        {/* ENVÍO */}
        <View style={styles.card}>
          <View style={styles.cardTitleContainer}>
            <Text style={styles.cardTitle}>Información de Envío</Text>
            <TouchableOpacity
              onPress={() => {
                if (isEditingShipping) {
                  handleSaveShipping();
                } else {
                  const {
                    recipient,
                    street,
                    city,
                    country,
                    zip,
                  } = orderDetails.shippingAddress;
                  setRecipient(recipient);
                  setStreet(street);
                  setCity(city);
                  setCountry(country);
                  setZip(zip);
                  setIsEditingShipping(true);
                }
              }}
              style={styles.editIcon}
            >
              <Ionicons
                name={isEditingShipping ? "checkmark-outline" : "create-outline"}
                size={24}
                color="#6A0DAD"
              />
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
            </>
          ) : (
            <>
              <Text style={styles.shippingText}>Destinatario: {orderDetails.shippingAddress?.recipient || 'N/A'}</Text>
              <Text style={styles.shippingText}>Dirección: {orderDetails.shippingAddress?.street || 'N/A'}</Text>
              <Text style={styles.shippingText}>
                {orderDetails.shippingAddress?.city || 'N/A'}, {orderDetails.shippingAddress?.country || 'N/A'} {orderDetails.shippingAddress?.zip || 'N/A'}
              </Text>
            </>
          )}
        </View>

        {/* PAGO */}
        <View style={styles.card}>
          <View style={styles.cardTitleContainer}>
            <Text style={styles.cardTitle}>Método de Pago</Text>
          </View>
          <View style={styles.inputContainer}>
            <Picker
              selectedValue={paymentMethod}
              style={styles.picker}
              onValueChange={(itemValue) => setPaymentMethod(itemValue)}
            >
              <Picker.Item label="Selecciona un método de pago" value="" />
              <Picker.Item label="Tarjeta de Crédito" value="Tarjeta de Crédito" />
              <Picker.Item label="PayPal" value="PayPal" />
              <Picker.Item label="Transferencia Bancaria" value="Transferencia Bancaria" />
              <Picker.Item label="Pago contra entrega" value="Pago contra entrega" />
            </Picker>
          </View>
        </View>

        {/* BOTONES */}
        <TouchableOpacity style={styles.goHomeButton} onPress={handleGoHome}>
          <Ionicons name="home-outline" size={20} color="#FFFFFF" style={styles.goHomeIcon} />
          <Text style={styles.goHomeButtonText}>Volver al Inicio</Text>
        </TouchableOpacity>

        {/* Solo muestra el botón de confirmar si la orden no ha sido pagada y si hay elementos en el carrito */}
        {orderDetails.paymentStatus !== "Pagado" && orderDetails.items.length > 0 && (
          <TouchableOpacity
            style={[styles.goHomeButton, { backgroundColor: "#28a745", marginTop: 10 }]}
            onPress={handleConfirmOrder}
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={20}
              color="#FFFFFF"
              style={styles.goHomeIcon}
            />
            <Text style={styles.goHomeButtonText}>Confirmar Orden</Text>
          </TouchableOpacity>
        )}
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
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingBottom: 100,
  },
  titleContainer: {
    width: "100%",
    backgroundColor: "#6A0DAD",
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 20,
    margin: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  card: {
    backgroundColor: "#FFFFFF",
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingBottom: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: "#555",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  summaryRowTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingTop: 10,
  },
  summaryLabelTotal: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  summaryValueTotal: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6A0DAD",
  },
  statusTextSuccess: {
    color: "#28a745",
    fontWeight: "bold",
  },
  statusTextPending: {
    color: "#ffc107",
    fontWeight: "bold",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
    paddingBottom: 10,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
    resizeMode: "cover",
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
  },
  itemQuantity: {
    fontSize: 14,
    color: "#777",
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6A0DAD",
  },
  shippingText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    backgroundColor: "#F8F8F8",
    marginBottom: 10,
  },
  picker: {
    height: 60,
    width: "100%",
    color: "#333",
  },
  goHomeButton: {
    backgroundColor: "#6A0DAD",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  noItemsText: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
    paddingVertical: 20,
  },
  formGroup: {
    marginBottom: 10,
    width: '100%',
  },
  inputLabel: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#F8F8F8",
  },
});