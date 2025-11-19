/**
 * Converts an image file (JPEG, PNG) to base64 encoded string
 * @param file - The image file to convert
 * @returns Promise resolving to base64 encoded string
 */
export async function imageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix (e.g., "data:image/png;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read image file'));
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * Validates if a file is a supported image format
 * @param file - The file to validate
 * @returns true if file is a supported image format
 */
export function isImageFile(file: File): boolean {
  const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  return supportedTypes.includes(file.type);
}

