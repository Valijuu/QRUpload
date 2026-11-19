/** Ansicht des Fotos: Skala und Verschiebung (px) relativ zur Buehnenmitte. */
export interface ZoomView {
  readonly scale: number;
  readonly x: number;
  readonly y: number;
}

/** Groesse der Buehne und des darin eingepassten, ungezoomten Fotos (px). */
export interface ZoomBounds {
  readonly stageWidth: number;
  readonly stageHeight: number;
  readonly imageWidth: number;
  readonly imageHeight: number;
}

/** Punkt relativ zur Buehnenmitte (px). */
export interface Point {
  readonly x: number;
  readonly y: number;
}

export const MIN_SCALE = 1;
// Die Handy-Version (2560 px) bleibt bis etwa 3-fach scharf
export const MAX_SCALE = 3;
export const IDENTITY: ZoomView = { scale: MIN_SCALE, x: 0, y: 0 };

export function clampScale(scale: number): number {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale));
}

/** Haelt das Foto so, dass kein leerer Rand entsteht, solange es groesser als die Buehne ist. */
export function clampPan(view: ZoomView, bounds: ZoomBounds): ZoomView {
  const maxX = Math.max(0, (bounds.imageWidth * view.scale - bounds.stageWidth) / 2);
  const maxY = Math.max(0, (bounds.imageHeight * view.scale - bounds.stageHeight) / 2);
  return { scale: view.scale, x: clampAxis(view.x, maxX), y: clampAxis(view.y, maxY) };
}

/** Zoomt auf die neue Skala, sodass der Bildinhalt unter dem Punkt an seiner Stelle bleibt. */
export function zoomAt(view: ZoomView, newScale: number, point: Point, bounds: ZoomBounds): ZoomView {
  const scale = clampScale(newScale);
  if (scale === MIN_SCALE) return IDENTITY;
  const factor = scale / view.scale;
  return clampPan({
    scale,
    x: point.x - (point.x - view.x) * factor,
    y: point.y - (point.y - view.y) * factor,
  }, bounds);
}

function clampAxis(value: number, limit: number): number {
  // + 0 macht aus -0 eine 0, damit Vergleiche und Tests eindeutig bleiben
  return Math.min(limit, Math.max(-limit, value)) + 0;
}
