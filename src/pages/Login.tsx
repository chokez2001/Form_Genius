import React, { useState } from 'react';
import { IonContent, IonInput, IonButton, IonToast } from '@ionic/react';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showToast, setShowToast] = useState(false);

  const handleLogin = () => {
    // Aquí puedes implementar la lógica de inicio de sesión
    // Por ejemplo, validar las credenciales y mostrar un mensaje de éxito o error

    if (username && password) {
      // Lógica de inicio de sesión exitoso
      setShowToast(true);
    } else {
      // Lógica de inicio de sesión fallido
      setShowToast(false);
    }
  };

  return (
    <IonContent>
      <IonInput
        value={username}
        placeholder="Usuario"
        onIonChange={(e) => setUsername(e.detail.value!)}
      />
      <IonInput
        type="password"
        value={password}
        placeholder="Contraseña"
        onIonChange={(e) => setPassword(e.detail.value!)}
      />
      <IonButton expand="full" onClick={handleLogin}>
        Iniciar sesión
      </IonButton>
      <IonToast
        isOpen={showToast}
        message="Inicio de sesión exitoso"
        duration={2000}
        onDidDismiss={() => setShowToast(false)}
      />
    </IonContent>
  );
};

export default Login;
