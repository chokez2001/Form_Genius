import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
} from '@ionic/react';

import { useLocation } from 'react-router-dom';
import { folderOpenSharp, logInSharp, logOutSharp, newspaperSharp} from 'ionicons/icons';
import './Menu.css';


interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: 'Iniciar Sesión',
    url: '/pages/Login',
    iosIcon: logInSharp,
    mdIcon: logInSharp
  },
  {
    title: 'Crear Formularios',
    url: '/pages/new',
    iosIcon: newspaperSharp,
    mdIcon: newspaperSharp
  },
  {
    title: 'Mis formularios',
    url: '/pages/Empty_Forms',
    iosIcon: folderOpenSharp,
    mdIcon: folderOpenSharp
  },
  {
    title: 'Cerrar sesión',
    url: '/pages/new2',
    iosIcon: logOutSharp,
    mdIcon: logOutSharp
  },

];


const Menu: React.FC = () => {
  const location = useLocation();

  return (
    <IonMenu contentId="main" type="push">
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader>Menú</IonListHeader>

          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="inset" detail={true}>
                  <IonIcon aria-hidden="true" slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>

      </IonContent>
    </IonMenu>
  );
};

export default Menu;
