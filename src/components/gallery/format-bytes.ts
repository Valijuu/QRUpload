const BYTES_PER_GB = 1_000_000_000;
const BYTES_PER_MB = 1_000_000;

const gbFormat = new Intl.NumberFormat('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const mbFormat = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 });

/** Dateigroesse fuer Menschen: ab 1 GB mit einer Nachkommastelle, darunter in ganzen MB. */
export function formatBytes(bytes: number): string {
  if (bytes >= BYTES_PER_GB) {
    return `${gbFormat.format(bytes / BYTES_PER_GB)} GB`;
  }
  return `${mbFormat.format(Math.max(1, bytes / BYTES_PER_MB))} MB`;
}
