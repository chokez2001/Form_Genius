import React, {useState } from "react";
import { IonPage, IonContent, IonInput, IonButton, IonRouterLink, IonToast, IonLabel } from "@ionic/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, sendPasswordReset } from "../models/user_control";


const ResetPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const [showToast, setShowToast] = useState(false);



  const handleResetPassword = async () => {
    try {
      await sendPasswordReset(email);
      setShowToast(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <IonPage>
      <IonContent>
       
            <IonInput
              type="text"
              value={email}
              onIonChange={(e) => setEmail(e.detail.value!)}
              placeholder="E-mail Address"
            />
            <IonButton color="success" expand="full" onClick={handleResetPassword}>
              Send password reset email
            </IonButton>
            <IonToast
              isOpen={showToast}
              message="Password reset email sent!"
              duration={2000}
              onDidDismiss={() => setShowToast(false)}
            />
            <IonContent className="ion-text-center">
                <IonLabel> Don't have an account? </IonLabel>
                <IonRouterLink color="tertiary" routerLink="/register"><u>Register</u></IonRouterLink> now.
            </IonContent>
             
           
      
      </IonContent>
    </IonPage>
  );
};

export default ResetPage;
