import React, { useEffect, useState } from "react";
import { IonPage, IonContent, IonAvatar, IonButton, IonText } from "@ionic/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { firestore_db } from "../models/firebase_conecction";
import { auth, logout } from "../models/user_control";
import { query, collection, getDocs, where } from "firebase/firestore";
import './Dashboard_page.css'

const Dashboard: React.FC = () => {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const [photoURL, setPhotoURL] = useState("");

  const fetchUserData = async () => {
    try {
      const q = query(collection(firestore_db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
      setPhotoURL(user?.photoURL || "");
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error al obtener los datos del usuario");
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return;
    fetchUserData();
  }, [user, loading]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error al cerrar sesión");
    }
  };

  if (!user) {
    return (
      <IonPage>
        <IonContent >
          
            <div className="dashboard__container">
              <p>No has iniciado sesión.</p>
              <IonButton routerLink="/pages/login" expand="full">Iniciar sesión</IonButton>
            </div>
       
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonContent>
        
          <div className="dashboard__container">
            <IonAvatar >
              {photoURL ? (
                <img src={photoURL} alt="Profile" />
              ) : (
                <img src="default-profile-image.png" alt="Default Profile" />
              )}
            </IonAvatar>
            <IonText>{name}</IonText>
            <IonText>{user?.email}</IonText>
            <IonButton expand="full" onClick={handleLogout}>
              Cerrar sesión
            </IonButton>
          </div>
      
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;
