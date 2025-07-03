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
} from "react-native";
import BotonComponent from "../../Components/BotonComponent";
import HeaderComponent from "../../Components/HeaderComponent";
import FooterComponent from "../../Components/FooterComponent";
import MenuComponent from "../../Components/MenuComponent";
import ChatButtonComponent from "../../Components/ChatButtonComponent";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
// import { Picker } from '@react-native-picker/picker'; // Eliminada la importación del Picker

export default function RegisterScreen() {
  const navigation = useNavigation();
  const [nombres, setNombres] = useState("");
  const [email, setEmail] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  // const [rol, setRol] = useState("cliente"); // Eliminado el estado 'rol'
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showMenu, setShowMenu] = useState(false); // Estado para controlar la visibilidad del menú

  const handleRegister = async () => {
    if (!nombres || !email || !direccion || !telefono || !password) {
      Alert.alert("Campos Vacíos", "Por favor, completa todos los campos.");
      return;
    }

    setLoading(true);
    // Simulación de una llamada a API
    setTimeout(() => {
      setLoading(false);
      Alert.alert("Éxito", "¡Registro exitoso! Simulación de creación de cuenta.");
      // Aquí podrías simular la navegación de vuelta al login:
      navigation.navigate("Login");
    }, 2000); // Simula un retardo de 2 segundos
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
          <Text style={styles.title}>Registro de Usuario</Text>
          <Text style={styles.instructionText}>Registre sus datos</Text>

          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Nombres</Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Ingrese sus nombres"
                style={styles.input}
                value={nombres}
                onChangeText={setNombres}
                editable={!loading}
                placeholderTextColor="#888"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Ingrese su correo electrónico"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                editable={!loading}
                placeholderTextColor="#888"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Dirección</Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Ingrese su domicilio"
                style={styles.input}
                value={direccion}
                onChangeText={setDireccion}
                editable={!loading}
                placeholderTextColor="#888"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Teléfono</Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Ingrese su número telefónico"
                style={styles.input}
                keyboardType="phone-pad"
                value={telefono}
                onChangeText={setTelefono}
                editable={!loading}
                placeholderTextColor="#888"
              />
            </View>
          </View>

          {/* Eliminado el Picker para el rol */}
          {/* <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Rol</Text>
            <View style={styles.inputContainer}>
              <Picker
                selectedValue={rol}
                style={styles.picker}
                onValueChange={(itemValue, itemIndex) => setRol(itemValue)}
                // enabled={!loading}
              >
                <Picker.Item label="Selecciona un rol" value="placeholder" />
                <Picker.Item label="Cliente" value="cliente" />
                <Picker.Item label="Administrador" value="administrador" />
                <Picker.Item label="Vendedor" value="vendedor" />
              </Picker>
            </View>
          </View> */}

          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Contraseña</Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Ingrese su contraseña"
                secureTextEntry={!showPassword}
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                editable={!loading}
                placeholderTextColor="#888"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.passwordToggle}>
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          <BotonComponent
            title={loading ? <ActivityIndicator color="#fff" /> : "Guardar"}
            onPress={handleRegister}
            disabled={loading}
            style={styles.registerButton}
          />

          {/* Enlace para volver al login, funcional */}
          <TouchableOpacity onPress={() => navigation.navigate("Login")} style={styles.backToLoginContainer}>
            <Text style={styles.backToLoginText}>¿Ya tienes cuenta? </Text>
            <Text style={styles.backToLoginLink}>Iniciar Sesión</Text>
          </TouchableOpacity>
        </View>

        <FooterComponent />
      </ScrollView>

      {/* Usar el ChatButtonComponent */}
      <ChatButtonComponent />

      {/* Menú Modal ahora como un componente separado */}
      <MenuComponent isVisible={showMenu} onClose={toggleMenu} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F8FA",
  },
  // Header styles moved to HeaderComponent.js
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
    margin: 30,
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
  input: {
    flex: 1,
    color: "#333",
    fontSize: 14,
  },
  picker: { // Se mantiene el estilo picker aunque el componente ya no esté
    flex: 1,
    height: 50,
    width: '100%',
    color: "#333",
  },
  passwordToggle: {
    padding: 5,
  },
  registerButton: {
    backgroundColor: "#6A0DAD",
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 20,
  },
  backToLoginContainer: {
    flexDirection: "row",
    marginTop: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  backToLoginText: {
    fontSize: 15,
    color: "#555",
  },
  backToLoginLink: {
    fontSize: 15,
    color: "#6A0DAD",
    fontWeight: "bold",
  },
  // Footer styles moved to FooterComponent.js
  // chatButton styles moved to ChatButtonComponent.js
  // Menu styles moved to MenuComponent.js
});
