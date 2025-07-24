import React, { useState } from "react";
import api from '../../Src/Service/Conexion'
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

const RecuperarPassword = ({ navigation }) => { 
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRecuperarPassword = async () => {
    if (!email) {
      Alert.alert("Campo vacío", "Por favor, ingresa tu correo electrónico.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/password/email", { email });
      Alert.alert("Éxito", "Se ha enviado un enlace para restablecer tu contraseña a tu correo electrónico.");
      navigation.navigate("Login"); // Redirigir a la pantalla de inicio de sesión
    } catch (error) {
      Alert.alert("Error", error.response ? error.response.data.message : "Error al enviar el correo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar Contraseña</Text>
      <Text style={styles.instructionText}>Ingresa tu correo electrónico para recibir instrucciones.</Text>
      <TextInput
        placeholder="Correo electrónico"
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TouchableOpacity onPress={handleRecuperarPassword} style={styles.button}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Enviar</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>Volver a Iniciar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#F5F8FA",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  instructionText: {
    fontSize: 16,
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#6A0DAD",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  link: {
    marginTop: 20,
    color: "#6A0DAD",
    textAlign: "center",
  },
});

export default RecuperarPassword;
