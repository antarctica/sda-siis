import './styles/index.css';

import { defineCustomElements as defineMapElements } from '@arcgis/map-components/dist/loader';

defineMapElements(window, {
  resourcesUrl: 'https://js.arcgis.com/map-components/4.30/assets/',
});

// Supports weights 300-800
import '@fontsource-variable/space-grotesk';

import { createRouter, RouterProvider } from '@tanstack/react-router';
import React from 'react';
import ReactDOM from 'react-dom/client';

// Import the generated route tree
import { routeTree } from './routeTree.gen';

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('No root element found');
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>,
  );
}
