import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import App from './App.tsx';
import { hydrateStores, setupAutoSave } from './store/persist';
import './index.css';

// Initialize app with persisted state
async function initApp() {
  try {
    // Hydrate stores from persisted state
    await hydrateStores();

    // Setup auto-save
    setupAutoSave();
  } catch (error) {
    console.error('Error initializing persistence:', error);
    // Continue anyway - persistence is optional
  }

  // Render app
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <App />
          </ThemeProvider>
        </I18nextProvider>
      </BrowserRouter>
    </StrictMode>
  );
}

initApp();
