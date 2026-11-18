/**
 * Compresses an image file client-side using HTML5 Canvas.
 * Resizes large dimensions to maxDimension and converts to JPEG.
 * @param {File} file - Original file input
 * @param {number} maxDimension - Max width or height in px (default 1024)
 * @param {number} quality - JPEG compression quality 0.1 - 1.0 (default 0.75)
 * @returns {Promise<{ base64: string, sizeKb: number }>}
 */
export async function compressImage(file, maxDimension = 1024, quality = 0.75) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith("image/")) {
      return reject(new Error("Please select a valid image file."));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read image file."));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error("Failed to parse image."));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const base64 = canvas.toDataURL("image/jpeg", quality);
        const approxSizeKb = Math.round((base64.length * 3) / 4 / 1024);

        resolve({ base64, sizeKb: approxSizeKb });
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}
