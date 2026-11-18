export const environment = {
  production: false,
  // Relativ wie im Betrieb: ng serve leitet /api per proxy.conf.json an das lokale Backend weiter,
  // damit das Sitzungs-Cookie wie in Produktion auf derselben Domain liegt.
  apiBaseUrl: '',
  weddingImageUrl: '',
};
