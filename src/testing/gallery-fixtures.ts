import { GalleryIndex } from '../app/services/gallery/gallery-index';

export const GALLERY_INDEX: GalleryIndex = {
  photos: [
    { id: 'aaaa0001', file: 'IMG_0001.jpg' },
    { id: 'bbbb0002', file: 'IMG_0002.jpg' },
    { id: 'cccc0003', file: 'IMG_0003.jpg' },
  ],
  zips: [
    { name: 'originale-1.zip', bytes: 1_000_000_000, kind: 'original' },
    { name: 'originale-2.zip', bytes: 400_000_000, kind: 'original' },
    { name: 'handy.zip', bytes: 950_000_000, kind: 'mobile' },
  ],
};
