const BYTES_PER_GB = 1_000_000_000;
const BYTES_PER_MB = 1_000_000;
// Auch winzige Dateien werden als mindestens 1 MB angezeigt, nie als 0 MB
const MIN_DISPLAYED_MB = 1;

const GERMAN_LOCALE = 'de-DE';

const gbFormat = new Intl.NumberFormat(GERMAN_LOCALE, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const mbFormat = new Intl.NumberFormat(GERMAN_LOCALE, { maximumFractionDigits: 0 });

/** Dateigroesse fuer Menschen: ab 1 GB mit einer Nachkommastelle, darunter in ganzen MB. */
export function formatBytes(bytes: number): string {
  if (bytes >= BYTES_PER_GB) {
    return `${gbFormat.format(bytes / BYTES_PER_GB)} GB`;
  }
  return `${mbFormat.format(Math.max(MIN_DISPLAYED_MB, bytes / BYTES_PER_MB))} MB`;
}
