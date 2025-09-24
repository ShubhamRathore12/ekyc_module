export default function convertFileToBase64(file: File): Promise<string | ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () =>
      reader.result ? resolve(reader.result) : reject(new Error("Failed to load"));
    reader.onerror = (error) => reject(error);
  });
}
