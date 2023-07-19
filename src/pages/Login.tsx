import React, { useState } from 'react';
import { IonPage, IonContent, IonInput, IonButton, IonToast, IonRouterLink, IonLabel, IonButtons, IonHeader, IonMenuButton, IonTitle, IonToolbar } from '@ionic/react';
import { auth, logInWithEmailAndPassword, signInWithGoogle } from '../models/user_control';
import { useAuthState } from 'react-firebase-hooks/auth';
import logo from '../assets/logo.svg';


const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showToast, setShowToast] = useState(false);

  const [user] = useAuthState(auth);

  const handleLogin = async () => {
    try {
      await logInWithEmailAndPassword(username, password);
      // Inicio de sesión exitoso
      setShowToast(true);
    } catch (error) {
      console.error(error);
      // Inicio de sesión fallido
      setShowToast(true);
    }
  };

  
  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      // Inicio de sesión con Google exitoso
      setShowToast(true);
    } catch (error) {
      console.error(error);
      // Inicio de sesión con Google fallido
      setShowToast(true);
    }
  };

  if (user) {
    // Si el usuario ya está autenticado, puedes redirigirlo a otra página o mostrar un mensaje de bienvenida
    return (
      <IonPage>
        <IonContent>
          <h1>Bienvenido, {user.displayName}</h1>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton></IonMenuButton>
          </IonButtons>
          <h2  color='tertiary' >Iniciar Sesión</h2>
        </IonToolbar>
      </IonHeader>  
      <IonContent className='ion-padding'>
        
        <div style={{ background: 'linear-gradient(to left, #000000, #808080)', 
        display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img src={logo} alt="Custom SVG" />
        </div>
        
        <IonInput
          fill="outline"
          value={username}
          placeholder="Correo electrónico"
          onIonChange={(e) => setUsername(e.detail.value!)}
        />
        <IonInput
          fill="outline"
          type="password"
          value={password}
          placeholder="Contraseña"
          onIonChange={(e) => setPassword(e.detail.value!)}
        />
        <IonButton expand="full" color="dark" onClick={handleLogin}>
          Iniciar sesión
        </IonButton>
        <IonButton expand="full" onClick={handleGoogleLogin}>
          Iniciar sesión con Google
        </IonButton >
        <IonContent className="ion-text-center">
          <IonRouterLink color='tertiary'  routerLink="/reset"><u>¿Olvidaste tu contraseña?</u></IonRouterLink>
            <br />
          <IonLabel>¿No tienes una cuenta? </IonLabel>
          <IonRouterLink  color='tertiary' routerLink="/pages/register"><u>Regístrate</u></IonRouterLink>
        </IonContent>
       
        <IonToast
          isOpen={showToast}
          message={showToast ? 'Inicio de sesión fallido' : ''}
          duration={2000}
          onDidDismiss={() => setShowToast(false)}
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;
