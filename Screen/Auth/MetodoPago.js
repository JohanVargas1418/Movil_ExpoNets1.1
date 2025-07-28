import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  ActivityIndicator, // Para mostrar un indicador de carga
} from 'react-native';
// Importa los componentes y hooks de Stripe
import { useStripe, StripeProvider, CardField } from '@stripe/stripe-react-native';

// Reemplaza con tu clave pública de Stripe real
const STRIPE_PUBLISHABLE_KEY = "pk_test_51RoVzEEyxy0aDZQhBP3UTNyjf7OwPtnTWsB1iyf4o9vW62R5QrXsoHCnuc6vWk2nXr8gM6egI9qC17YIcn5S7dap0007IRv1uj";

const PaymentScreen = () => {
  // Inicializa el hook useStripe
  const { confirmPaymentSheetPayment } = useStripe(); // Puedes usar initPaymentSheet y presentPaymentSheet para PaymentSheet UI completa, pero para CardField, confirmPaymentSheetPayment es directo.

  // Estados para los campos del formulario
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  // Estados para mensajes y modales
  const [paymentMessage, setPaymentMessage] = useState('');
  const [isPaymentSuccessModalVisible, setPaymentSuccessModalVisible] = useState(false);
  const [isReceiptModalVisible, setReceiptModalVisible] = useState(false);
  const [loading, setLoading] = useState(false); // Estado para el indicador de carga
  const [cardDetails, setCardDetails] = useState(null); // Para almacenar los detalles de la tarjeta del CardField

  // Función para obtener el clientSecret del PaymentIntent desde tu backend
  const fetchPaymentIntentClientSecret = async () => {
    setLoading(true);
    try {
      // 1️⃣ Solicita el PaymentIntent desde tu servidor
      // Asegúrate de que tu endpoint de backend retorne un objeto JSON con 'clientSecret'
      const response = await fetch("http://localhost:53481/api/stripe/create-payment-intent?amount=5000&currency=usd", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Aquí podrías enviar detalles del usuario o del pedido si tu backend lo necesita
        body: JSON.stringify({ amount: 5000, currency: 'usd', name, email, address }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener el client secret');
      }

      const { clientSecret: newClientSecret } = await response.json();
      setLoading(false);
      return newClientSecret;
    } catch (error) {
      setLoading(false);
      setPaymentMessage(`❌ Error al obtener el Payment Intent: ${error.message}`);
      return null;
    }
  };

  // Función principal para manejar el pago
  const handlePayment = async () => {
    // Valida que los detalles de la tarjeta estén completos antes de intentar el pago
    if (!cardDetails?.complete) {
      setPaymentMessage("Por favor, ingresa los detalles completos de la tarjeta.");
      return;
    }

    setPaymentMessage("Procesando pago...");
    setLoading(true);

    try {
      const newClientSecret = await fetchPaymentIntentClientSecret();
      if (!newClientSecret) {
        setLoading(false);
        return;
      }

      // 2️⃣ Confirma el pago con Stripe usando los datos del CardField
      const { paymentIntent, error } = await confirmPaymentSheetPayment(newClientSecret, {
        paymentMethodType: 'Card', // Especifica el tipo de método de pago
      });

      if (error) {
        setPaymentMessage(`❌ Error: ${error.message}`);
        Alert.alert("Error de Pago", error.message);
      } else if (paymentIntent.status === "Succeeded") {
        setPaymentMessage("✅ Pago exitoso!");
        setPaymentSuccessModalVisible(true); // Muestra el modal de éxito

        // 3️⃣ Guarda la orden en tu backend
        // Adapta esta URL y método según tu backend
        const saveOrderResponse = await fetch(`http://localhost:53481/saveOrder?paymentIntentId=${paymentIntent.id}`, {
          method: "GET", // O POST si necesitas enviar más datos
        });

        if (saveOrderResponse.ok) {
          console.log("Orden guardada exitosamente.");
        } else {
          console.error("Error al guardar la orden.");
          Alert.alert("Error", "No se pudo guardar la orden.");
        }
      } else {
        setPaymentMessage(`Estado del pago: ${paymentIntent.status}`);
      }
    } catch (error) {
      setPaymentMessage(`Error durante el proceso de pago: ${error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Funciones para controlar la visibilidad de los modales
  const closeModal = () => {
    setPaymentSuccessModalVisible(false);
  };

  const saveOrderAndShowReceiptModal = () => {
    closeModal(); // Cierra el modal de éxito de pago
    setReceiptModalVisible(true); // Abre el modal de recibo
  };

  const closeReceiptModal = () => {
    setReceiptModalVisible(false);
  };

  // Función para enviar el recibo por correo (llama a tu backend)
  const sendReceipt = async () => {
    setLoading(true);
    try {
      const amount = 50.00; // Esto debería venir idealmente de tu backend o de una fuente dinámica
      const response = await fetch("http://localhost:53481/api/email/enviar-factura", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded", // Formato para URLSearchParams
        },
        body: new URLSearchParams({
          nombre: name,
          email: email,
          monto: amount,
        }).toString(),
      });

      if (response.ok) {
        Alert.alert("Éxito", "✅ Recibo enviado exitosamente.");
      } else {
        Alert.alert("Error", "❌ No se pudo enviar el recibo.");
      }
    } catch (error) {
      console.error("Error al enviar el recibo:", error);
      Alert.alert("Error", "Error al enviar el recibo.");
    } finally {
      setLoading(false);
      closeReceiptModal();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.form}>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.title}>Datos de Facturación</Text>
              <View style={styles.inputBox}>
                <Text style={styles.inputLabel}>Nombre Completo:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ingrese su nombre"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words" // Capitaliza la primera letra de cada palabra
                />
              </View>
              <View style={styles.inputBox}>
                <Text style={styles.inputLabel}>Email:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Inserte su Email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none" // No capitaliza automáticamente
                />
              </View>
              <View style={styles.inputBox}>
                <Text style={styles.inputLabel}>Dirección:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Calle - Ciudad - País"
                  value={address}
                  onChangeText={setAddress}
                />
              </View>
            </View>

            <View style={styles.column}>
              <Text style={styles.title}>Método de Pago</Text>
              <View style={styles.inputBox}>
                <Text style={styles.inputLabel}>Ingresa tu Tarjeta:</Text>
                {/* CardField de Stripe para la entrada segura de la tarjeta */}
                <CardField
                  postalCodeEnabled={false} // Habilita o deshabilita el código postal si es necesario
                  onCardChange={(cardDetails) => {
                    // console.log('Detalles de la tarjeta', cardDetails); // Útil para depurar
                    setCardDetails(cardDetails);
                  }}
                  style={styles.cardField}
                />
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={handlePayment}
            disabled={loading} // Deshabilita el botón si está cargando
          >
            {loading ? (
              <ActivityIndicator color="#fff" /> // Muestra un spinner mientras carga
            ) : (
              <Text style={styles.btnText}>Pagar Ahora</Text>
            )}
          </TouchableOpacity>
          {paymentMessage ? (
            <Text style={[styles.paymentMessage, paymentMessage.startsWith('❌') ? styles.errorText : styles.successText]}>
              {paymentMessage}
            </Text>
          ) : null}
        </View>

        {/* Modal de Pago Completado */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={isPaymentSuccessModalVisible}
          onRequestClose={closeModal} // Permite cerrar el modal con el botón de retroceso de Android
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeButtonText}>&times;</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>✅ ¡Pago Completado!</Text>
              <Text style={styles.modalText}>Tu pago ha sido procesado correctamente.</Text>
              <TouchableOpacity style={styles.modalBtn} onPress={saveOrderAndShowReceiptModal}>
                <Text style={styles.btnText}>Aceptar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal para enviar recibo por correo */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={isReceiptModalVisible}
          onRequestClose={closeReceiptModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.closeButton} onPress={closeReceiptModal}>
                <Text style={styles.closeButtonText}>&times;</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>📧 ¿Deseas un recibo por correo?</Text>
              <Text style={styles.modalText}>Se enviará al correo que ingresaste.</Text>
              <TouchableOpacity style={styles.modalBtn} onPress={sendReceipt}>
                <Text style={styles.btnText}>Sí, enviar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

// Envuelve tu componente principal con StripeProvider
// Esto es crucial para que Stripe funcione en tu aplicación
const App = () => (
  <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
    <PaymentScreen />
  </StripeProvider>
);

// Estilos de React Native (similares a CSS)
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f6f9fc',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  form: {
    width: '100%',
    maxWidth: 700,
    padding: 30,
    backgroundColor: '#1c1c2e',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#7b68ee',
    shadowColor: '#7b68ee',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 5, // Para Android (sombra)
  },
  row: {
    flexDirection: 'column', // Cambiado a 'column' para una mejor disposición en móviles. En pantallas grandes podría ser 'row'.
    gap: 24,
    marginBottom: 24,
  },
  column: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 10,
  },
  inputBox: {
    marginTop: 16,
  },
  inputLabel: {
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
  cardField: {
    width: '100%',
    height: 50, // Altura requerida para CardField
    borderWidth: 2,
    borderColor: '#7b68ee',
    borderRadius: 8,
    backgroundColor: '#2a2a40',
    padding: 12, // El padding dentro del CardField
    color: '#ffffff', // Color del texto de entrada de la tarjeta
  },
  btn: {
    marginTop: 32,
    width: '100%',
    padding: 14,
    backgroundColor: '#635bff',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDisabled: {
    opacity: 0.7, // Estilo para el botón deshabilitado
  },
  btnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
  paymentMessage: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 14,
  },
  errorText: {
    color: '#EF4444', // Rojo
  },
  successText: {
    color: '#22C55E', // Verde
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(10, 37, 64, 0.4)',
    // backdropFilter: 'blur(4px)', // backdropFilter no es directamente compatible en RN, necesitarías una librería o usar un overlay semi-transparente
  },
  modalContent: {
    backgroundColor: '#1c1c2e',
    padding: 32,
    borderRadius: 12,
    width: '90%',
    maxWidth: 480,
    borderWidth: 2,
    borderColor: '#7b68ee',
    shadowColor: '#7b68ee',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 5,
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#334155',
    borderRadius: 16, // Hace que sea un círculo
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 18,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 12,
  },
  modalText: {
    fontSize: 15,
    color: '#e2e8f0',
    marginBottom: 24,
    textAlign: 'center',
  },
  modalBtn: {
    backgroundColor: '#635bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;