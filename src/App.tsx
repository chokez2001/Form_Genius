import { IonApp, IonButtons, IonMenuButton, IonRouterOutlet, IonSplitPane, IonTitle, IonToolbar, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route } from 'react-router-dom';
import Menu from './components/Menu';




/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

// import FormPage from './pages/view_json';
import guardarFormulario from './pages/newform';
import Login from './pages/Login';
import FormulariosVaciosPage from './pages/get_empty_forms';
import LlenarFormulario from './pages/fill_form';
import Inicio from './pages/Inicio';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
          <Menu />
          <IonRouterOutlet id="main">
          <Route path="/" exact={true} />
          <Route exact path="/home" component={Inicio} />
          <Route path="/pages/login" component={Login} exact />
          <Route path="/pages/new" component={guardarFormulario} exact />
          <Route path="/pages/empty_forms" component={FormulariosVaciosPage} exact />
          <Route path="/pages/fill_form" component={LlenarFormulario} exact />
          </IonRouterOutlet>

      </IonReactRouter>
    </IonApp>
  );
};

export default App;
