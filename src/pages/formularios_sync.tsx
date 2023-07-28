// import React, { useEffect, useState } from 'react';
// import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonButton, IonNote } from '@ionic/react';
// import { obtenerFormulariosLlenos } from '../models/dababase';
// import { sincronizarFormulariosVacios } from '../models/sincronization';
// const FormulariosVaciosSyncPage: React.FC = () => {
//   const [formulariosLlenos, setFormulariosLlenos] = useState<any[]>([]);

//   useEffect(() => {
//     obtenerFormulariosLlenos()
//       .then((formularios) => {
//         setFormulariosLlenos(formularios);
//       })
//       .catch((error) => {
//         console.error('Error al obtener los formularios vacíos:', error);
//       });
//   }, []);

//   const handleSincronizar = () => {
//     sincronizarFormulariosVacios()
//       .then(() => {
//         console.log('Sincronización de formularios vacíos completada');
//       })
//       .catch((error) => {
//         console.error('Error al sincronizar los formularios vacíos:', error);
//       });
//   };


//   return (
//     <IonPage>
//       <IonHeader>
//         <IonToolbar>
//           <IonTitle>Formularios Llenos</IonTitle>
//         </IonToolbar>
//       </IonHeader>
//       <IonContent>
//       <IonList>
//   {formulariosLlenos.map((formulario) => (
//     <IonItem key={formulario.Id}>
//       <IonNote>{JSON.stringify(formulario)}</IonNote>
//     </IonItem>
//   ))}
// </IonList>
// <IonButton expand="block" onClick={handleSincronizar}>Sincronizar con Firestore</IonButton>

//       </IonContent>
//     </IonPage>
//   );
// };

// export default FormulariosVaciosSyncPage;
