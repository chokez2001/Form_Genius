import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel } from '@ionic/react';
import { obtenerFormulariosVacios } from '../models/dababase';

const FormulariosVaciosPage: React.FC = () => {
  const [formulariosVacios, setFormulariosVacios] = useState<any[]>([]);

  useEffect(() => {
    const fetchFormulariosVacios = async () => {
      try {
        const result = await obtenerFormulariosVacios();
        setFormulariosVacios(result);
      } catch (error) {
        console.error('Error al obtener los formularios vacíos:', error);
      }
    };

    fetchFormulariosVacios();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Formularios Vacíos</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {formulariosVacios.map((formulario, index) => (
            <IonItem key={index}>
              <IonLabel>{JSON.stringify(formulario)}</IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default FormulariosVaciosPage;
