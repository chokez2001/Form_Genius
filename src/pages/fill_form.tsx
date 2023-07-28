import React, { useEffect, useState, useRef } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonInput, IonTextarea, IonDatetime, IonCheckbox, IonButton, IonToast, InputChangeEventDetail } from '@ionic/react';
import { useLocation, useHistory } from 'react-router-dom';
import { Geolocation} from '@capacitor/geolocation';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { guardarFormularioLleno } from '../models/dababase'; // Import the guardarFormularioLleno function
import { auth } from '../models/user_control';
import { useAuthState } from 'react-firebase-hooks/auth';


interface LocationState {
  formularioSeleccionado: any;
}

interface CampoConfig {
  tipo: string;
  value: any;
  name: string;
}

const DetalleFormularioPage: React.FC = () => {
  const location = useLocation<LocationState>();
  const history = useHistory();
  const { formularioSeleccionado } = location.state || { formularioSeleccionado: null };
  const [formularioLleno, setFormularioLleno] = useState<any | null>({
    // ... otros campos del formulario ...
    UbicacionGPS: { latitud: 0, longitud: 0 }, // Agrega un campo para la ubicación GPS
  });
  const [camposList, setCamposList] = useState<string[]>([]);
  const [nuevoNombre, setNuevoNombre] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showErrorToast, setShowErrorToast] = useState<boolean>(false);
  const [gpsLocation, setGpsLocation] = useState<{ latitud: number; longitud: number } | null>(null);

  // Utilizar useRef para crear referencias a los inputs del nombre del campo
  const campoNameInputsRef = useRef<(HTMLIonInputElement | null)[]>([]);
  const [touchStartTime, setTouchStartTime] = useState<number | null>(null); // Track the start time of the touch
  
 // Agregar la validación de autenticación de Firebase
 const [user] = useAuthState(auth);
 const [showAuthToast, setShowAuthToast] = useState<boolean>(false);

 useEffect(() => {
  // Mostrar el toast de autenticación si el usuario no está autenticado
  if (!user) {
    setShowAuthToast(true);
    setTimeout(() => {
      setShowAuthToast(false);
      history.push('/pages/empty_forms');
    }, 3500); // Redireccionar después de 5 segundos
  }
}, [user, history]);



  const handleChange = (campo: string, value: any) => {
    setFormularioLleno((prevFormulario: { campos: { [x: string]: any } }) => ({
      ...prevFormulario,
      campos: {
        ...prevFormulario.campos,
        [campo]: {
          ...prevFormulario.campos[campo],
          value: value,
        },
      },
    }));
  };

  const handleNuevoNombreChange = (e: CustomEvent<InputChangeEventDetail>) => {
    setNuevoNombre(e.detail.value || "");
    setFormularioLleno((prevFormulario: { [x: string]: any }) => ({
      ...prevFormulario,
      Nombre: e.detail.value || "", // Establecer el nuevo nombre del formulario
    }));
  };

  
  
  const handleCampoNameBlur = (campo: string) => {
    // Al salir del input, establecer el nombre del campo en el formularioLleno
    const inputIndex = camposList.indexOf(campo);
    if (inputIndex !== -1) {
      const inputElement = campoNameInputsRef.current[inputIndex];
      const newName = (inputElement?.value as string)?.trim() || campo; // Cast the value to string and use the original campo name if the input is empty after trimming
      setFormularioLleno((prevFormulario: { campos: { [x: string]: CampoConfig; }; }) => {
        const newCampos: { [x: string]: CampoConfig } = { ...prevFormulario.campos };
        const campoConfig = newCampos[campo];
        if (campoConfig) {
          // Obtener el valor original del campo
          const campoValue = campoConfig.value;
          // Eliminar el campo original usando el nombre actual como clave
          delete newCampos[campo];
          // Usar el nuevo nombre como clave para el campo y establecer el valor original
          newCampos[newName] = { ...campoConfig, name: newName };
        }
        return {
          ...prevFormulario,
          campos: newCampos,
        };
      });
    }
  };
  
  
  
  const handleCampoNameClick = (campo: string) => {
    const inputIndex = camposList.indexOf(campo);
    if (inputIndex !== -1) {
      const inputElement = campoNameInputsRef.current[inputIndex];
      if (inputElement && touchStartTime) {
        const touchEndTime = Date.now();
        const touchDuration = touchEndTime - touchStartTime;
        // If the touch duration is less than 200 milliseconds, treat it as a tap and open the input block
        if (touchDuration < 200) {
          inputElement.click();
        }
      }
    }
  };

  const handleCampoNameTouchStart = () => {
    // Set the start time of the touch
    setTouchStartTime(Date.now());
  };

  const handleCampoNameTouchEnd = (campo: string) => {
    // Reset the touch start time when the touch ends
    setTouchStartTime(null);
  };

  const getLocation = async () => {
    // Obtener la ubicación
    const position = await Geolocation.getCurrentPosition();
    const latitud = position.coords.latitude;
    const longitud = position.coords.longitude;
    setGpsLocation({ latitud, longitud });
  
    // Actualizar el estado del formularioLleno con la ubicación GPS
    setFormularioLleno((prevFormulario: any) => ({
      ...prevFormulario,
      UbicacionGPS: { latitud, longitud },
    }));
  };

  useEffect(() => {
    if (formularioSeleccionado) {
      // Create a list of all the field keys (campos) from the selected form and store the form data
      const campos = formularioSeleccionado.campos;
      const camposKeys = Object.keys(campos);

      // Add the initial names of the fields to the formularioLleno state
      const initialFormularioLleno = {
        ...formularioSeleccionado,
        campos: camposKeys.reduce((acc: any, campo) => {
          acc[campo] = {
            ...formularioSeleccionado.campos[campo],
            value: formularioSeleccionado.campos[campo]?.value || "", // Set initial field value (empty string if undefined)
          };
          return acc;
        }, {}),
      };

      setCamposList(camposKeys);
      setFormularioLleno(initialFormularioLleno);
      getLocation();

     // Establecer el nombre del formulario actual en la variable nuevoNombre
     setNuevoNombre(formularioSeleccionado.Nombre || "");
    }
  }, [formularioSeleccionado]);


  
  const handleSubmit = async () => {
     // Agregar la validación de autenticación de Firebase
     if (!user) {
      console.error('El usuario no está autenticado');
      return;
    }

    try {
      if (!nuevoNombre) {
        // Mostrar el mensaje de error usando IonToast
        setErrorMessage("Por favor, ingrese un nombre para el formulario antes de guardarlo.");
        setShowErrorToast(true);
        return;
      }

      // Verificar que ningún campo esté vacío
      const camposLlenos = Object.keys(formularioLleno?.campos || {}).every((campo) => {
        return formularioLleno?.campos[campo]?.value !== "";
      });

      if (!camposLlenos) {
        // Mostrar el mensaje de error usando IonToast
        setErrorMessage("Por favor, llene todos los campos antes de guardar el formulario.");
        setShowErrorToast(true);
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
      <IonContent className='ion-padding-horizontal'>
        <IonList>
          {camposList.map((campo, index) => {
            const campoConfig = formularioLleno?.campos[campo];
            if (!campoConfig) return null;

            return (
              <IonItem key={index}>
                <IonLabel
                  style={{ fontSize: '130%' }}
                  position="stacked">
                  
                    {`${campo}`}
  
                </IonLabel>

                {campoConfig.tipo === 'short_text' && (
                  <IonInput
                    type="text"
                    value={campoConfig.value}
                    onIonChange={(e) => handleChange(campo, e.detail.value)}
                    counter
                    maxlength={30}
                  />
                )}
                {campoConfig.tipo === 'long_text' && (
                  <IonTextarea
                    value={campoConfig.value}
                    onIonChange={(e) => handleChange(campo, e.detail.value)}
                    autoGrow
                    counter
                    maxlength={600}
                  />
                )}
                {campoConfig.tipo === 'date_picker' && (
                  <IonInput type="date" value={campoConfig.value} onIonChange={(e) => handleChange(campo, e.detail.value)} />
                )}
                {campoConfig.tipo === 'checkbox' && (
                  <>
                    <br />
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
          {/* Campo para mostrar la ubicación GPS */}
          <IonItem>
            <IonLabel>Ubicación GPS:</IonLabel>
            <IonTextarea  
            autoGrow
            readonly 
            value={gpsLocation ? `Latitud: ${gpsLocation.latitud.toFixed(6)}\nLongitud: ${gpsLocation.longitud.toFixed(6)}` : "Obteniendo ubicación..."} />
          </IonItem>
        </IonList>
        <IonButton expand="full" onClick={handleSubmit}>
          Guardar
        </IonButton>

        {/* Mostrar el toast de autenticación si el usuario no está autenticado */}
        <IonToast
          isOpen={showAuthToast}
          onDidDismiss={() => setShowAuthToast(false)}
          message="Primero debes iniciar sesión para guardar el formulario."
          duration={3000}
          color="warning"
        />

        {/* Mostrar el toast de error si ocurrió un error en el guardado */}
        <IonToast
          isOpen={showErrorToast}
          onDidDismiss={() => setShowErrorToast(false)}
          message={errorMessage || ""}
          duration={3000}
          color="danger"
        />
      </IonContent>
    </IonPage>
  );
};

export default DetalleFormularioPage;