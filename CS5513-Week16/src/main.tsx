/**
 * Application Entry Point
 * 
 * This file initializes the React application and sets up PWA (Progressive Web App)
 * elements required for Capacitor camera functionality. It serves as the bootstrap
 * point for the entire photo gallery application.
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
// Week 15
import { defineCustomElements } from '@ionic/pwa-elements/loader';

/**
 * Initialize PWA Elements
 * 
 * Defines custom elements required for Capacitor plugins (specifically camera functionality)
 * to work properly in web environments. This must be called before rendering the app
 * to ensure camera modals and other native-like components are available.
 */
defineCustomElements(window);

/**
 * Application Root Container
 * 
 * Gets the root DOM element where the React application will be mounted.
 * The non-null assertion (!) is safe here as the root element is guaranteed
 * to exist in the index.html file.
 */
const container = document.getElementById('root');
const root = createRoot(container!);

/**
 * Render Application
 * 
 * Renders the App component wrapped in React.StrictMode for development-time
 * checks and warnings. StrictMode helps identify potential problems in the
 * application by enabling additional checks and warnings.
 */
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);