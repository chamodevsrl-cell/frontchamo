/** True when the browser finished loading an `<img>` that did not decode. */
export function isBrokenImage(img: {
  complete: boolean;
  naturalWidth: number;
}) {
  return img.complete && img.naturalWidth === 0;
}
