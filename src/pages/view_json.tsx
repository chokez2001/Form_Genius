import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel } from '@ionic/react';
import { useEffect, useState } from 'react';
import { obtenerFormulario } from '../models/dababase';

const FormPage: React.FC = () => {
  const [formularios, setFormularios] = useState<any[]>([]);

  useEffect(() => {
    obtenerFormulariosExistentes();
  }, []);

  const obtenerFormulariosExistentes = async () => {
    const formulariosIds = ['formulario1', 'formulario2']; // IDs de los formularios existentes

    const obtenerFormulariosPromises = formulariosIds.map((formularioId) => obtenerFormulario(formularioId));

    const formulariosObtenidos = await Promise.all(obtenerFormulariosPromises);
    setFormularios(formulariosObtenidos.filter((formulario) => formulario !== null));
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Visualizar Formularios</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {formularios.map((formulario, index) => (
            <IonItem key={index}>
              <IonLabel>
                <h2>{formulario.nombre}</h2>
                <ul>
                  {formulario.campos.map((campo: any, campoIndex: number) => (
                    <li key={campoIndex}>
                      <span>{campo.etiqueta}: </span>
                      <span>{campo.valor}</span>
                    </li>
                  ))}
                </ul>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default FormPage;
