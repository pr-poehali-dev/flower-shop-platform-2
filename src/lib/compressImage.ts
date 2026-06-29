const TARGET_BYTES = 10 * 1024;

function dataUrlBytes(dataUrl: string): number {
  const base64 = dataUrl.split(',')[1] || '';
  return Math.floor((base64.length * 3) / 4);
}

export async function compressImageTo10kb(file: File): Promise<string> {
  const bitmap = await loadImage(file);

  let maxSide = 600;
  let quality = 0.8;
  let result = '';

  for (let attempt = 0; attempt < 12; attempt++) {
    const canvas = document.createElement('canvas');
    const ratio = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    canvas.width = Math.max(1, Math.round(bitmap.width * ratio));
    canvas.height = Math.max(1, Math.round(bitmap.height * ratio));

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas not supported');
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    result = canvas.toDataURL('image/jpeg', quality);

    if (dataUrlBytes(result) <= TARGET_BYTES) {
      return result;
    }

    if (quality > 0.35) {
      quality -= 0.12;
    } else {
      maxSide = Math.round(maxSide * 0.8);
      quality = 0.7;
    }
  }

  return result;
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
