/**
 * Photo Gallery Custom Hook
 * 
 * A custom React hook that manages photo gallery functionality including:
 * - Taking new photos with the device camera
 * - Selecting photos from the device gallery
 * - Storing photos in the filesystem
 * - Persisting photo metadata in Preferences
 * - Sharing photos using native or web APIs
 * - Deleting photos from storage
 * 
 * The hook handles platform-specific logic for web and hybrid (iOS/Android) platforms,
 * ensuring photos work correctly across all deployment targets.
 */

// Add import
import { useState, useEffect } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import type { Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { isPlatform } from '@ionic/react';
import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';

/**
 * usePhotoGallery Hook
 * 
 * Custom hook that provides photo gallery management functionality.
 * 
 * @returns {Object} An object containing:
 * - photos: Array of UserPhoto objects representing all saved photos
 * - addNewToGallery: Function to take a new photo with camera or select from gallery
 * - selectFromGallery: Function to select an existing photo from device gallery
 * - deletePhoto: Function to delete a photo by filepath
 * - sharePhoto: Function to share a photo using native or web sharing APIs
 * 
 * @example
 * ```tsx
 * const { photos, addNewToGallery, deletePhoto } = usePhotoGallery();
 * 
 * // Take a new photo
 * await addNewToGallery();
 * 
 * // Delete a photo
 * await deletePhoto(photos[0].filepath);
 * ```
 */
export function usePhotoGallery() {
    /**
     * State for storing all user photos
     * Initialized as an empty array and populated from Preferences on mount
     */
    const [photos, setPhotos] = useState<UserPhoto[]>([]);
    
    /**
     * Key used for storing photo metadata in Capacitor Preferences
     */
    const PHOTO_STORAGE = 'photos';

    /**
     * Loads saved photos from Preferences on component mount
     * 
     * On web platforms, also reads photo files from the filesystem and converts
     * them to data URLs for display. On hybrid platforms (iOS/Android), photos
     * are already accessible via their file paths.
     */
    useEffect(() => {
        /**
         * Loads photos from Preferences storage
         * 
         * Retrieves the photo list from Preferences, parses the JSON, and
         * on web platforms, reads each photo file and converts it to a data URL
         * for display in the webview.
         */
        const loadSaved = async () => {
            const { value: photoList } = await Preferences.get({ key: PHOTO_STORAGE });
            const photosInPreferences = (photoList ? JSON.parse(photoList) : []) as UserPhoto[];

            // CHANGE: Add platform check
            // If running on the web, read files and convert to data URLs
            if (!isPlatform('hybrid')) {
                for (const photo of photosInPreferences) {
                const readFile = await Filesystem.readFile({
                    path: photo.filepath,
                    directory: Directory.Data,
                });
                photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
                }
            }

            setPhotos(photosInPreferences);
        };

        loadSaved();
    }, []);
    
    /**
     * Adds a new photo to the gallery
     * 
     * Takes a photo using the device camera or selects from the photo gallery,
     * saves it to the filesystem, and updates the photos state and Preferences.
     * 
     * @param {CameraSource} source - The source for the photo (Camera or Photos). Defaults to Camera.
     * @returns {Promise<void>} Promise that resolves when the photo is saved
     */
    const addNewToGallery = async (source: CameraSource = CameraSource.Camera) => {
    // Take a photo or select from gallery
    const capturedPhoto = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: source,
        quality: 100,
    });

  // Create the `fileName` with current timestamp
    const fileName = Date.now() + '.jpeg';
    // Add `savedImageFile`
    // Save the picture and add it to photo collection
    const savedImageFile = await savePicture(capturedPhoto, fileName);

    // Update state with new photo
    const newPhotos = [savedImageFile, ...photos];
    setPhotos(newPhotos);

    // Add method to cache all photo data for future retrieval
    Preferences.set({ key: PHOTO_STORAGE, value: JSON.stringify(newPhotos) });
  };

  /**
   * Selects a photo from the device gallery
   * 
   * Opens the device's photo picker to allow the user to select an existing
   * photo from their gallery. This is a convenience wrapper around addNewToGallery
   * with the Photos source.
   * 
   * @returns {Promise<void>} Promise that resolves when the photo is selected and saved
   */
  const selectFromGallery = async () => {
    return addNewToGallery(CameraSource.Photos);
  };

  /**
   * Saves a photo to the filesystem and returns photo metadata
   * 
   * Handles platform-specific logic for saving photos:
   * - On hybrid platforms: Reads the photo file directly from the camera path
   * - On web: Fetches the photo from webPath and converts it to base64
   * 
   * The photo is saved to the app's data directory and metadata is returned
   * for storage in Preferences.
   * 
   * @param {Photo} photo - The photo object from Capacitor Camera API
   * @param {string} fileName - The filename to use when saving (typically timestamp-based)
   * @returns {Promise<UserPhoto>} Promise that resolves with the saved photo metadata
   */
  const savePicture = async (photo: Photo, fileName: string): Promise<UserPhoto> => {
  let base64Data: string | Blob;
  let fileSize: number = 0;
  // CHANGE: Add platform check
  // "hybrid" will detect mobile - iOS or Android
  if (isPlatform('hybrid')) {
    const readFile = await Filesystem.readFile({
      path: photo.path!,
    });
    base64Data = readFile.data;
    fileSize = (readFile.data as string).length;
  } else {
    // Fetch the photo, read as a blob, then convert to base64 format
    const response = await fetch(photo.webPath!);
    const blob = await response.blob();
    base64Data = (await convertBlobToBase64(blob)) as string;
    fileSize = blob.size;
  }

  const savedFile = await Filesystem.writeFile({
    path: fileName,
    data: base64Data,
    directory: Directory.Data,
  });

  const now = Date.now();

  // CHANGE: Add platform check
  if (isPlatform('hybrid')) {
    // Display the new image by rewriting the 'file://' path to HTTP
    return {
      filepath: savedFile.uri,
      webviewPath: Capacitor.convertFileSrc(savedFile.uri),
      dateTaken: now,
      size: fileSize,
    };
  } else {
    // Use webPath to display the new image instead of base64 since it's
    // already loaded into memory
    return {
      filepath: fileName,
      webviewPath: photo.webPath,
      dateTaken: now,
      size: fileSize,
    };
  }
};

  /**
   * Converts a Blob to a base64 data URL string
   * 
   * Utility function used on web platforms to convert photo blobs to base64
   * format for storage in the filesystem.
   * 
   * @param {Blob} blob - The blob to convert
   * @returns {Promise<string>} Promise that resolves with the base64 data URL string
   */
  const convertBlobToBase64 = (blob: Blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
  };

  /**
   * Deletes a photo from the filesystem and updates state
   * 
   * Removes the photo file from the filesystem, removes it from the photos state,
   * and updates Preferences storage. Handles both URI paths (hybrid) and plain
   * filenames (web) by extracting the filename when necessary.
   * 
   * @param {string} filepath - The filepath of the photo to delete
   * @returns {Promise<void>} Promise that resolves when the photo is deleted
   * @throws {Error} If the deletion fails
   */
  const deletePhoto = async (filepath: string) => {
    try {
      // Extract filename from filepath (handle both URI and plain filename)
      let filename = filepath;
      if (isPlatform('hybrid') && filepath.includes('/')) {
        // Extract filename from URI path
        const parts = filepath.split('/');
        filename = parts[parts.length - 1];
      }

      // Remove from filesystem
      await Filesystem.deleteFile({
        path: filename,
        directory: Directory.Data,
      });

      // Update state
      const updatedPhotos = photos.filter((photo) => photo.filepath !== filepath);
      setPhotos(updatedPhotos);

      // Update Preferences storage
      Preferences.set({ key: PHOTO_STORAGE, value: JSON.stringify(updatedPhotos) });
    } catch (error) {
      console.error('Error deleting photo:', error);
      throw error;
    }
  };

  /**
   * Shares a photo using native or web sharing APIs
   * 
   * Platform-specific sharing implementation:
   * - Hybrid (iOS/Android): Uses Capacitor Share API for native sharing
   * - Web: Uses Web Share API if available, falls back to download
   * 
   * On web platforms, if the Web Share API is not available or fails,
   * the photo is automatically downloaded as a fallback.
   * 
   * @param {UserPhoto} photo - The photo object to share
   * @returns {Promise<void>} Promise that resolves when sharing is initiated
   * @throws {Error} If sharing fails
   */
  const sharePhoto = async (photo: UserPhoto) => {
    try {
      if (isPlatform('hybrid')) {
        // Use Capacitor Share API for native platforms
        if (photo.webviewPath) {
          await Share.share({
            title: 'Share Photo',
            text: 'Check out this photo!',
            url: photo.webviewPath,
            dialogTitle: 'Share Photo',
          });
        }
      } else {
        // Web fallback: use Web Share API or download
        if (navigator.share && photo.webviewPath) {
          try {
            // Convert data URL to blob for sharing
            const response = await fetch(photo.webviewPath);
            const blob = await response.blob();
            const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
            
            await navigator.share({
              title: 'Share Photo',
              text: 'Check out this photo!',
              files: [file],
            });
          } catch (shareError) {
            // Fallback to download if share fails
            const link = document.createElement('a');
            link.href = photo.webviewPath!;
            link.download = 'photo.jpg';
            link.click();
          }
        } else {
          // Fallback: download the photo
          const link = document.createElement('a');
          link.href = photo.webviewPath!;
          link.download = 'photo.jpg';
          link.click();
        }
      }
    } catch (error) {
      console.error('Error sharing photo:', error);
      throw error;
    }
  };

  return {
    addNewToGallery,
    selectFromGallery,
    deletePhoto,
    sharePhoto,
    // Update return statement to include `photos` array
    photos,
  };
}

/**
 * UserPhoto Interface
 * 
 * Represents a photo in the user's gallery with metadata and file paths.
 * 
 * @interface UserPhoto
 * @property {string} filepath - The file path or URI where the photo is stored
 * @property {string} [webviewPath] - The path/URL used to display the photo in the webview
 *                                    (data URL on web, converted file URI on hybrid)
 * @property {number} [dateTaken] - Unix timestamp (milliseconds) when the photo was taken/added
 * @property {number} [size] - File size in bytes
 */
export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
  dateTaken?: number;
  size?: number;
}