import { Geolocation } from '@capacitor/geolocation';

const obtenerUbicacionActual = async () => {
  try {
    let ubicacionPrecisa = true; // Bandera para indicar si la ubicación es precisa

    const posicion = await Geolocation.getCurrentPosition();
    const latitud = posicion.coords.latitude;
    const longitud = posicion.coords.longitude;

    // Verificar si no hay conexión a Internet y establecer la bandera en false
    if (!navigator.onLine) {
      ubicacionPrecisa = false;
    }

    console.log('Ubicación actual:');
    console.log('Latitud:', latitud);
    console.log('Longitud:', longitud);

    if (!ubicacionPrecisa) {
      console.log('La ubicación puede no ser precisa debido a la falta de conexión a Internet');
    }

    // Resto de tu lógica
  } catch (error) {
    console.error('Error al obtener la ubicación:', error);
  }
};
