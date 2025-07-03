import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

export default function FooterComponent() {
  return (
    <View style={styles.footer}>
      {/* Placeholder para el logo "EXPO NETS" en el footer */}
      <Text style={styles.footerLogoText}>EXPO NETS</Text>
      <Text style={styles.footerText}>Colombia, Duitama-Boyacá</Text>
      <Text style={styles.footerText}>Teléfono: +57 3023191537</Text>
      <Text style={styles.footerText}>Email: exponets024@gmail.com</Text>

      <Text style={styles.footerSectionTitle}>Enlaces de interés</Text>
      <TouchableOpacity onPress={() => Alert.alert("Navegación", "Simulando ir a Acerca de Nosotros")}><Text style={styles.footerLink}>Acerca de Nosotros</Text></TouchableOpacity>
      <TouchableOpacity onPress={() => Alert.alert("Navegación", "Simulando ir a Team")}><Text style={styles.footerLink}>Team</Text></TouchableOpacity>
      <TouchableOpacity onPress={() => Alert.alert("Navegación", "Simulando ir a Contacto")}><Text style={styles.footerLink}>Contacto</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    width: "100%",
    alignItems: "center",
    paddingTop: 30,
    paddingBottom: 20,
    backgroundColor: "#F5F8FA",
    // marginTop: 20, // Eliminado para consistencia con LoginScreen (o se añade a ambos)
  },
  footerLogoText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#6A0DAD",
    marginBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  footerSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
    marginBottom: 10,
  },
  footerLink: {
    fontSize: 14,
    color: "#007BFF",
    marginBottom: 5,
  },
});
