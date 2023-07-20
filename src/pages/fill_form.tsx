import React, { useState, useRef} from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonInput, IonTextarea, IonDatetime, IonCheckbox, IonButton } from '@ionic/react';
import { useLocation, useHistory } from 'react-router-dom';
import { guardarFormularioLleno } from '../models/dababase'; // Import the guardarFormularioLleno function

interface LocationState {
  formularioSeleccionado: any;
}

const DetalleFormularioPage: React.FC = () => {
  const location = useLocation<LocationState>();
  const history = useHistory();
  const { formularioSeleccionado } = location.state || { formularioSeleccionado: null };
  const [formularioLleno, setFormularioLleno] = useState<any | null>(null);

  // Use useRef to create a mutable reference to the form data
  const formularioLlenoRef = useRef<any | null>({
    ...formularioSeleccionado,
    campos: Object.keys(formularioSeleccionado.campos).reduce((acc: any, campo) => {
      acc[campo] = { ...formularioSeleccionado.campos[campo], value: '' };
      return acc;
    }, {})
  });

  if (!formularioSeleccionado) {
    return <div>Formulario no encontrado.</div>;
  }

  const handleChange = (campo: string, value: any) => {
    formularioLlenoRef.current.campos[campo].value = value;
  };

  const handleSubmit = async () => {
    try {
      // Call the function to save the filled form
      await guardarFormularioLleno(formularioLlenoRef.current);

      // Navigate back to the previous page or any other desired destination
      history.push('/pages/empty_forms');
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
          {Object.keys(formularioLlenoRef.current.campos).map((campo, index) => {
            const campoConfig = formularioLlenoRef.current.campos[campo];
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
                    {campoConfig.opciones.split(',').map((opcion: string, index: React.Key | null | undefined) => (
                      <IonItem key={index}>
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
                              updatedOptions = selectedOptions.filter((opt: string) => opt !== opcion);
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
