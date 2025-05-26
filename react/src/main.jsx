import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import router from './assets/router'; // Import your router configuration
import { ContextProvider } from './contexts/ContextProvider';
import 'bootstrap/dist/css/bootstrap.min.css';

// Ensure your root element exists in the HTML
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ContextProvider>  <RouterProvider router={router} /></ContextProvider>
  
  </StrictMode>
);
