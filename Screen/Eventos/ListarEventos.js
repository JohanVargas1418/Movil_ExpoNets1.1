import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';

import HeaderComponent from '../../Components/HeaderComponent';
import ChatButtonComponent from '../../Components/ChatButtonComponent';
import MenuComponent from '../../Components/MenuComponent';
import { ListarEventos } from '../../Src/Services/EventoService';

const { width } = Dimensions.get('window');

export default function ListarEventosScreen() {
  const [showMenu, setShowMenu] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleMenu = () => setShowMenu(prev => !prev);

  useEffect(() => {
    const cargarEventos = async () => {
      const res = await ListarEventos();
      if (res.success) {
        setEvents(res.data);
      } else {
        setError(res.message || 'Error al cargar eventos');
      }
      setLoading(false);
    };
    cargarEventos();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#6A0DAD" />
        <Text style={styles.loaderText}>Cargando eventos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderComponent toggleMenu={toggleMenu} />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.titleContainer}>
          <Text style={styles.sectionTitle}>Eventos</Text>
        </View>

        {events.map(event => {
          const nombre = event.name || event.nombre;
          const fecha = event.date || event.fechaEvento;
          const direccion = event.address || event.direccion;
          const descripcion = event.description || event.descripcion;
          const imagenUrl = event.imagen
            ? `http://172.30.6.28:8000/storage/eventos/${event.imagen}`
            : null;

          return (
            <TouchableOpacity
              key={event.id}
              style={styles.eventCard}
              onPress={() => Alert.alert('Evento', `Has seleccionado: ${nombre}`)}
            >
              <Image
                source={
                  imagenUrl
                    ? { uri: imagenUrl }
                    : require('../../Src/AssetsProductos/Images/no-image.png')
                }
                style={styles.eventImage}
                onError={(e) =>
                  console.log('Error loading image:', e.nativeEvent.error)
                }
              />
              <View style={styles.eventDetails}>
                <Text style={styles.eventName}>{nombre}</Text>
                <Text style={styles.eventDate}>{fecha}</Text>

                {direccion ? (
                  <TouchableOpacity
                    onPress={() => {
                      const isLink = direccion.startsWith('http://') || direccion.startsWith('https://');
                      const url = isLink
                        ? direccion
                        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccion)}`;
                      Linking.openURL(url).catch(err => console.error('Error abriendo enlace:', err));
                    }}
                  >
                    <Text style={styles.eventAddressLink}>{direccion}</Text>
                  </TouchableOpacity>
                ) : null}

                <Text style={styles.eventDescription}>{descripcion}</Text>
              </View>

            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ChatButtonComponent />
      <MenuComponent isVisible={showMenu} onClose={toggleMenu} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F8FA", paddingTop: 60 },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 100,
  },
  titleContainer: {
    width: '100%',
    backgroundColor: '#6A0DAD',
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
    margin: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  eventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    width: width * 0.9,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    overflow: 'hidden',
  },
  eventImage: {
    width: '100%',
    height: width * 0.5,
    resizeMode: 'cover',
  },
  eventDetails: { padding: 20 },
  eventName: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  eventDate: { fontSize: 16, color: '#555', marginBottom: 5 },
  eventAddressLink: {
    fontSize: 16,
    color: '#6A0DAD',
    marginBottom: 10,
    textDecorationLine: 'underline',
  },
  eventDescription: { fontSize: 14, color: '#777', lineHeight: 20 },

  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loaderText: { marginTop: 10, fontSize: 16, color: "#6A0DAD" },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
