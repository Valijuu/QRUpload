import { clampPan, clampScale, IDENTITY, MAX_SCALE, MIN_SCALE, zoomAt, ZoomBounds } from './zoom-math';

// Buehne 400x800, eingepasstes Foto 400x300 (Querformat auf dem Handy)
const bounds: ZoomBounds = { stageWidth: 400, stageHeight: 800, imageWidth: 400, imageHeight: 300 };

describe('zoom-math', () => {
  it('begrenzt die Skala auf 1 bis 3', () => {
    expect(clampScale(0.5)).toBe(MIN_SCALE);
    expect(clampScale(2)).toBe(2);
    expect(clampScale(5)).toBe(MAX_SCALE);
  });

  it('zoomt um die Mitte ohne Verschiebung', () => {
    expect(zoomAt(IDENTITY, 2, { x: 0, y: 0 }, bounds)).toEqual({ scale: 2, x: 0, y: 0 });
  });

  it('haelt beim Zoomen um einen Punkt diesen Punkt an seiner Stelle', () => {
    // Punkt 100 px rechts der Mitte: nach 2-fach Zoom liegt der Bildinhalt dort weiterhin unter dem Finger
    const view = zoomAt(IDENTITY, 2, { x: 100, y: 0 }, bounds);
    expect(view).toEqual({ scale: 2, x: -100, y: 0 });
  });

  it('verschiebt nicht ueber den Bildrand hinaus', () => {
    // Bei 2-fach ist das Foto 800 breit, die Buehne 400: hoechstens 200 nach jeder Seite
    expect(clampPan({ scale: 2, x: 500, y: 0 }, bounds)).toEqual({ scale: 2, x: 200, y: 0 });
    expect(clampPan({ scale: 2, x: -500, y: 0 }, bounds)).toEqual({ scale: 2, x: -200, y: 0 });
  });

  it('laesst ein Foto, das kleiner als die Buehne ist, mittig', () => {
    // 2-fach Hoehe 600 < Buehne 800: keine senkrechte Verschiebung
    expect(clampPan({ scale: 2, x: 0, y: 300 }, bounds)).toEqual({ scale: 2, x: 0, y: 0 });
  });

  it('zoomt auf 1 wieder auf die Ausgangslage zurueck', () => {
    expect(zoomAt({ scale: 3, x: 150, y: 0 }, 1, { x: 50, y: 20 }, bounds)).toEqual(IDENTITY);
  });
});
