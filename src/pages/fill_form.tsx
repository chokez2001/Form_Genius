import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonInput, IonTextarea, IonDatetime, IonCheckbox, IonButton, IonToast, InputChangeEventDetail } from '@ionic/react';
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
  const [camposList, setCamposList] = useState<string[]>([]);
  const [nuevoNombre, setNuevoNombre] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showError, setShowError] = useState<boolean>(false);

  useEffect(() => {
    if (formularioSeleccionado) {
      // Create a list of all the field keys (campos) from the selected form and store the form data
      const campos = formularioSeleccionado.campos;
      const camposKeys = Object.keys(campos);
      console.log(campos)
      console.log(camposKeys)
      setCamposList(camposKeys);
      setFormularioLleno(formularioSeleccionado);
    }
  }, [formularioSeleccionado]);

  const handleChange = (campo: string, value: any) => {
    setFormularioLleno((prevFormulario: { campos: { [x: string]: any; }; }) => ({
      ...prevFormulario,
      campos: {
        ...prevFormulario.campos,
        [campo]: {
          ...prevFormulario.campos[campo],
          value: value
        }
      }
    }));
  };

  const handleNuevoNombreChange = (e: CustomEvent<InputChangeEventDetail>) => {
    setNuevoNombre(e.detail.value || ""); // Establecer un valor predeterminado para evitar 'undefined'
  };

  const handleSubmit = async () => {
    try {
      if (!nuevoNombre) {
        // Mostrar el mensaje de error usando IonToast
        setErrorMessage("Por favor, ingrese un nombre para el formulario antes de guardarlo.");
        setShowError(true);
        return;
      }

      // Verificar que ningún campo esté vacío
      const camposLlenos = Object.keys(formularioLleno?.campos || {}).every((campo) => {
        return formularioLleno?.campos[campo]?.value !== "";
      });

      if (!camposLlenos) {
        // Mostrar el mensaje de error usando IonToast
        setErrorMessage("Por favor, llene todos los campos antes de guardar el formulario.");
        setShowError(true);
        return;
      }

      if (nuevoNombre) {
        setFormularioLleno((prevFormulario: any) => ({
          ...prevFormulario,
          Nombre: nuevoNombre
        }));
      }

      // Call the function to save the filled form
      await guardarFormularioLleno(formularioLleno);

      // Navigate back to the previous page or any other desired destination
      history.push('/pages/empty_forms');
    } catch (error) {
      console.error('Error al guardar el formulario lleno:', error);
    }
  };

  if (!formularioSeleccionado) {
    return <div>Formulario no encontrado.</div>;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            <IonInput
              value={nuevoNombre}
              placeholder="Nuevo nombre"
              onIonChange={handleNuevoNombreChange}
            />
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-padding'>
        <IonList >
          {camposList.map((campo, index) => {
            const campoConfig = formularioLleno?.campos[campo];
            if (!campoConfig) return null;

            return (
              <IonItem key={index}>
                <IonLabel position="stacked">{campo}</IonLabel>
         
                {campoConfig.tipo === 'short_text' && (
                  <IonInput 
                  type="text" 
                  value={campoConfig.value} 
                  onIonChange={(e) => handleChange(campo, e.detail.value)} 
                  counter={true}  
                  maxlength={30}
                  />
                  
                )}
                {campoConfig.tipo === 'long_text' && (
                  <IonTextarea 
                  autoGrow={true} // Hacer que el campo de texto crezca automáticamente
                  value={campoConfig.value} 
                  onIonChange={(e) => handleChange(campo, e.detail.value)} 
                  counter={true}  
                  maxlength={400}
                  />
                )}
                {campoConfig.tipo === 'date_picker' && (
                  <IonInput type="date" value={campoConfig.value} onIonChange={(e) => handleChange(campo, e.detail.value)} />
                )}
                {campoConfig.tipo === 'checkbox' && (
                  <> <br />
                    {campoConfig.opciones.split(',').map((opcion: string, index: number) => (
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

        {/* Mostrar IonToast si hay un error */}
        <IonToast
          isOpen={showError}
          onDidDismiss={() => setShowError(false)}
          message={errorMessage || ""}
          duration={3000}
          color="danger"
        />
      </IonContent>
    </IonPage>
  );
};

export default DetalleFormularioPage;
