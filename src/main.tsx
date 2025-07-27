import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AnimatePresence } from 'framer-motion';

import App from './App.tsx';
import './index.css'; // Tailwind CSS
import '@fontsource/inter'; // System font (you can change to others like Sora or Plus Jakarta Sans)
import i18n from './lib/i18n'; // Your i18n config

const root = document.getElementById('root')!;

ReactDOM.createRoot(root).render(
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
