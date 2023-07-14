import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonLabel } from '@ionic/react';
import { useLocation } from 'react-router-dom';

const LlenarFormulario: React.FC = () => {
  const location = useLocation<{ formulario: any }>();
  const { formulario } = location.state;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Detalle del Formulario</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonLabel>{JSON.stringify(formulario)}</IonLabel>
      </IonContent>
    </IonPage>
  );
};

export default LlenarFormulario;
