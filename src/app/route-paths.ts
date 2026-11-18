/** Pfadsegmente der Routen (fuer die Routentabelle). */
export const LOGIN_PATH = 'login';
export const GALLERY_PATH = 'galerie';

/** Absolute URLs derselben Routen (fuer Router.navigate und createUrlTree). */
export const LOGIN_URL = `/${LOGIN_PATH}`;
export const GALLERY_URL = `/${GALLERY_PATH}`;

/** Schluessel in Route.data: die Seite braucht den breiten statt des schmalen Rahmens. */
export const WIDE_ROUTE_FLAG = 'wide';
