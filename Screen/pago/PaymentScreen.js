import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { useStripe, StripeProvider } from '@stripe/stripe-react-native';
import axios from 'axios'; // Para hacer las solicitudes HTTP a tu backend Laravel
import { useRoute } from '@react-navigation/native'; // Importar useRoute

// Asegúrate de reemplazar esta URL con la URL REAL de tu backend Laravel
// Si estás en desarrollo, podría ser la IP de tu máquina local y el puerto de Laravel
// Ejemplo: const API_BASE_URL = 'http://192.168.1.100:8000/api';
const API_BASE_URL = 'http://your-laravel-backend-url.com/api'; // ¡CAMBIA ESTO!

const PaymentScreenContent = ({ navigation }) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const route = useRoute(); // Usar el hook useRoute
  const { orderDetails: passedOrderDetails } = route.params || {}; // Acceder a los detalles de la orden, con un fallback

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMessage, setPaymentMessage] = useState('');

  // Calcula el monto total real para Stripe (en centavos)
  // Asegúrate de que passedOrderDetails.total y passedOrderDetails.shipping sean números
  const totalAmountForStripe = ((passedOrderDetails?.total || 0) + (passedOrderDetails?.shipping || 0)) * 100;

  // Detalles de la orden para el pago, usando el monto calculado
  const orderDetailsForPayment = {
    amount: totalAmountForStripe, // En centavos
    currency: passedOrderDetails?.currency || 'usd', // o 'cop' si tu backend soporta pesos colombianos
    description: passedOrderDetails?.description || 'Compra de productos varios',
    items: passedOrderDetails?.items || [], // Asegúrate de pasar los ítems si los necesitas
  };

  useEffect(() => {
    if (passedOrderDetails) {
      // Usa passedOrderDetails.total y passedOrderDetails.items para configurar el pago de Stripe
      console.log("Detalles de la orden en PaymentScreen:", passedOrderDetails);
      console.log("Monto total para Stripe (en centavos):", orderDetailsForPayment.amount);
      // Puedes añadir lógica adicional aquí si necesitas hacer algo más con los detalles de la orden
    }
  }, [passedOrderDetails, orderDetailsForPayment.amount]); // Añadir orderDetailsForPayment.amount como dependencia

  const fetchPaymentIntentClientSecret = async () => {
    try {
      setLoading(true);
      setPaymentMessage('');
      const response = await axios.post(`${API_BASE_URL}/stripe/create-payment-intent`, {
        amount: orderDetailsForPayment.amount, // Usa el monto calculado
        currency: orderDetailsForPayment.currency,
        // Puedes enviar más detalles de la orden si tu backend los necesita
        description: orderDetailsForPayment.description,
        items: orderDetailsForPayment.items,
      });

      const { clientSecret } = response.data;
      if (!clientSecret) {
        throw new Error('No se recibió clientSecret del backend.');
      }

      const { error } = await initPaymentSheet({
        merchantDisplayName: "ExpoNets S.A.S", // Tu nombre de comercio
        paymentIntentClientSecret: clientSecret,
        // Configuración opcional para la hoja de pago:
        defaultBillingDetails: {
          name: name,
          email: email,
          address: {
            line1: address, // Podrías necesitar parsear la dirección si es una sola línea
            country: 'CO', // Código de país, ajusta según necesidad
          }
        },
        style: 'alwaysDark', // o 'automatic', 'alwaysLight'
      });

      if (error) {
        Alert.alert("Error al inicializar la hoja de pago", error.message);
        setPaymentMessage(`Error al iniciar pago: ${error.message}`);
        return null;
      }
      return true;
    } catch (error) {
      console.error("Error al obtener clientSecret o inicializar:", error.response?.data || error.message);
      Alert.alert("Error de conexión", "No se pudo conectar con el servidor de pagos. Inténtalo de nuevo más tarde.");
      setPaymentMessage(`Error: ${error.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    setPaymentMessage('Procesando pago...');

    // Asegúrate de que los campos de facturación estén llenos
    if (!name || !email || !address) {
      setPaymentMessage('Por favor, complete todos los datos de facturación.');
      setLoading(false);
      return;
    }

    const initialized = await fetchPaymentIntentClientSecret();
    if (!initialized) {
      setLoading(false);
      return;
    }

    const { error: presentError } = await presentPaymentSheet();

    if (presentError) {
      Alert.alert(`Error: ${presentError.code}`, presentError.message);
      setPaymentMessage(`❌ Error en el pago: ${presentError.message}`);
    } else {
      setPaymentMessage('✅ ¡Pago Completado!');
      Alert.alert('✅ ¡Pago Completado!', 'Tu pago ha sido procesado correctamente.');
      // Aquí puedes guardar el orderId y el email del cliente para la factura
      // Normalmente, el backend (Laravel) confirmará el pago vía webhook y luego enviará la factura.
      // Pero si necesitas disparar el envío de recibo desde el frontend (menos seguro):
      sendReceiptFromFrontend(email, "algun_order_id_temporal"); // Ajusta el orderId real si lo obtienes
    }
    setLoading(false);
  };

  // Función para enviar recibo desde el frontend (menos recomendado que desde webhook)
  const sendReceiptFromFrontend = async (customerEmail, orderId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/send-receipt`, {
        email: customerEmail,
        orderId: orderId,
        amount: orderDetailsForPayment.amount, // Usar el monto calculado
        description: orderDetailsForPayment.description,
        // Otros datos que necesite el backend para la factura
      });
      if (response.status === 200) {
        Alert.alert("Correo de Factura", "La factura ha sido enviada a tu correo.");
      } else {
        Alert.alert("Error al enviar factura", "Hubo un problema al intentar enviar la factura.");
        console.error('Error response from backend:', response.data);
      }
    } catch (error) {
      console.error("Error al enviar el recibo:", error.response?.data || error.message);
      Alert.alert("Error de envío", "No se pudo enviar la factura por correo.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Volver</Text>
      </TouchableOpacity>

      <View style={styles.formContainer}>
        <Text style={styles.title}>Datos de Facturación</Text>
        <View style={styles.inputBox}>
          <Text style={styles.inputLabel}>Nombre Completo:</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingrese su nombre"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#a0aec0"
          />
        </View>
        <View style={styles.inputBox}>
          <Text style={styles.inputLabel}>Email:</Text>
          <TextInput
            style={styles.input}
            placeholder="Inserte su Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="#a0aec0"
          />
        </View>
        <View style={styles.inputBox}>
          <Text style={styles.inputLabel}>Dirección:</Text>
          <TextInput
            style={styles.input}
            placeholder="Calle - Ciudad - País"
            value={address}
            onChangeText={setAddress}
            placeholderTextColor="#a0aec0"
          />
        </View>

        <Text style={styles.title}>Método de Pago</Text>
        {/* Stripe's PaymentSheet maneja la entrada de la tarjeta directamente, no se necesita CardElement */}
        <Text style={styles.inputLabel}>Se le pedirá que ingrese su tarjeta de crédito.</Text>

        <TouchableOpacity style={styles.button} onPress={handlePayment} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Pagar Ahora</Text>
          )}
        </TouchableOpacity>
        {paymentMessage ? <Text style={styles.message}>{paymentMessage}</Text> : null}
      </View>
    </View>
  );
};

