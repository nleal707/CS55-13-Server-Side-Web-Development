/**
 * Main Application Component
 * 
 * This is the root component of the photo gallery application. It sets up the Ionic
 * framework, configures routing with React Router, and defines the tab-based navigation
 * structure. The app consists of three main tabs: Articles, Photos, and Places, with
 * additional detail pages for viewing individual articles and places.
 */

import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
// Update the following import. Change label ellipse to images.
import { images, mapOutline, newspaper, newspaperOutline, square, triangle } from 'ionicons/icons';
import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';
import Tab3 from './pages/Tab3';
import ArticleDetail from './pages/ArticleDetail';
import PlaceDetail from './pages/PlaceDetail';

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

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
/* Animations */
import './theme/animations.css';
/* Accessibility styles */
import './theme/accessibility.css';
/* App styles */
import './App.css';

/**
 * Initialize Ionic React
 * 
 * Sets up Ionic React components and configuration. This must be called before
 * using any Ionic components in the application.
 */
setupIonicReact();

/**
 * App Component
 * 
 * The root component that provides the application structure with:
 * - Tab-based navigation (Articles, Photos, Places)
 * - Route definitions for all pages
 * - Bottom tab bar for primary navigation
 * 
 * Routing Structure:
 * - /tab1 - Articles listing page
 * - /tab2 - Photo gallery page
 * - /tab3 - Places listing page
 * - /article - Article detail view (accessed via navigation from Tab1)
 * - /place - Place detail view (accessed via navigation from Tab3)
 * - / - Redirects to /tab1 (default route)
 * 
 * @component
 * @returns {JSX.Element} The root application component with routing and tab navigation
 */
const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          {/* Articles tab - displays list of articles from WordPress API */}
          <Route exact path="/tab1">
            <Tab1 />
          </Route>
          {/* Photos tab - displays user's photo gallery with camera functionality */}
          <Route exact path="/tab2">
            <Tab2 />
          </Route>
          {/* Places tab - displays list of places from WordPress API */}
          <Route path="/tab3">
            <Tab3 />
          </Route>
          {/* Article detail page - shows full article content */}
          <Route exact path="/article">
            <ArticleDetail />
          </Route>
          {/* Place detail page - shows full place information with metadata */}
          <Route exact path="/place">
            <PlaceDetail />
          </Route>
          {/* Default route - redirects to Articles tab */}
          <Route exact path="/">
            <Redirect to="/tab1" />
          </Route>
        </IonRouterOutlet>
        {/* Bottom tab bar navigation */}
        <IonTabBar slot="bottom">
          <IonTabButton tab="tab1" href="/tab1" aria-label="Articles tab">
            <IonIcon aria-hidden="true" icon={newspaper} />
            <IonLabel>Articles</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab2" href="/tab2" aria-label="Photos tab">
             {/* Update icon ellipse to images */}
            <IonIcon aria-hidden="true" icon={images} />
            {/* Update Tab2 label to Photos */}
            <IonLabel>Photos</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab3" href="/tab3" aria-label="Places tab">
            <IonIcon aria-hidden="true" icon={mapOutline} />
            <IonLabel>Places</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
