import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonInput, IonTextarea, IonDatetime, IonCheckbox, IonButton } from '@ionic/react';
import { useHistory, useLocation } from 'react-router-dom';
import { guardarFormularioLleno } from '../models/dababase';

interface LocationState {
  formularioSeleccionado: any;
}

const DetalleFormularioPage: React.FC = () => {
  const history = useHistory();
  const location = useLocation<LocationState>();
  const { formularioSeleccionado } = location.state || { formularioSeleccionado: null };

  const [formularioLleno, setFormularioLleno] = useState<any | null>(null);

  if (!formularioSeleccionado) {
    return <div>Formulario no encontrado.</div>;
  }

  const handleChange = (campo: string, value: any) => {
    setFormularioLleno((prevForm: { campos: { [x: string]: any; }; }) => ({
      ...prevForm,
      campos: {
        ...prevForm.campos,
        [campo]: {
          ...prevForm.campos[campo],
          value: value,
        },
      },
    }));
  };

  const handleSubmit = async () => {
    try {
      // Call the function to save the filled form
      await guardarFormularioLleno(formularioLleno);

      // Navigate back to the previous page or any other desired destination
      history.push('/pages/fill');
    } catch (error) {
      console.error('Error al guardar el formulario lleno:', error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Detalle del Formulario</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {Object.keys(formularioSeleccionado.campos).map((campo, index) => {
            const campoConfig = formularioSeleccionado.campos[campo];
            return (
              <IonItem key={index}>
                <IonLabel position="floating">{campo}</IonLabel>
                {campoConfig.tipo === 'short_text' && (
                  <IonInput type="text" value={campoConfig.value} onIonChange={(e) => handleChange(campo, e.detail.value)} />
                )}
                {campoConfig.tipo === 'long_text' && (
                  <IonTextarea value={campoConfig.value} onIonChange={(e) => handleChange(campo, e.detail.value)} />
                )}
                {campoConfig.tipo === 'date_picker' && (
                  <IonDatetime value={campoConfig.value} onIonChange={(e) => handleChange(campo, e.detail.value)} />
                )}
                {campoConfig.tipo === 'checkbox' && (
                  <>
                    {campoConfig.opciones.split(',').map((opcion: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined, optionIndex: React.Key | null | undefined) => (
                      <IonItem key={optionIndex}>
                        <IonLabel>{opcion}</IonLabel>
                        <IonCheckbox
                          slot="start"
                          checked={campoConfig.value?.includes(opcion) || false}
                          onIonChange={(e) => {
                            const checked = e.detail.checked;
                            const selectedOptions = campoConfig.value || [];
                            let updatedOptions;
                            if (checked) {
                              updatedOptions = [...selectedOptions, opcion];
                            } else {
                              updatedOptions = selectedOptions.filter((opt: string | number | boolean | React.ReactPortal | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined) => opt !== opcion);
                            }
                            handleChange(campo, updatedOptions);
                          }}
                        />
                      </IonItem>
                    ))}
                  </>
                )}
              </IonItem>
            );
          })}
        </IonList>
        <IonButton expand="full" onClick={handleSubmit}>
          Guardar
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default DetalleFormularioPage;
