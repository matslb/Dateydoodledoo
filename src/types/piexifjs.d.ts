declare module 'piexifjs' {
  export interface ExifObject {
    '0th': { [key: number]: any };
    Exif: { [key: number]: any };
    GPS: { [key: number]: any };
    '1st': { [key: number]: any };
    thumbnail: string | null;
  }

  export const ImageIFD: { [key: string]: number };
  export const ExifIFD: { [key: string]: number };
  export const GPSIFD: { [key: string]: number };
  export const InteropIFD: { [key: string]: number };
  export const Tiff: { [key: string]: number };

  export function load(data: string): ExifObject;
  export function dump(exifObj: ExifObject): string;
  export function insert(exifBytes: string, jpeg: string): string;
  export function remove(jpeg: string): string;
}
