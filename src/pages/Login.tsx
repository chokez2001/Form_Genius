import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonToast,
  IonRouterLink,
  IonLabel,
  IonButtons,
  IonHeader,
  IonMenuButton,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { auth, logInWithEmailAndPassword } from '../models/user_control';
import { useAuthState } from 'react-firebase-hooks/auth';
import logo from '../assets/logo.svg';
import { signOut } from 'firebase/auth';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState('danger');

  const [user] = useAuthState(auth);

  const handleLogin = async () => {
    try {
      const errorMessage = await logInWithEmailAndPassword(username, password);
      if (errorMessage) {
        // Inicio de sesión fallido, mostrar el mensaje de error en la alerta
        setToastMessage(errorMessage);
        setToastColor('danger');
        setShowToast(true);
        
        
      } else {
        // Inicio de sesión exitoso, mostrar mensaje de éxito en la alerta
        setToastMessage('Inicio de sesión exitoso');
        setToastColor('success');
        setShowToast(true);
      }
    } catch (error) {
      console.error(error);
      // Ocurrió un error inesperado durante el inicio de sesión, mostrar mensaje de error en la alerta
      setToastMessage('Ocurrió un error durante el inicio de sesión. Por favor, inténtalo de nuevo más tarde.');
      setToastColor('danger');
      setShowToast(true);
    }
  };

  // const handleGoogleLogin = async () => {
  //   try {
  //     await signInWithGoogle();
  //     // Inicio de sesión con Google exitoso
  //     setShowToast(true);
  //   } catch (error) {
  //     console.error(error);
  //     // Inicio de sesión con Google fallido
  //     setShowToast(true);
  //   }
  // };

  if (user) {
    console.log(user.emailVerified);
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
        
        <div style={{ background: 'linear-gradient(to left, #202020, #808080)', 
        display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img src={logo} alt="Custom SVG" />
        </div>
        <br />
        <IonInput
          label="Correo electrónico"
          labelPlacement="floating"
          fill="outline"
          value={username}
          
          onIonChange={(e) => setUsername(e.detail.value!)}
        />
        <IonInput
          fill="outline"
          labelPlacement="floating"
          type="password"
          value={password}
          label="Contraseña"
          onIonChange={(e) => setPassword(e.detail.value!)}
        />
        <IonButton expand="full" color="dark" onClick={handleLogin}>
          Iniciar sesión
        </IonButton>
        {/* <IonButton expand="full" onClick={handleGoogleLogin}>
          Iniciar sesión con Google
        </IonButton > */}
        <IonContent className="ion-text-center">
          <IonRouterLink color='tertiary'  routerLink="/pages/reset_password"><u>¿Olvidaste tu contraseña?</u></IonRouterLink>
            <br />
          <IonLabel>¿No tienes una cuenta? </IonLabel>
          <IonRouterLink  color='tertiary' routerLink="/pages/register"><u>Regístrate</u></IonRouterLink>
        </IonContent>
       
        <IonToast
          isOpen={showToast}
          message={toastMessage}
          duration={2000}
          color={toastColor}
          onDidDismiss={() => setShowToast(false)}
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;
