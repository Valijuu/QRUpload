/** Antwort von GET /api/gallery. */
export interface Photo {
  id: string;
  file: string;
}

export type ZipKind = 'original' | 'mobile';

export interface ZipPackage {
  name: string;
  bytes: number;
  kind: ZipKind;
}

export interface GalleryIndex {
  photos: Photo[];
  zips: ZipPackage[];
}
