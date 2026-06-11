import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';

const Root = React.lazy(() => (window.location.pathname.startsWith('/admin') ? import('./AdminApp') : import('./App')));

function loadVercelInsights() {
  if (import.meta.env.DEV) return;
  for (const src of ['/_vercel/insights/script.js', '/_vercel/speed-insights/script.js']) {
    const script = document.createElement('script');
    script.defer = true;
    script.src = src;
    document.head.appendChild(script);
  }
}

loadVercelInsights();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <React.Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-field text-lg font-black text-court">Loading...</div>}>
      <Root />
    </React.Suspense>
  </React.StrictMode>,
);
