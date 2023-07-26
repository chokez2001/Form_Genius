import { IonApp,IonRouterOutlet,setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
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

// import FormPage from './pages/';
import Inicio from './pages/Home';
import Login from './pages/Login';
import Registerpage from './pages/Register_page';
import ResetPage from './pages/Reset_password';
import Dashboardpage from './pages/Dashboard_page';
import FormulariosVaciosPage from './pages/Get_empty_forms';
import AgregarFormularioVacioPage from './pages/Newform';
import DetalleFormularioPage from './pages/fill_form';
import MyPage from './pages/Firetest';
import FormulariosVaciosSyncPage from './pages/Formularios_sync';
/* Theme variables */
import './theme/variables.css';



setupIonicReact();

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
          <Menu />
          <IonRouterOutlet id="main">
          <Route path="/home" component={Inicio} exact={true} />
          <Route exact path="/" render={() => <Redirect to="/home" />} />
          <Route exact path="/home" component={Inicio} />
          <Route path="/pages/login" component={Login} exact />
          <Route path="/pages/register" component={Registerpage} exact />
          <Route path="/pages/reset_password" component={ResetPage} exact />
          <Route path="/pages/dashboard" component={Dashboardpage} exact />
          <Route path="/pages/new" component={AgregarFormularioVacioPage} exact />
          <Route path="/pages/empty_forms" component={FormulariosVaciosPage} exact />
          <Route path="/pages/fill" component={DetalleFormularioPage} exact />
          <Route path="/pages/fire" component={MyPage} exact />
          <Route path="/pages/form_sync" component={FormulariosVaciosSyncPage} exact />
          </IonRouterOutlet>

      </IonReactRouter>
    </IonApp>
  );
};

export default App;
