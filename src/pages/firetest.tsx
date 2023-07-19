import React, { useEffect, useState, useRef } from 'react';
import { IonContent, IonPage, IonInput, IonButton } from '@ionic/react';
import { submitData, fetchData } from '../models/firestore_handler';




const MyPage: React.FC = () => {
  const dataRef = useRef<HTMLIonInputElement>(null);
  const [documents, setDocuments] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = fetchData((querySnapshot: any) => {
      const fetchedDocuments: any[] = [];
      querySnapshot.forEach((doc: any) => {
        fetchedDocuments.push({ id: doc.id, data: doc.data() });
      });
      setDocuments(fetchedDocuments);
    });
  
    return () => {
      unsubscribe();
    };
  }, []);
  

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    const inputData = dataRef.current?.value;
    submitData(inputData);
    dataRef.current!.value = ''; // Limpiar el valor del input
  };

  return (
    <IonPage>
      <IonContent>
        <div className="ion-padding">
          <form onSubmit={submitHandler}>
            <IonInput type="text" ref={dataRef}></IonInput>
            <IonButton type="submit">Save</IonButton>
          </form>

          <h2>Documentos en Firestore:</h2>
          <ul>
            {documents.map((doc) => (
              <li key={doc.id}>{JSON.stringify(doc.data)}</li>
            ))}
          </ul>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default MyPage;
