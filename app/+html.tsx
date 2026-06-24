import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren } from 'react';

/**
 * Coquille HTML de la version web (rendue statiquement à l'export).
 * Ajoute le manifest PWA, les couleurs, et l'enregistrement du service worker
 * pour permettre l'installation « sur l'écran d'accueil » et le hors-ligne.
 */
const swRegister = `
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/sw.js').catch(function () {});
  });
}`;

const backgroundColor = `
body { background-color: #FFF6EC; }
@media (prefers-color-scheme: dark) { body { background-color: #FFF6EC; } }`;

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, shrink-to-fit=no, viewport-fit=cover"
        />
        <title>Spanish App</title>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#C75B39" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Spanish App" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: backgroundColor }} />
        <script dangerouslySetInnerHTML={{ __html: swRegister }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
