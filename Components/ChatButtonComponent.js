import React from 'react';
import { StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ChatButtonComponent() {
  return (
    <TouchableOpacity style={styles.chatButton} onPress={() => Alert.alert("Chat", "Abriendo chat de soporte")}>
      <Ionicons name="chatbubble-ellipses-outline" size={30} color="#fff" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chatButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: "#6A0DAD",
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
    zIndex: 10,
  },
});
