import { Storage } from '@ionic/storage';
import { collection, addDoc } from 'firebase/firestore';
import { firestore_db } from './firebase_conecction';
import { auth } from './user_control';

const storage = new Storage();
storage.create();

const obtenerFormulariosLlenos = async () => {
  try {
    const formulariosLlenosJSON = await storage.get('formulariosLlenos');
    if (formulariosLlenosJSON) {
      const formulariosLlenos = JSON.parse(formulariosLlenosJSON) as any[];
      return formulariosLlenos;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error al obtener los formularios Llenos:', error);
    throw error;
  }
};

const guardarFormularioLlenoFirestore = async (formulario: any) => {
  const user = auth.currentUser;
  
  if (!user) {
    console.error('El usuario no está autenticado. No se puede guardar el formulario.');
    return;
  }

  const collectionRef = collection(firestore_db, 'form_genius');
  
  try {
    const formularioId = `H${formulario.length + 1}`;

    // Agregar el uid del usuario al objeto del formulario
    const formularioConUid = {
      ...formulario,
      user_id: user.uid // Agregar el uid del usuario con la clave user_id
    };

    await addDoc(collectionRef, formularioConUid);
    console.log('Formulario lleno guardado exitosamente en Firestore');
  } catch (error) {
    console.error('Error al guardar el formulario lleno en Firestore:', error);
  }
};

const sincronizarFormulariosLLenos = async () => {
  const formulariosLlenosLocal = await obtenerFormulariosLlenos();

  // Sincronizar los formularios llenos existentes en la base de datos local con Firestore
  formulariosLlenosLocal.forEach(async (formularioLocal) => {
    await guardarFormularioLlenoFirestore(formularioLocal);
  });
};

export {
  sincronizarFormulariosLLenos
};
