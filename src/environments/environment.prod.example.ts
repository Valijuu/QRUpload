// Vorlage: Diese Datei nach environment.prod.ts kopieren und eigene Werte
// eintragen. environment.prod.ts ist in .gitignore und wird niemals committet.
export const environment = {
  production: true,
  apiBaseUrl: 'REPLACE_WITH_CLOUD_RUN_URL',
  uploadUrl: 'REPLACE_WITH_REAL_NEXTCLOUD_LINK',
  weddingImageUrl: 'REPLACE_WITH_URL_TO_YOUR_PHOTO',
};
