import React, { useState } from 'react';
import { View, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/MaterialIcons'; // or any other icon library

export default function ChatButtonComponent() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      {/* Circular Chat Button */}
      <TouchableOpacity style={styles.chatButton} onPress={() => setModalVisible(true)}>
        <Icon name="chat" size={30} color="white" />
      </TouchableOpacity>

      {/* Modal for Chat Window */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <WebView 
            source={{ uri: 'https://cdn.botpress.cloud/webchat/v3.1/shareable.html?configUrl=https://files.bpcontent.cloud/2025/04/01/13/20250401135651-DQW5SUXJ.json' }} 
            style={styles.webview} 
          />
          <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
            <Icon name="close" size={30} color="black" />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    bottom: 50,
    right: 20, // Changed from left: 20 to right: 20
  },
  chatButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6A0DAD',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 'auto',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  webview: {
    width: '100%',
    height: 500,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 10,
  },
});
