import { Storage } from '@ionic/storage';
import { collection, addDoc, onSnapshot, CollectionReference, DocumentData, getDocs } from 'firebase/firestore';
import { firestore_db } from './firebase_conecction';

const storage = new Storage();
storage.create();

const guardarFormularioVacio = async (formulario: any) => {
  try {
    const formulariosVaciosJSON = await storage.get('formulariosVacios');
    let formulariosVacios = formulariosVaciosJSON ? JSON.parse(formulariosVaciosJSON) : [];

    const nombre = formulario.Nombre;
    const formularioId = `P${formulariosVacios.length + 1}`;

    if (formulariosVacios.some((form: any) => form.Nombre === nombre)) {
      console.error('Ya existe un formulario vacío con el mismo nombre');
      return;
    }

    formulariosVacios.push({ ...formulario, Id: formularioId });

    await storage.set('formulariosVacios', JSON.stringify(formulariosVacios));

    console.log('Formulario vacío guardado exitosamente en la base de datos local de dbindexed');

  } catch (error) {
    console.error('Error al guardar el formulario vacío:', error);
  }
};

const obtenerFormulariosVacios = async () => {
  try {
    const formulariosVaciosJSON = await storage.get('formulariosVacios');
    if (formulariosVaciosJSON) {
      const formulariosVacios = JSON.parse(formulariosVaciosJSON) as any[];
      return formulariosVacios;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error al obtener los formularios vacíos:', error);
    throw error;
  }
};

const guardarFormularioVacioFirestore = async (formulario: any) => {
  const collectionRef = collection(firestore_db, 'form_genius');

  try {
    await addDoc(collectionRef, formulario);
    console.log('Formulario vacío guardado exitosamente en Firestore');
  } catch (error) {
    console.error('Error al guardar el formulario vacío en Firestore:', error);
  }
};

const obtenerFormulariosVaciosFirestore = async () => {
  const collectionRef = collection(firestore_db, 'form_genius');

  try {
    const querySnapshot = await getDocs(collectionRef);
    const fetchedDocuments: any[] = [];
    querySnapshot.forEach((doc) => {
      fetchedDocuments.push({ id: doc.id, data: doc.data() });
    });
    return fetchedDocuments;
  } catch (error) {
    console.error('Error al obtener los formularios vacíos desde Firestore:', error);
    throw error;
  }
};

const sincronizarFormulariosVacios = async () => {
  const formulariosVaciosLocal = await obtenerFormulariosVacios();
  const formulariosVaciosFirestore = await obtenerFormulariosVaciosFirestore();

  // Sincronizar los formularios vacíos existentes en la base de datos local
  formulariosVaciosLocal.forEach(async (formularioLocal: any) => {
    const formularioId = formularioLocal.Id;
    const formularioFirestore = formulariosVaciosFirestore.find((formulario) => formulario.id === formularioId);

    if (!formularioFirestore) {
      // Guardar formulario vacío en Firestore
      await guardarFormularioVacioFirestore(formularioLocal);
    }
  });
};

export {
  guardarFormularioVacio,
  obtenerFormulariosVacios,
  guardarFormularioVacioFirestore,
  obtenerFormulariosVaciosFirestore,
  sincronizarFormulariosVacios
};
