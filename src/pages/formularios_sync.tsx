import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonButton } from '@ionic/react';
import { obtenerFormulariosVacios, sincronizarFormulariosVacios } from '../models/sincronization';

const FormulariosVaciosSyncPage: React.FC = () => {
  const [formulariosVacios, setFormulariosVacios] = useState<any[]>([]);

  useEffect(() => {
    obtenerFormulariosVacios()
      .then((formularios) => {
        setFormulariosVacios(formularios);
      })
      .catch((error) => {
        console.error('Error al obtener los formularios vacíos:', error);
      });
  }, []);

  const handleSincronizar = () => {
    sincronizarFormulariosVacios()
      .then(() => {
        console.log('Sincronización de formularios vacíos completada');
      })
      .catch((error) => {
        console.error('Error al sincronizar los formularios vacíos:', error);
      });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Formularios Vacíos</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {formulariosVacios.map((formulario) => (
            <IonItem key={formulario.Id}>
              <IonLabel>{formulario.Nombre}</IonLabel>
            </IonItem>
          ))}
        </IonList>
        <IonButton expand="block" onClick={handleSincronizar}>Sincronizar con Firestore</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default FormulariosVaciosSyncPage;
