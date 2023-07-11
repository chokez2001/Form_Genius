import React from 'react';
import FormBuilder from '../components/form_builder';
import { IonContent, IonPage } from '@ionic/react';

const create_form: React.FC = () => {
    return (
      <IonPage>
        <IonContent>
          <FormBuilder />
        </IonContent>
      </IonPage>
    );
  };
  
  export default create_form;
  