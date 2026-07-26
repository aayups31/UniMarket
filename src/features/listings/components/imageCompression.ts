export type ImageCompressionOptions = {
  maxBytes?: number;
  maxWidth?: number;
  quality?: number;
};

export async function compressImageFile(file: File, options: ImageCompressionOptions = {}) {
  const maxBytes = options.maxBytes ?? 1_500_000;
  const maxWidth = options.maxWidth ?? 1_600;
  const quality = options.quality ?? 0.82;

  if (!file.type.startsWith('image/')) return file;
  if (file.size <= maxBytes) return file;

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) return file;

  let currentFile = file;
  let currentQuality = quality;
  let currentWidth = maxWidth;

  for (let attempt = 0; attempt < 4; attempt += 1) {
    const image = await loadImageElement(currentFile);
    const { width, height } = image;
    const scale = Math.min(1, currentWidth / Math.max(width, height));
    const targetWidth = Math.max(1, Math.round(width * scale));
    const targetHeight = Math.max(1, Math.round(height * scale));

    canvas.width = targetWidth;
    canvas.height = targetHeight;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, targetWidth, targetHeight);

    const compressedBlob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(
        (blob) => resolve(blob),
        currentFile.type.includes('png') ? 'image/png' : 'image/jpeg',
        currentQuality,
      );
    });

    if (!compressedBlob || compressedBlob.size === 0) break;

    if (compressedBlob.size <= maxBytes) {
      const mimeType = compressedBlob.type || currentFile.type;
      const extension = mimeType === 'image/png' ? 'png' : 'jpg';
      const name = currentFile.name.replace(/\.[^.]+$/, '') + `.${extension}`;
      return new File([compressedBlob], name, { type: mimeType });
    }

    currentFile = new File([compressedBlob], currentFile.name, { type: compressedBlob.type || currentFile.type });
    currentQuality = Math.max(0.55, currentQuality - 0.12);
    currentWidth = Math.max(900, Math.round(currentWidth * 0.9));
  }

  return file;
}

async function loadImageElement(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new window.Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Invalid image'));
    };
    image.src = url;
  });
}
