import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonInput } from '@ionic/react';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../models/user_control';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Network } from '@capacitor/network';

const UploadImagePage: React.FC = () => {
  const [imageData, setImageData] = useState<string>('');
  const [imageName, setImageName] = useState<string>('');
  const [user] = useAuthState(auth);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const imageFile = event.target.files?.[0];
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageData(reader.result as string);
      };
      reader.readAsDataURL(imageFile);
    }
  };

  const saveImageToLocalFilesystem = async (imageName: string, imageData: string) => {
    try {
      const result = await Filesystem.writeFile({
        path: "imageName",
        data: imageData,
        directory: Directory.Data
      });

      console.log('Imagen guardada en el File System:', result.uri);
    } catch (error) {
      console.error('Error al guardar la imagen:', error);
    }
  };

  const uploadImageToServer = async (imageName: string) => {
    if (!user) {
      console.error('El usuario no está autenticado');
      return;
    }

    
    const storage = getStorage();
    const userId = user.uid;
    const userImageRef = ref(storage, `users/${userId}/${imageName}`);

    try {
      await uploadString(userImageRef, imageData, 'data_url');

      const imageURL = await getDownloadURL(userImageRef);

      localStorage.setItem('imageFileName', imageName);
      localStorage.setItem('imageURL', imageURL);

      setImageData('');
      setImageName('');
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      // Agregar la imagen a la cola para intentar subirla más tarde
      addToUploadQueue(imageName, imageData);
    }
  };

  const MAX_UPLOAD_TIME = 60000; // 60 segundos


  const handleUploadImage = () => {
    if (!imageData) {
      console.log('Seleccione una imagen');
      return;
    }

    const imageName = `image_${new Date().getTime()}`;
    saveImageToLocalFilesystem(imageName, imageData);
    const uploadTimeout = setTimeout(() => {
      console.log('Tiempo de espera de subida agotado. Agregando imagen a la cola...');
    addToUploadQueue(imageName, imageData);
    }, MAX_UPLOAD_TIME);
    uploadImageToServer(imageName).then(() => {
      clearTimeout(uploadTimeout);
    });
  };


  const openImageUploadQueueDB = (): Promise<IDBTransaction> => {
    return new Promise((resolve, reject) => {
      try {
        const request = window.indexedDB.open('imageUploadQueue', 1);
  
        request.onsuccess = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
  
          // Asegurarse de que la base de datos no sea null
          if (!db) {
            reject(new Error('Error al abrir la base de datos en IndexedDB'));
            return;
          }
  
          const transaction = db.transaction('queue', 'readwrite');
  
          // Asegurarse de que la transacción no sea null
          if (!transaction) {
            reject(new Error('Error al abrir la transacción en IndexedDB'));
            return;
          }
  
          resolve(transaction);
        };
  
        request.onerror = (event) => {
          reject(new Error('Error al abrir la base de datos en IndexedDB: ' + (event.target as IDBOpenDBRequest).error));
        };
      } catch (error) {
        reject(new Error('Error al abrir la base de datos en IndexedDB: ' + error));
      }
    });
  };


  const addToUploadQueue = async (imageName: string, imageData: string) => {
  try {
    const transaction = await openImageUploadQueueDB();
    const store = transaction.objectStore('queue');
    store.add({ name: imageName, data: imageData });
    console.log('Imagen agregada a la cola:', imageName);
    transaction.oncomplete = () => {
      console.log('Transacción completada');
    };
    transaction.onabort = () => {
      console.error('Transacción abortada');
    };
  } catch (error) {
    console.error('Error al agregar la imagen a la cola:', error);
  }
};

const processUploadQueue = async () => {
  try {
    const transaction = await openImageUploadQueueDB();
    const store = transaction.objectStore('queue');
    const getRequest = store.getAll();
    getRequest.onsuccess = async () => {
      const images = getRequest.result;
      for (const image of images) {
        await uploadImageToServer(image.name);
      }
      const deleteRequest = store.clear();
      deleteRequest.onsuccess = () => {
        console.log('Cola de imágenes procesada y borrada');
      };
      deleteRequest.onerror = () => {
        console.error('Error al borrar la cola de imágenes');
      };
    };
    transaction.oncomplete = () => {
      console.log('Transacción completada');
    };
    transaction.onabort = () => {
      console.error('Transacción abortada');
    };
  } catch (error) {
    console.error('Error al procesar la cola de imágenes:', error);
  }
};

  

  // Procesar la cola al detectar una conexión a Internet
  Network.addListener('networkStatusChange', async ({ connected }) => {
    if (connected) {
      console.log('Conexión a Internet detectada. Procesando la cola de imágenes...');
      await processUploadQueue();
    }
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Subir Imagen</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <input type="file" onChange={handleImageChange} />
        <IonInput value={imageName} placeholder="Nombre de la imagen" onIonChange={(e) => setImageName(e.detail.value!)}></IonInput>
        <IonButton expand="full" onClick={handleUploadImage}>Subir imagen</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default UploadImagePage;
