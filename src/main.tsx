import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { OsProvider } from '@openstrata/ai-ui-kit';
import { App } from './App';
import { SessionProvider } from './infrastructure/session';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <OsProvider>
      <SessionProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </SessionProvider>
    </OsProvider>
  </React.StrictMode>,
);
