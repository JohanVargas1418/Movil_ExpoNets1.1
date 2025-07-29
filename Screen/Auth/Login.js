import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
  Animated, // Asegúrate de importar Animated
} from "react-native";
import BotonComponent from "../../Components/BotonComponent";
import HeaderComponent from "../../Components/HeaderComponent";
import FooterComponent from "../../Components/FooterComponent";
import MenuComponent from "../../Components/MenuComponent";
import ChatButtonComponent from "../../Components/ChatButtonComponent"; // Importar ChatButtonComponent
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { loginUser } from "../../Src/Services/AuthServeces"; // Importa la función de registro


export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showMenu, setShowMenu] = useState(false); // Estado para controlar la visibilidad del menú
  const rippleScale = new Animated.Value(0); // Asegúrate de inicializar rippleScale

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Campos Vacíos", "Por favor, ingresa tu correo electrónico y contraseña.");
      return;
    }
    setLoading(true); // Cambia el estado de carga a verdadero
    // Inicia la animación de onda
    Animated.loop(
      Animated.sequence([
        Animated.timing(rippleScale, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(rippleScale, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    try {
      // Llama a la función de inicio de sesión
      const result = await loginUser(email, password);
      if (result.success) {
        Alert.alert("Éxito", "¡Bienvenido!"); // Muestra un mensaje de éxito
        navigation.navigate("ListarProductos");
      } else {
        Alert.alert("Error", result.message || "Error al iniciar sesión"); // Muestra un mensaje de error
      }
    } catch (error) {
      Alert.alert("Error", "Error inesperado"); // Manejo de errores
    } finally {
      rippleScale.setValue(0); // Resetea el efecto de onda
      setLoading(false); // Cambia el estado de carga a falso
    }
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <HeaderComponent toggleMenu={toggleMenu} />

      <ScrollView contentContainerStyle={styles.scrollViewContent} style={styles.scrollView}>
        <View style={styles.card}>
          <Text style={styles.title}>Inicio de sesión</Text>
          <Text style={styles.instructionText}>Ingrese su correo electrónico y contraseña</Text>

          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="at-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                placeholder="Ingrese su correo electrónico"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                placeholderTextColor="#888"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Contraseña</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                placeholder="Ingrese su contraseña"
                secureTextEntry={!showPassword}
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholderTextColor="#888"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.passwordToggle}>
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          <BotonComponent
            title="Iniciar Ingresar"
            onPress={handleLogin}
            style={styles.loginButton}
          // disabled={!loading} // Desactiva el botón si está cargando

          />

          <View style={styles.linkContainer}>
            <Text style={styles.registerText}>Si aún no tiene cuenta con nosotros, </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Registro")}>
              <Text style={styles.registerLink}>regístrese aquí</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("RecuperarPassword")}>
            <Text style={styles.forgotPasswordLink}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

        </View>
        <FooterComponent />
      </ScrollView>
      <ChatButtonComponent />

      <MenuComponent isVisible={showMenu} onClose={toggleMenu} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F8FA",
  },
  scrollView: {
    flex: 1,
    width: '100%',
    marginTop: 60, // Espacio para el header fijo
    marginBottom: 90, // Espacio para el botón de chat flotante
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 30,
    width: "90%",
    maxWidth: 400,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: 20,
    margin: 30, // Añadido para dar espacio alrededor del card
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  instructionText: {
    fontSize: 14,
    color: "#777",
    marginBottom: 30,
    textAlign: "center",
  },
  formGroup: {
    width: "100%",
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
    fontWeight: "600",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 50,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: "#F8F8F8",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "#333",
    fontSize: 14,
  },
  passwordToggle: {
    padding: 5,
  },
  loginButton: {
    backgroundColor: "#6A0DAD",
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 10,
  },
  linkContainer: {
    flexDirection: "row",
    marginTop: 25,
    alignItems: "center",
    justifyContent: "center",
    flexWrap: 'wrap',
    width: '100%',
  },
  registerText: {
    fontSize: 15,
    color: "#555",
    textAlign: 'center',
    flexShrink: 1,
  },
  registerLink: {
    fontSize: 15,
    color: "#6A0DAD",
    fontWeight: "bold",
  },
  forgotPasswordLink: {
    fontSize: 15,
    color: "#6A0DAD",
    fontWeight: "bold",
    marginTop: 15,
  },
});