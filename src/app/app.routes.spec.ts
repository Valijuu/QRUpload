import { routes } from './app.routes';
import { Home } from '../components/home/home';
import { Login } from '../components/login/login';
import { Gallery } from '../components/gallery/gallery';
import { galleryGuard } from './guards/gallery.guard';

describe('routes', () => {
  it('hat nur Dankeseite, Login und Galerie', () => {
    expect(routes.find((route) => route.path === '')?.component).toBe(Home);
    expect(routes.find((route) => route.path === 'login')?.component).toBe(Login);
    expect(routes.find((route) => route.path === 'galerie')?.component).toBe(Gallery);
    expect(routes.map((route) => route.path)).toEqual(['', 'login', 'galerie', '**']);
  });

  it('schützt die Galerie mit dem Guard', () => {
    expect(routes.find((route) => route.path === 'galerie')?.canActivate).toEqual([galleryGuard]);
  });

  it('leitet unbekannte und alte Pfade auf die Startseite um', () => {
    expect(routes.find((route) => route.path === '**')?.redirectTo).toBe('');
  });

  it('markiert die Galerie als breite Seite', () => {
    expect(routes.find((route) => route.path === 'galerie')?.data?.['wide']).toBe(true);
  });
});
