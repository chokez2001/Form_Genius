import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { IonPage, IonContent, IonInput, IonButton, IonToast, IonLabel, IonRouterLink } from "@ionic/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, registerWithEmailAndPassword, signInWithGoogle } from "../models/user_control";

const Registerpage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const history = useHistory();
  const register = async () => {
    if (!name) {
      alert("Please enter name");
      return;
    }
    try {
      await registerWithEmailAndPassword(name, email, password);
      setShowToast(true);
    } catch (error) {
      console.error(error);
      alert("Registration failed");
    }
  };

  useEffect(() => {
    if (loading) return;
    if (user) history.replace("/dashboard");
  }, [user, loading]);

  const [showToast, setShowToast] = useState(false);

  return (
    <IonPage>
      <IonContent className='ion-padding'>
        <IonInput
          fill="outline"
          type="text"
          value={name}
          placeholder="Nombre y apellidos"
          onIonChange={(e) => setName(e.detail.value!)}
        />
        <IonInput
          fill="outline"
          type="text"
          value={email}
          placeholder="Correo electrónico"
          onIonChange={(e) => setEmail(e.detail.value!)}
        />
        <IonInput
          fill="outline"
          type="password"
          value={password}
          placeholder="Contraseña"
          onIonChange={(e) => setPassword(e.detail.value!)}
        />
        <IonButton expand="full" color="dark" onClick={register}>
          Registrarse
        </IonButton>
        <IonButton expand="full" onClick={signInWithGoogle}>
          Registrarse con Google
        </IonButton>
        <IonContent className="ion-text-center">
        <IonLabel>¿Ya tienes una cuenta? </IonLabel>
          <IonRouterLink  color='tertiary' routerLink="/pages/login"><u>Inicia sesión</u></IonRouterLink>
        </IonContent>
        <IonToast
          isOpen={showToast}
          message="Registration successful"
          duration={2000}
          onDidDismiss={() => setShowToast(false)}
        />
      </IonContent>
    </IonPage>
  );
};

export default Registerpage;