// Componente principal que envuelve con StripeProvider
const PaymentScreen = ({ navigation }) => {
  return (
    <StripeProvider publishableKey="pk_test_51RoVzEEyxy0aDZQhBP3UTNyjf7OwPtnTWsB1iyf4o9vW62R5QrXsoHCnuc6vWk2nXr8gM6egI9qC17YIcn5S7dap0007IRv1uj">
      <PaymentScreenContent navigation={navigation} />
    </StripeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f9fc', // Fondo claro
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    width: '100%',
    maxWidth: 700,
    padding: 30,
    backgroundColor: '#1c1c2e', // Fondo oscuro del formulario
    borderRadius: 12,
    shadowColor: '#7b68ee', // Sombra morada
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    borderColor: '#7b68ee',
    borderWidth: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 15,
    marginTop: 20,
  },
  inputBox: {
    marginBottom: 20,
  },
  inputLabel: {
    display: 'flex',
    fontSize: 14,
    color: '#ffffff',
    marginBottom: 6,
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 2,
    borderColor: '#7b68ee',
    borderRadius: 8,
    fontSize: 15,
    backgroundColor: '#2a2a40',
    color: '#ffffff',
  },
  button: {
    marginTop: 30,
    width: '100%',
    padding: 14,
    backgroundColor: '#635bff',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  message: {
    textAlign: 'center',
    marginTop: 15,
    fontSize: 14,
    color: '#a0aec0', // Color para el mensaje general
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#2a2a40',
    borderColor: '#7b68ee',
    borderWidth: 2,
    borderRadius: 8,
    zIndex: 100,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '500',
  },
});

export default PaymentScreen;
