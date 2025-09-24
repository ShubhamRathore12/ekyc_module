import { renameExtension } from "./rename-extension";

const defaultQuality = 0.8; // JPEG quality (0.0 - 1.0)

export function convertFileToJPEG(file: File, quality = defaultQuality): Promise<File> {
  return new Promise(function (resolve, reject) {
    const reader = new FileReader();
    reader.onload = function (event) {
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0);

        // Convert the canvas to JPEG Blob
        canvas.toBlob(
          function (blob) {
            resolve(
              new File([blob as Blob], renameExtension(file.name), {
                type: "image/jpeg",
                lastModified: Date.now(),
              })
            );
          },
          "image/jpeg",
          quality
        );
      };

      img.src = URL.createObjectURL(file);
    };
    reader.readAsDataURL(file);
  });
}
