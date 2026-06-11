import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';

const Root = React.lazy(() => (window.location.pathname.startsWith('/admin') ? import('./AdminApp') : import('./App')));

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <React.Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-field text-lg font-black text-court">Loading...</div>}>
      <Root />
    </React.Suspense>
  </React.StrictMode>,
);
