// Vorlage: Diese Datei nach environment.prod.ts kopieren und eigene Werte
// eintragen. environment.prod.ts ist in .gitignore und wird niemals committet.
export const environment = {
  production: true,
  // Leer lassen: Firebase Hosting leitet /api/** per Rewrite an Cloud Run weiter.
  apiBaseUrl: '',
  weddingImageUrl: 'REPLACE_WITH_URL_TO_YOUR_PHOTO',
};
