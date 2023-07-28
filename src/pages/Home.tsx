import React, { useEffect, useState } from 'react';
import { IonButtons, IonContent, IonHeader, IonRefresher, IonLabel, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { Geolocation} from '@capacitor/geolocation';
import logo from '../assets/logo.svg';
import { sincronizarFormulariosLLenos } from '../models/sincronization';
interface Location {
  latitude: number;
  longitude: number;
}

const Inicio: React.FC = () => {
  useEffect(() => {
    requestPermission();
  }, []);


  useEffect(() => {
    // Llamar a la función sincronizarFormulariosLLenos cuando se monte esta página
    sincronizarFormulariosLLenos();
  }, []);
  
  const requestPermission = async () => {
    try {
      const permission = await Geolocation.requestPermissions();
      console.log('Permission result:', permission);
    } catch (error) {
      console.log('Error requesting permission:', error);
    }
  };

  const [location, setLocation] = useState<Location | null>(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const position = await Geolocation.getCurrentPosition();
      const { latitude, longitude } = position.coords;
      setLocation({ latitude, longitude });
    } catch (error) {
      console.log('Error getting current location:', error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton></IonMenuButton>
          </IonButtons>
          <IonTitle>Inicio</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>

      <div style={{ background: 'linear-gradient(to left, #000000, #808080)', 
      display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img src={logo} alt="Custom SVG" />
      </div>


        {location && (
          <div>
            <IonLabel>Latitude: {location.latitude}</IonLabel>
            <IonLabel>Longitude: {location.longitude}</IonLabel>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Inicio;
