import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
} from '@ionic/react';

import { useLocation } from 'react-router-dom';
import { colorFill, colorWand, folderOpenSharp, homeSharp, librarySharp, logInSharp, logOutSharp, newspaperSharp, personSharp, syncCircleSharp} from 'ionicons/icons';
import './Menu.css';


interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: 'Inicio',
    url: '/home',
    iosIcon: homeSharp,
    mdIcon: homeSharp
  },
  {
    title: 'Iniciar Sesión',
    url: '/pages/login',
    iosIcon: logInSharp,
    mdIcon: logInSharp
  },
  {
    title: 'Mi perfil',
    url: '/pages/dashboard',
    iosIcon: personSharp,
    mdIcon: personSharp
  },
  {
    title: 'Crear Formularios',
    url: '/pages/new',
    iosIcon: newspaperSharp,
    mdIcon: newspaperSharp
  },
  {
    title: 'Mis formularios',
    url: '/pages/empty_forms',
    iosIcon: librarySharp,
    mdIcon: librarySharp
  },

  {
    title: 'Formularios llenos locales',
    url: '/pages/fire',
    iosIcon: folderOpenSharp,
    mdIcon: folderOpenSharp
  },

  {
    title: 'Formularios llenos sincronizados',
    url: '/pages/form_sync',
    iosIcon: syncCircleSharp,
    mdIcon: syncCircleSharp
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
                <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="full" detail={true}>
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
