import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from "react-native";
import HeaderComponent from "../../Components/HeaderComponent"; // Importar el HeaderComponent
import ChatButtonComponent from "../../Components/ChatButtonComponent"; // Importar el ChatButtonComponent
import MenuComponent from "../../Components/MenuComponent"; // Importar el MenuComponent
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window'); // Obtener el ancho de la pantalla

export default function ListarEventos() {
  const [showMenu, setShowMenu] = useState(false); // Estado para controlar la visibilidad del menú

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  // Datos de ejemplo para los eventos
  const events = [
    {
      id: '1',
      name: 'Apifloren',
      date: '2025-04-15',
      address: 'Calle 16 N 3 - 46',
      description: 'Descripción: Presentación Microempresa Apifloren',
      image: require('../../Src/AssetsProductos/Images/miel.jpg'), // Asegúrate de tener esta imagen local
    },
    {
      id: '2',
      name: 'Salvita',
      date: '2025-05-20',
      address: 'Carrera 5 # 10-20',
      description: 'Descripción: Degustación de productos orgánicos de Salvita',
      image: require('../../Src/AssetsProductos/Images/BatidoMango.jpeg'), // Asegúrate de tener esta imagen local
    },
    {
      id: '3',
      name: 'Expo Innovación',
      date: '2025-06-01',
      address: 'Centro de Convenciones',
      description: 'Descripción: Feria de innovación tecnológica y emprendimiento',
      image: 'https://placehold.co/300x200/F5F8FA/000000?text=Expo+Innovacion', // Placeholder si no tienes imagen local
    },
    {
      id: '4',
      name: 'Mercado Campesino',
      date: '2025-07-10',
      address: 'Plaza Principal',
      description: 'Descripción: Venta directa de productos del campo por agricultores locales',
      image: 'https://placehold.co/300x200/F5F8FA/000000?text=Mercado+Campesino', // Placeholder si no tienes imagen local
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header Component */}
      <HeaderComponent toggleMenu={toggleMenu} />

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Título de la sección */}
        <View style={styles.titleContainer}>
          <Text style={styles.sectionTitle}>Eventos</Text>
        </View>

        {/* Lista de Eventos */}
        {events.map(event => (
          <TouchableOpacity key={event.id} style={styles.eventCard} onPress={() => Alert.alert("Evento", `Has seleccionado: ${event.name}`)}>
            <Image
              source={event.image}
              style={styles.eventImage}
              onError={(e) => console.log('Error loading image:', e.nativeEvent.error)}
              defaultSource={require('../../Src/AssetsProductos/Images/no-image.png')} // Fallback image local
            />
            <View style={styles.eventDetails}>
              <Text style={styles.eventName}>{event.name}</Text>
              <Text style={styles.eventDate}>{event.date}</Text>
              <Text style={styles.eventAddress}>{event.address}</Text>
              <Text style={styles.eventDescription}>{event.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Chat Button Component */}
      <ChatButtonComponent />

      {/* Menu Component */}
      <MenuComponent isVisible={showMenu} onClose={toggleMenu} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F8FA",
    paddingTop: 60, // Espacio para el header fijo
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 100, // Espacio para el botón de chat
  },
  titleContainer: {
    width: '100%',
    backgroundColor: '#6A0DAD', // Color de fondo del título
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
    margin:40,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF', // Color del texto del título
  },
  eventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    width: width * 0.9, // Ocupa el 90% del ancho de la pantalla
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    overflow: 'hidden', // Asegura que la imagen no se salga de los bordes redondeados
  },
  eventImage: {
    width: '100%',
    height: width * 0.5, // Altura de la imagen (ej. 50% del ancho)
    resizeMode: 'cover',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  eventDetails: {
    padding: 20,
  },
  eventName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  eventDate: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  eventAddress: {
    fontSize: 16,
    color: '#6A0DAD', // Color distintivo para la dirección
    marginBottom: 10,
  },
  eventDescription: {
    fontSize: 14,
    color: '#777',
    lineHeight: 20,
  },
});
