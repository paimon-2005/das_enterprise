import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { store } from './app/store';
import router from './app/router';
import './index.css';

import ErrorBoundary from './components/ErrorBoundary';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <RouterProvider router={router} />
        <Toaster position="bottom-right" reverseOrder={false} />
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>
);
