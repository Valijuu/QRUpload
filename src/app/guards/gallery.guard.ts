import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { GalleryService } from '../services/gallery/gallery-service';

/**
 * Das Cookie ist HttpOnly und fuer den Browser-Code unsichtbar. Ob die Sitzung gilt,
 * zeigt erst die Antwort des Backends. Andere Fehler zeigt die Galerie selbst an.
 */
export const galleryGuard: CanActivateFn = async () => {
  // inject() nur vor dem ersten await, danach gibt es keinen Injection-Kontext mehr
  const router = inject(Router);
  const result = await inject(GalleryService).load();
  if (result.kind === 'unauthorized') {
    return router.createUrlTree(['/login']);
  }
  return true;
};
