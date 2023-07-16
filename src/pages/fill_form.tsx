import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonInput, IonTextarea, IonDatetime, IonCheckbox, IonButton } from '@ionic/react';
import { useLocation } from 'react-router-dom';

const DetalleFormularioPage: React.FC = () => {
  const location = useLocation<{ formulario: any }>();
  const { formulario } = location.state;
  const [formularioLleno, setFormularioLleno] = useState<any>(null);

  const handleChange = (campo: string, value: any) => {
    setFormularioLleno((prevState: any) => ({
      ...prevState,
      clave_anidada: {
        ...prevState.clave_anidada,
        [campo]: {
          ...prevState.clave_anidada[campo],
          value: value
        }
      }
    }));
  };

  const handleSubmit = () => {
    // Aquí puedes guardar el formulario lleno en la base de datos o hacer lo que necesites con los valores
    console.log(formularioLleno);
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
          {Object.keys(formulario.clave_anidada).map((campo, index) => {
            const campoConfig = formulario.clave_anidada[campo];
            return (
              <IonItem key={index}>
                <IonLabel position="floating">{campo}</IonLabel>
                {campoConfig.tipo === 'short_text' && (
                  <IonInput type="text" onIonChange={(e) => handleChange(campo, e.detail.value)} />
                )}
                {campoConfig.tipo === 'long_text' && (
                  <IonTextarea  onIonChange={(e) => handleChange(campo, e.detail.value)} />
                )}
                {campoConfig.tipo === 'date_picker' && (
                  <IonDatetime  onIonChange={(e) => handleChange(campo, e.detail.value)} />
                )}
                {campoConfig.tipo === 'checkbox' && (
  <>
    {campoConfig.opciones.split(',').map((opcion: string, index: React.Key | null | undefined) => (
      <IonItem key={index}>
        <IonLabel>{opcion}</IonLabel>
        <IonCheckbox
          slot="start"
          checked={formularioLleno?.clave_anidada[campo]?.value?.includes(opcion) || false}
          onIonChange={(e) => {
            const checked = e.detail.checked;
            const selectedOptions = formularioLleno?.clave_anidada[campo]?.value || [];
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
