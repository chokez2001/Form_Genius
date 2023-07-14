import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { obtenerFormulariosVacios } from '../models/dababase';

const FormulariosVaciosPage: React.FC = () => {
  const [formulariosVacios, setFormulariosVacios] = useState<any[]>([]);
  const history = useHistory();

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

  const handleFormularioClick = (formulario: any) => {
    // Redirigir a la página de detalle del formulario y pasar los valores como estado
    history.push('/pages/fill_form', { formulario });
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
          {formulariosVacios.map((formulario, index) => (
            <IonItem key={index} onClick={() => handleFormularioClick(formulario)}>
              <IonLabel>{formulario.Nombre}</IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default FormulariosVaciosPage;
