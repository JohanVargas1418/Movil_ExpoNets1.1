import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput, // Aunque no se usa directamente en este snippet, se mantiene por si se añade búsqueda
  ActivityIndicator,
  Alert,
  Linking, // Importa Linking para abrir URLs
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native"; // No se usa useRoute aquí directamente, pero es común

// Eliminado: import HeaderComponent from "../../Components/HeaderComponent"; // El encabezado lo gestiona StackNavigator
import ChatButtonComponent from "../../Components/ChatButtonComponent";
import MenuComponent from "../../Components/MenuComponent";

import { ListarEventos } from "../../Src/Services/EventoService"; // Asegúrate de que esta ruta sea correcta

const { width } = Dimensions.get('window');

export default function ListarEventosScreen() {
  const navigation = useNavigation();
  const [showMenu, setShowMenu] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleMenu = () => setShowMenu(prev => !prev);

  useEffect(() => {
    // Configurar el botón de menú en el encabezado de la navegación
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={styles.menuButtonHeader} onPress={toggleMenu}>
          <Ionicons name="menu-outline" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      ),
    });

    const cargarEventos = async () => {
      setLoading(true);
      setError(null); // Limpiar errores previos
      const res = await ListarEventos();
      if (res.success) {
        setEvents(res.data);
      } else {
        setError(res.message || 'Error al cargar eventos');
        Alert.alert("Error de Carga", res.message || "No se pudieron cargar los eventos.");
      }
      setLoading(false);
    };
    cargarEventos();
  }, [navigation]); // Dependencia 'navigation' para el useEffect de setOptions

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
        <Text style={styles.errorText}>Ha ocurrido un error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => {
          setLoading(true); // Intentar cargar de nuevo
          setError(null);
          // Recargar eventos
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
        }}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* El HeaderComponent interno ha sido eliminado, el encabezado lo gestiona StackNavigator */}

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* El título de la sección ha sido eliminado, el título lo gestiona StackNavigator */}

        {events.length === 0 ? (
          <Text style={styles.noEventsText}>No hay eventos disponibles en este momento.</Text>
        ) : (
          events.map(event => {
            const nombre = event.name || event.nombre;
            const fecha = event.date || event.fechaEvento;
            const direccion = event.address || event.direccion;
            const descripcion = event.description || event.descripcion;
            const imagenUrl = event.imagen
              ? `http://172.30.6.28:8000/storage/imagenes/${event.imagen}` // Asegúrate de que esta IP y ruta sean correctas
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
                      : require('../../Src/AssetsProductos/Images/no-image.png') // Fallback local
                  }
                  style={styles.eventImage}
                  onError={(e) =>
                    console.log('Error cargando imagen:', e.nativeEvent.error)
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
          })
        )}
      </ScrollView>

      <ChatButtonComponent />
      <MenuComponent isVisible={showMenu} onClose={toggleMenu} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F8FA",
    paddingTop: 0, // No se necesita padding superior aquí, el StackNavigator maneja el encabezado
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 100, // Espacio para el botón de chat
    paddingTop: 20, // Añadido un padding superior para el contenido debajo del header de StackNavigator
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
  eventAddressLink: { // Estilo para la dirección que ahora es un enlace
    fontSize: 16,
    color: '#6A0DAD',
    marginBottom: 10,
    textDecorationLine: 'underline',
  },
  eventDescription: {
    fontSize: 14,
    color: '#777',
    lineHeight: 20,
  },
  menuButtonHeader: { // Estilo para el botón de menú en el encabezado de StackNavigator
    paddingRight: 15, // Espacio a la derecha del botón
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#F5F8FA", // Fondo similar al de la app
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: "#6A0DAD",
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#F5F8FA",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#D32F2F', // Un color rojo para errores
    textAlign: 'center',
    marginBottom: 15,
  },
  retryButton: {
    backgroundColor: '#6A0DAD',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noEventsText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
    width: '100%',
  },
});