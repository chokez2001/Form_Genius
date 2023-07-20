import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonRefresher, IonToolbar, IonList, IonItem, IonLabel, IonButtons, IonMenuButton, IonButton, IonIcon, IonPopover, IonAlert, IonModal, IonGrid, IonRow, IonCol, IonInput, IonRefresherContent, RefresherEventDetail, IonFooter } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { obtenerFormulariosVacios, borrarFormularioVacio } from '../models/dababase';
import { informationCircleOutline, eyeOutline, trashOutline, createOutline } from 'ionicons/icons';


const FormulariosVaciosPage: React.FC = () => {
  const [formulariosVacios, setFormulariosVacios] = useState<any[]>([]);
  const [formularioSeleccionado, setFormularioSeleccionado] = useState<any>(null);
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);

  const history = useHistory();

  const fetchFormulariosVacios = async () => {
    try {
      const result = await obtenerFormulariosVacios();
      setFormulariosVacios(result);
    } catch (error) {
      console.error('Error al obtener los formularios vacíos:', error);
    }
  };


  useEffect(() => {
    fetchFormulariosVacios();
  }, []);


  const handleVerFormulario = (formulario: any) => {
    setFormularioSeleccionado(formulario);
    setMostrarModal(true);
  };

  const handleCloseModal = () => {
    setMostrarModal(false);
    setFormularioSeleccionado(null);
  };

  const obtenerTextoTipoCampo = (tipo: string, opciones?: string): string => {
    switch (tipo) {
      case 'short_text':
        return 'Texto corto';
      case 'long_text':
        return 'Texto largo';
      case 'date_picker':
        return 'Fecha';
      case 'checkbox':
        return opciones ? `Checkbox: ${opciones}` : 'Checkbox';
      case 'imgs':
        return 'Imagen';
      default:
        return '';
    }
  };

  const handleBorrarFormulario = (formulario: any) => {
    setFormularioSeleccionado(formulario);
    setMostrarAlerta(true);
  };

  const handleConfirmarBorrado = async () => {
    try {
      if (formularioSeleccionado) {
        await borrarFormularioVacio(formularioSeleccionado.Id);
        setFormulariosVacios(formulariosVacios.filter((formulario) => formulario.Id !== formularioSeleccionado.Id));
      }
      setMostrarAlerta(false);
      setFormularioSeleccionado(null);
    } catch (error) {
      console.error('Error al borrar el formulario vacío:', error);
    }
  };

  const handleCancelarBorrado = () => {
    setMostrarAlerta(false);
    setFormularioSeleccionado(null);
  };



  const handleLlenarFormulario = (formulario: any) => {
    // Navigate to DetalleFormularioPage with the selected form data as state
    history.push('/pages/fill', { formularioSeleccionado: formulario });
  };
  



const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
  setTimeout(() => {
    fetchFormulariosVacios();
    event.detail.complete();
  }, 500);
};


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton></IonMenuButton>
          </IonButtons>
          <IonTitle>Formularios creados</IonTitle>
          <IonButtons id="click-trigger2" slot="end">
            <IonIcon slot="icon-only" icon={informationCircleOutline} />
          </IonButtons>
          <IonPopover trigger="click-trigger2" triggerAction="click">
            <IonContent className="ion-padding">En esta sección se muestran los formularios disponibles para ser llenados. Al elegir uno de la lista, se mostrará su estructura y la posibilidad de llenarlo.</IonContent>
          </IonPopover>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <IonList>
          {formulariosVacios.map((formulario, index) => (
            <IonItem key={index}>
              <IonLabel className='ion-text-wrap'>{formulario.Nombre}</IonLabel>
              <IonButtons slot="end">
                <IonButton color="primary" onClick={() => handleVerFormulario(formulario)}>
                  <IonIcon icon={eyeOutline} />
                </IonButton>
                <IonButton color="danger" onClick={() => handleBorrarFormulario(formulario)}>
                  <IonIcon icon={trashOutline} />
                </IonButton>
                <IonButton color="secondary" onClick={() => handleLlenarFormulario(formulario)}>
                  <IonIcon icon={createOutline} />
                </IonButton>
              </IonButtons>
            </IonItem>
          ))}
        </IonList>
        <IonAlert
          isOpen={mostrarAlerta}
          onDidDismiss={handleCancelarBorrado}
          header="Confirmar borrado"
          message="¿Estás seguro de que deseas borrar este formulario vacío?"
          buttons={[
            {
              text: 'Cancelar',
              role: 'cancel',
              handler: handleCancelarBorrado,
            },
            {
              text: 'Borrar',
              handler: handleConfirmarBorrado,
            },
          ]}
        />
      <IonModal isOpen={mostrarModal} onDidDismiss={handleCloseModal}>
  <IonHeader>
    <IonToolbar>
      <IonTitle>{formularioSeleccionado && formularioSeleccionado.Nombre}</IonTitle>
      <IonButtons slot="end">
        <IonButton onClick={handleCloseModal}>Cerrar</IonButton>
      </IonButtons>
    </IonToolbar>
  </IonHeader>
  <IonContent className='ion-padding'>
    <IonGrid fixed={true}>
      <IonRow>
        <IonCol size="6">
          <IonTitle>Nombre</IonTitle>
        </IonCol>
        <IonCol size="6">
          <IonTitle>Tipo</IonTitle>
        </IonCol>
      </IonRow>
      {formularioSeleccionado &&
        formularioSeleccionado.campos &&
        Object.entries(formularioSeleccionado.campos).map(([campo, detalles]) => {
          const campoDetalles = detalles as { tipo: string; opciones?: string };
          return (
            <IonRow key={campo}>
              <IonCol size="6">
                <IonLabel>{campo}</IonLabel>
              </IonCol>
              <IonCol size="6">
                <IonLabel>{obtenerTextoTipoCampo(campoDetalles.tipo, campoDetalles.opciones)}</IonLabel>
              </IonCol>
            </IonRow>
          );
        })}
    </IonGrid>
  </IonContent>
</IonModal>

      </IonContent>
      <IonFooter class="ion-no-border" translucent={true} collapse="fade">
        <IonToolbar >
          <IonTitle className="ion-text-center" size="small">Tire para actualizar</IonTitle>
        </IonToolbar>
      </IonFooter>              

    </IonPage>
  );
};

export default FormulariosVaciosPage;
