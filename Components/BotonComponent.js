// Components/BotonComponent.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Importar Ionicons

export default function BotonComponent({
  title,
  onPress,
  style,
  textStyle,
  disabled = false, // Por defecto, el botón no está deshabilitado
  isLoading = false, // Por defecto, el botón no está cargando
  iconName,          // Nuevo prop: nombre del icono (ej. "add-circle-outline")
  iconColor = '#fff',// Nuevo prop: color del icono
  iconSize = 20,     // Nuevo prop: tamaño del icono
  iconPosition = 'left' // Nuevo prop: posición del icono ('left' o 'right')
}) {
  return (
    <TouchableOpacity
      style={[styles.button, style, (disabled || isLoading) && styles.buttonDisabled]}
      onPress={onPress}
      disabled={disabled || isLoading} // El botón se deshabilita si `disabled` es true o si `isLoading` es true
      activeOpacity={0.7}
    >
      {isLoading ? ( // Si está cargando, muestra el ActivityIndicator
        <ActivityIndicator color="#fff" />
      ) : (
        <React.Fragment>
          {/* Muestra el icono si se proporciona y está a la izquierda */}
          {iconName && iconPosition === 'left' && (
            <Ionicons name={iconName} size={iconSize} color={iconColor} style={styles.iconLeft} />
          )}
          <Text style={[styles.text, textStyle]}>{title}</Text>
          {/* Muestra el icono si se proporciona y está a la derecha */}
          {iconName && iconPosition === 'right' && (
            <Ionicons name={iconName} size={iconSize} color={iconColor} style={styles.iconRight} />
          )}
        </React.Fragment>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007BFF', // Color por defecto (puede ser sobrescrito por `style` prop)
    paddingVertical: 12, // Ajustado para mejor altura
    paddingHorizontal: 20,
    borderRadius: 8, // Bordes más redondeados
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row', // Para alinear el icono y el texto
    minHeight: 50, // Asegura una altura mínima
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3, // Sombra para Android
  },
  buttonDisabled: {
    backgroundColor: '#A0A0A0', // Color cuando el botón está deshabilitado
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold', // Texto del botón en negrita
  },
  iconLeft: {
    marginRight: 8, // Espacio entre el icono y el texto cuando el icono está a la izquierda
  },
  iconRight: {
    marginLeft: 8, // Espacio entre el icono y el texto cuando el icono está a la derecha
  },
});