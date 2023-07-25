import React, { useEffect, useState, useRef } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonInput, IonTextarea, IonDatetime, IonCheckbox, IonButton, IonToast, InputChangeEventDetail, useIonToast } from '@ionic/react';
import { useLocation, useHistory } from 'react-router-dom';
import { Geolocation} from '@capacitor/geolocation';
import { NativeSettings, AndroidSettings} from 'capacitor-native-settings';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';



import { guardarFormularioLleno } from '../models/dababase'; // Import the guardarFormularioLleno function

interface LocationState {
  formularioSeleccionado: any;
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
  const [showError, setShowError] = useState<boolean>(false);
  const [gpsLocation, setGpsLocation] = useState<{ latitud: number; longitud: number } | null>(null);


  // Utilizar useRef para crear referencias a los inputs del nombre del campo
  const campoNameInputsRef = useRef<(HTMLIonInputElement | null)[]>([]);
  const [touchStartTime, setTouchStartTime] = useState<number | null>(null); // Track the start time of the touch
  
 

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

  const handleCampoNameChange = (campo: string, value: any) => {
    setFormularioLleno((prevFormulario: { campos: { [x: string]: any; }; }) => ({
      ...prevFormulario,
      campos: {
        ...prevFormulario.campos,
        [campo]: {
          ...prevFormulario.campos[campo],

        }
      }
    }));
  };
  
  const handleCampoNameBlur = (campo: string) => {
    // Al salir del input, establecer el nombre del campo en el formularioLleno
    const inputIndex = camposList.indexOf(campo);
    if (inputIndex !== -1) {
      const inputElement = campoNameInputsRef.current[inputIndex];
      const newName = (inputElement?.value as string)?.trim() || campo; // Cast the value to string and use the original campo name if the input is empty after trimming
      setFormularioLleno((prevFormulario: { campos: { [x: string]: any; }; }) => {
        const newCampos = { ...prevFormulario.campos };
        if (newCampos[campo]) {
          newCampos[newName] = { ...newCampos[campo], name: newName }; // Actualizar el nombre del campo dentro del objeto
          delete newCampos[campo]; // Eliminar la clave anterior del objeto
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


  // const requestLocationPermission = async () => {
  //   try {
  //     // Verificar si el GPS está habilitado
     
  //     const isGPSEnabled = await Diagnostic.isLocationEnabled();
  
  //     if (isGPSEnabled) {
  //       // Si los servicios de geolocalización están habilitados, proceder con obtener la ubicación.
  //       getLocation();
  //     } else {
  //       // Mostrar mensaje al usuario para que active la ubicación manualmente
  //       console.log('Los servicios de geolocalización están desactivados. Por favor, habilita la ubicación desde la configuración del dispositivo.');
        
  //       // Abrir la configuración de ubicación en Android
  //       Diagnostic.switchToLocationSettings();
  //       return;
  //     }
  //   } catch (error) {
  //     console.error('Error al verificar el estado del GPS:', error);
  //   }
  // };
  
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
            name: campo, // Set initial field name to the original field key (campo)
          };
          return acc;
        }, {}),
      };

      setCamposList(camposKeys);
      setFormularioLleno(initialFormularioLleno);
      getLocation();
      // requestLocationPermission();
    }
  }, [formularioSeleccionado]);


  // Función para guardar la referencia de la imagen 

  const [presentToast] = useIonToast();

  
  const captureOrSelectImage = async (campo: string) => {
    try {
      const image = await Camera.getPhoto({
        resultType: CameraResultType.Base64,
        source: CameraSource.Prompt,
      });

      const base64Image = image.base64String;

      // Actualiza el campo en el formularioLleno con el valor de la imagen
      setFormularioLleno((prevFormulario: { campos: { [x: string]: any; }; }) => ({
        ...prevFormulario,
        campos: {
          ...prevFormulario.campos,
          [campo]: {
            ...prevFormulario.campos[campo],
            value: base64Image,
          },
        },
      }));

      // Guarda la información de la imagen en el Local Storage
      saveImageInfoToLocalStorage({
        filename: campo, // Usa el nombre del campo como nombre de archivo
        url: base64Image, // Utiliza el valor de la imagen como URL
      });
    } catch (error) {
      console.error('Error al capturar o seleccionar la imagen:', error);
      presentToast({
        message: 'Error al capturar o seleccionar la imagen.',
        duration: 2000,
      });
    }
  };

  const saveImageInfoToLocalStorage = (imageInfo: { filename: any; url: any; }) => {
    try {
      const imagesInLocalStorage = localStorage.getItem('images');
      const parsedImages = imagesInLocalStorage ? JSON.parse(imagesInLocalStorage) : {};

      // Guardar la información de la imagen usando el nombre de archivo como clave
      parsedImages[imageInfo.filename] = imageInfo.url;

      // Convertir a cadena JSON y guardar en el Local Storage
      localStorage.setItem('images', JSON.stringify(parsedImages));
    } catch (error) {
      console.error('Error al guardar la información de la imagen en el Local Storage:', error);
    }
  };



  // Funcion principal para manejar el envio del formulario al locale_storage 

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

      // Agregar la referencia del archivo (nombre de la imagen) al formulario antes de guardarlo
      if (formularioLleno.campos['imagen_campo']) {
        const imagenCampoValue = formularioLleno.campos['imagen_campo'].value;
        if (imagenCampoValue) {
          const imageInfo = {
            filename: 'imagen_guardada', // Nombre o clave utilizada para almacenar la imagen en el Local Storage
            url: imagenCampoValue, // Puedes guardar aquí la URL de la imagen si la necesitas
          };
          saveImageInfoToLocalStorage(imageInfo);
        }
      }

      

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
                  style={{ fontSize: '170%' }}
                  position="stacked"
                  onClick={() => handleCampoNameClick(campo)}
                  onTouchStart={handleCampoNameTouchStart}
                  onTouchEnd={() => handleCampoNameTouchEnd(campo)}
                >
                  {/* Utilizar useRef para crear una referencia al input del nombre del campo */}
                  <IonInput
                    value={campoConfig.name} // Mostrar el nombre del campo
                    placeholder="Nombre del campo"
                    onIonChange={(e) => handleCampoNameChange(campo, e.detail.value)}
                    onIonBlur={() => handleCampoNameBlur(campo)} // Guardar el cambio cuando el input pierde el enfoque
                    ref={ref => campoNameInputsRef.current[index] = ref} // Guardar la referencia al input
                  />
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
                {campoConfig.tipo === 'imgs' && (
                  <div>
                    <br/>
                    {/* Mostrar el thumbnail de la imagen si existe */}
                    {campoConfig.value && (
                      <img
                        src={`data:image/jpeg;base64,${campoConfig.value}`}
                        alt={`Thumbnail-${campo}`}
                        style={{ width: '100px', height: '100px' }}
                      />
                    )}

                    <IonButton onClick={() => captureOrSelectImage(campo)}>
                      Capturar o seleccionar imagen
                    </IonButton>
                  </div>
                )}
              </IonItem>
            );
          })}

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