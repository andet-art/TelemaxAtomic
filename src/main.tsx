import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { AnimatePresence } from 'framer-motion';

import { ThemeProvider } from '@/components/ThemeProvider';
import App from './App.tsx';

import './index.css'; // Tailwind CSS
import '@fontsource/inter'; // Or use another font like '@fontsource/sora'
import i18n from './lib/i18n'; // i18n configuration

const rootElement = document.getElementById('root')!;

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <AnimatePresence mode="wait">
            <App />
          </AnimatePresence>
        </ThemeProvider>
      </I18nextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
