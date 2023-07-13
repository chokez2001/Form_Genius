import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonButton, IonSelect, IonSelectOption, IonLabel, IonToast } from '@ionic/react';
import { useState } from 'react';
import { guardarFormulario } from '../models/dababase';


const AgregarFormularioVacioPage: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [campos, setCampos] = useState<{ etiqueta: string; tipo: string; opciones?: string }[]>([]);
  const [tipoCampo, setTipoCampo] = useState('short_text');
  const [etiquetaCampo, setEtiquetaCampo] = useState('');
  const [mostrarError, setMostrarError] = useState(false);
  const [mostrarEtiquetaRepetida, setMostrarEtiquetaRepetida] = useState(false);
  const [mostrarMensajeNombre, setMostrarMensajeNombre] = useState(false);

  const agregarCampo = () => {
    setCampos([...campos, { etiqueta: etiquetaCampo, tipo: tipoCampo, opciones: tipoCampo === 'checkbox' ? '' : undefined }]);
    setEtiquetaCampo('');
  };

  const guardarNuevoFormularioVacio = () => {
    if (nombre.trim() === '') {
      setMostrarMensajeNombre(true);
      return;
    }

    if (campos.some((campo) => campo.etiqueta.trim() === '')) {
      setMostrarError(true);
      return;
    }

    const etiquetas = campos.map((campo) => campo.etiqueta.trim());
    const duplicados = etiquetas.filter((etiqueta, index) => etiquetas.indexOf(etiqueta) !== index);

    if (duplicados.length > 0) {
      setMostrarEtiquetaRepetida(true);
      return;
    }

    const nuevoFormularioVacio = {
      Tipo: 'Vacio',
      Nombre: nombre,
      Id: '',
      Fomulario_padre: null,
      clave_anidada: campos.reduce((obj: any, campo) => {
        obj[campo.etiqueta] = { value: null, tipo: campo.tipo, opciones: campo.opciones };
        return obj;
      }, {})
    };

    guardarFormulario(nuevoFormularioVacio)
      .then(() => {
        console.log('Nuevo formulario vacío guardado');
        setNombre('');
        setCampos([]);
      })
      .catch((error) => {
        console.error('Error al guardar el nuevo formulario vacío:', error);
      });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Agregar Formulario Vacío</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonInput placeholder="Nombre del formulario" value={nombre} onIonChange={(e) => setNombre(e.detail.value!)}></IonInput>
        {campos.map((campo, index) => (
          <div key={index}>
            <IonInput
              placeholder="Nombre del campo"
              value={campo.etiqueta}
              onIonChange={(e) => {
                const nuevosCampos = [...campos];
                nuevosCampos[index].etiqueta = e.detail.value!;
                setCampos(nuevosCampos);
              }}
            ></IonInput>
            <IonLabel>Tipo de campo:</IonLabel>
            <IonSelect
              value={campo.tipo}
              onIonChange={(e) => {
                const nuevosCampos = [...campos];
                nuevosCampos[index].tipo = e.detail.value!;
                setCampos(nuevosCampos);
              }}
            >
              <IonSelectOption value="short_text">Short Text</IonSelectOption>
              <IonSelectOption value="long_text">Long Text</IonSelectOption>
              <IonSelectOption value="date_picker">Date Picker</IonSelectOption>
              <IonSelectOption value="checkbox">Checkbox</IonSelectOption>
              <IonSelectOption value="img">Image</IonSelectOption>
            </IonSelect>
            {campo.tipo === 'checkbox' && (
              <IonInput
                placeholder="Opciones separadas por coma (ejemplo: opción1, opción2)"
                value={campo.opciones}
                onIonChange={(e) => {
                  const nuevosCampos = [...campos];
                  nuevosCampos[index].opciones = e.detail.value!;
                  setCampos(nuevosCampos);
                }}
              ></IonInput>
            )}
          </div>
        ))}
        <IonButton onClick={agregarCampo}>Agregar Campo</IonButton>
        <IonButton onClick={guardarNuevoFormularioVacio}>Guardar Formulario Vacío</IonButton>

        <IonToast
          isOpen={mostrarError}
          onDidDismiss={() => setMostrarError(false)}
          message="Por favor, complete todos los campos"
          duration={2000}
        />
        <IonToast
          isOpen={mostrarEtiquetaRepetida}
          onDidDismiss={() => setMostrarEtiquetaRepetida(false)}
          message="No se pueden repetir las etiquetas de los campos"
          duration={2000}
        />
        <IonToast
          isOpen={mostrarMensajeNombre}
          onDidDismiss={() => setMostrarMensajeNombre(false)}
          message="Por favor, ingrese un nombre para el formulario"
          duration={2000}
        />
      </IonContent>
    </IonPage>
  );
};

export default AgregarFormularioVacioPage;