import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';

// Aeltere Safari-Versionen (iPad) kennen die Fullscreen-API nur mit webkit-Praefix
interface WebkitDocument {
  webkitFullscreenEnabled?: boolean;
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
}

interface WebkitElement {
  webkitRequestFullscreen?: () => Promise<void> | void;
}

const CHANGE_EVENTS = ['fullscreenchange', 'webkitfullscreenchange'];

/** Zugriff auf das echte Vollbild des Geraets. Auf dem iPhone gibt es das fuer Bilder nicht. */
@Injectable({ providedIn: 'root' })
export class FullscreenService {
  private readonly document = inject(DOCUMENT);

  isSupported(): boolean {
    const doc = this.document as Document & WebkitDocument;
    return Boolean(doc.fullscreenEnabled || doc.webkitFullscreenEnabled);
  }

  isActive(): boolean {
    const doc = this.document as Document & WebkitDocument;
    return Boolean(doc.fullscreenElement ?? doc.webkitFullscreenElement);
  }

  async enter(element: HTMLElement): Promise<boolean> {
    if (!this.isSupported()) return false;
    const target = element as HTMLElement & WebkitElement;
    const request = target.requestFullscreen ?? target.webkitRequestFullscreen;
    try {
      await request?.call(target);
      return true;
    } catch {
      // Der Browser kann ablehnen (z. B. ohne Nutzergeste); dann bleibt es beim Ausblenden der Bedienung
      return false;
    }
  }

  async exit(): Promise<void> {
    if (!this.isActive()) return;
    const doc = this.document as Document & WebkitDocument;
    const exit = doc.exitFullscreen ?? doc.webkitExitFullscreen;
    try {
      await exit?.call(doc);
    } catch {
      // Schon beendet, z. B. durch die Zurueck-Geste: nichts zu tun
    }
  }

  /** Meldet jeden Wechsel ins oder aus dem Vollbild; liefert die Abmeldung. */
  onChange(listener: () => void): () => void {
    for (const event of CHANGE_EVENTS) this.document.addEventListener(event, listener);
    return () => {
      for (const event of CHANGE_EVENTS) this.document.removeEventListener(event, listener);
    };
  }
}
