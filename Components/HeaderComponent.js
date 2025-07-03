import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // Importar useNavigation

export default function HeaderComponent({ toggleMenu }) {
  const navigation = useNavigation(); // Obtener la instancia de navegación aquí

  return (
    <View style={styles.header}>
      {/* Botón de Login en el Header, ahora funcional */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Login")}>
        <Ionicons name="log-in-outline" size={24} color="#6A0DAD" />
        <Text style={styles.backButtonText}>login</Text>
      </TouchableOpacity>
      <Text style={styles.logoText}>EXPONETS</Text>
      <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
        <Ionicons name="menu-outline" size={28} color="#6A0DAD" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 30,
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    zIndex: 1,
    backgroundColor: "#F5F8FA",
    height: 100,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: "#6A0DAD",
    marginLeft: 5,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6A0DAD",
  },
  menuButton: {
    // Estilos si es necesario para el botón de menú
  },
});
