import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./firebase";

/**
 * Upload a file to Firebase Storage and return its download URL.
 * @param file - The file to upload
 * @param path - Storage path (e.g., "properties/abc123/photo1.jpg")
 * @param onProgress - Optional progress callback (0-100)
 * @returns The public download URL
 */
export async function uploadFile(
  file: File,
  path: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  const storageRef = ref(storage, path);
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(progress);
      },
      (error) => reject(error),
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(url);
      }
    );
  });
}

/**
 * Upload multiple files and return array of download URLs.
 */
export async function uploadMultipleFiles(
  files: File[],
  basePath: string,
  onProgress?: (fileIndex: number, progress: number) => void
): Promise<string[]> {
  const urls: string[] = [];
  for (let i = 0; i < files.length; i++) {
    const ext = files[i].name.split(".").pop() || "jpg";
    const fileName = `${Date.now()}_${i}.${ext}`;
    const url = await uploadFile(
      files[i],
      `${basePath}/${fileName}`,
      (progress) => onProgress?.(i, progress)
    );
    urls.push(url);
  }
  return urls;
}

/**
 * Upload a property photo. Use this when creating/editing properties.
 * Path: properties/{propertyId or 'new'}/photos/{timestamp}.ext
 */
export async function uploadPropertyPhoto(
  file: File,
  propertyId: string = "new",
  onProgress?: (progress: number) => void
): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `properties/${propertyId}/photos/${Date.now()}.${ext}`;
  return uploadFile(file, path, onProgress);
}

/**
 * Upload multiple property photos.
 */
export async function uploadPropertyPhotos(
  files: File[],
  propertyId: string = "new",
  onProgress?: (fileIndex: number, progress: number) => void
): Promise<string[]> {
  return uploadMultipleFiles(files, `properties/${propertyId}/photos`, onProgress);
}

/**
 * Upload a maintenance request photo.
 */
export async function uploadMaintenancePhoto(
  file: File,
  requestId: string = "new",
  onProgress?: (progress: number) => void
): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `maintenance/${requestId}/photos/${Date.now()}.${ext}`;
  return uploadFile(file, path, onProgress);
}

/**
 * Upload a user profile photo.
 */
export async function uploadProfilePhoto(
  file: File,
  userId: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `users/${userId}/profile.${ext}`;
  return uploadFile(file, path, onProgress);
}

/**
 * Upload a lease document (PDF, etc).
 */
export async function uploadLeaseDocument(
  file: File,
  leaseId: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  const ext = file.name.split(".").pop() || "pdf";
  const path = `leases/${leaseId}/documents/${Date.now()}.${ext}`;
  return uploadFile(file, path, onProgress);
}

/**
 * Delete a file from Firebase Storage by its download URL.
 */
export async function deleteFileByUrl(url: string): Promise<void> {
  try {
    const fileRef = ref(storage, url);
    await deleteObject(fileRef);
  } catch (error) {
    console.error("Failed to delete file:", error);
  }
}
