export function mainImage(images: Image[]) {
  const mainImageFound = images.find((image) => image.isMainImage);
  return mainImageFound?.url;
}
