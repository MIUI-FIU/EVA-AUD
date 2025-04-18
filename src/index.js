import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';
import { ChakraProvider } from '@chakra-ui/react';
import './unity/unitySettings';
import { UnityLoadProvider } from './unityMiddleware';
import AUDApp from './components/AUDApp';

const container = document.getElementById('root');
const root = createRoot(container); // Create a root.

// Determine which component to render based on URL search parameters
const params = new URLSearchParams(window.location.search);
const isFreeform = params.get('app') === 'freeform';
// const ComponentToRender = isFreeform ? App : AppSurvey;
// const ComponentToRender = App;

const ComponentToRender = AUDApp;


if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${process.env.PUBLIC_URL}/unityCacheServiceWorker.js`)
      .then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }, err => {
        console.log('ServiceWorker registration failed: ', err);
      });
  });
}

root.render(
  // <React.StrictMode>
    <ChakraProvider>
      <UnityLoadProvider>
        <ComponentToRender />
      </UnityLoadProvider>
    </ChakraProvider>
  // </React.StrictMode>
);