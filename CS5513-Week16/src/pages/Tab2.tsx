/**
 * Photo Gallery Page (Tab2)
 * 
 * This page provides a photo gallery interface where users can view, add, share,
 * and delete photos. Photos are displayed in a grid layout, and users can interact
 * with them through floating action buttons (FABs) for taking new photos or selecting
 * from the device gallery. Clicking on a photo opens a detail modal with additional
 * options and metadata.
 */

// Import camera and images icons
import { camera, images } from 'ionicons/icons';
// CHANGE: Update import
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonFab,
  IonFabButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonToast,
  IonSpinner,
  IonText,
} from '@ionic/react';
import React, { useState } from 'react';
// Add `usePhotoGallery` import
import { usePhotoGallery, UserPhoto } from '../hooks/usePhotoGallery';
import PhotoDetailModal from '../components/PhotoDetailModal';
import './Tab2.css';

/**
 * Tab2 Component - Photo Gallery Page
 * 
 * Manages the user's photo gallery with capabilities to:
 * - Display photos in a responsive grid layout
 * - Take new photos using the device camera
 * - Select existing photos from the device gallery
 * - View photo details in a modal
 * - Share photos using native sharing capabilities
 * - Delete photos from the gallery
 * 
 * Uses the usePhotoGallery hook for all photo operations and state management.
 * Provides user feedback through toast notifications for success and error states.
 * 
 * @component
 * @returns {JSX.Element} The photo gallery page with grid layout and FAB controls
 */
const Tab2: React.FC = () => {
  /**
   * Photo gallery hook providing photo management functionality
   * - photos: Array of user photos
   * - addNewToGallery: Function to take a new photo with camera
   * - selectFromGallery: Function to select photo from device gallery
   * - deletePhoto: Function to delete a photo
   * - sharePhoto: Function to share a photo
   */
  const { photos, addNewToGallery, selectFromGallery, deletePhoto, sharePhoto } = usePhotoGallery();
  
  /** Currently selected photo for the detail modal */
  const [selectedPhoto, setSelectedPhoto] = useState<UserPhoto | null>(null);
  /** Controls visibility of the photo detail modal */
  const [isModalOpen, setIsModalOpen] = useState(false);
  /** Loading state for async photo operations */
  const [isLoading, setIsLoading] = useState(false);
  /** Message to display in toast notification */
  const [toastMessage, setToastMessage] = useState<string>('');
  /** Color theme for toast notification (success or danger) */
  const [toastColor, setToastColor] = useState<'success' | 'danger'>('success');
  /** Controls visibility of toast notification */
  const [showToast, setShowToast] = useState(false);

  /**
   * Displays an error toast notification
   * 
   * @param {string} message - Error message to display
   */
  const showError = (message: string) => {
    setToastMessage(message);
    setToastColor('danger');
    setShowToast(true);
  };

  /**
   * Displays a success toast notification
   * 
   * @param {string} message - Success message to display
   */
  const showSuccess = (message: string) => {
    setToastMessage(message);
    setToastColor('success');
    setShowToast(true);
  };

  /**
   * Handles photo thumbnail click events
   * 
   * Opens the photo detail modal with the selected photo's information.
   * 
   * @param {UserPhoto} photo - The photo that was clicked
   */
  const handlePhotoClick = (photo: UserPhoto) => {
    setSelectedPhoto(photo);
    setIsModalOpen(true);
  };

  /**
   * Closes the photo detail modal and clears the selected photo
   */
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPhoto(null);
  };

  /**
   * Handles taking a new photo with the device camera
   * 
   * Opens the camera interface, captures a photo, and adds it to the gallery.
   * Shows loading state and toast notifications for user feedback.
   */
  const handleAddPhoto = async () => {
    try {
      setIsLoading(true);
      await addNewToGallery();
      showSuccess('Photo added successfully!');
    } catch (error) {
      console.error('Error adding photo:', error);
      showError('Failed to add photo. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles selecting a photo from the device gallery
   * 
   * Opens the device's photo picker, allows user to select an existing photo,
   * and adds it to the gallery. Shows loading state and toast notifications.
   */
  const handleSelectFromGallery = async () => {
    try {
      setIsLoading(true);
      await selectFromGallery();
      showSuccess('Photo added from gallery!');
    } catch (error) {
      console.error('Error selecting from gallery:', error);
      showError('Failed to select photo from gallery.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles sharing a photo
   * 
   * Uses native sharing capabilities (Capacitor Share API on mobile,
   * Web Share API on web) to share the selected photo.
   * 
   * @param {UserPhoto} photo - The photo to share
   */
  const handleShare = async (photo: UserPhoto) => {
    try {
      await sharePhoto(photo);
      showSuccess('Photo shared successfully!');
    } catch (error) {
      console.error('Error sharing photo:', error);
      showError('Failed to share photo.');
      throw error;
    }
  };

  /**
   * Handles deleting a photo
   * 
   * Removes the photo from both the filesystem and the gallery state.
   * 
   * @param {string} filepath - The file path of the photo to delete
   */
  const handleDelete = async (filepath: string) => {
    try {
      await deletePhoto(filepath);
      showSuccess('Photo deleted successfully!');
    } catch (error) {
      console.error('Error deleting photo:', error);
      showError('Failed to delete photo.');
      throw error;
    }
  };

  /**
   * Empty State Component
   * 
   * Displays a message when no photos are available in the gallery,
   * encouraging users to take their first photo.
   * 
   * @component
   * @returns {JSX.Element} Empty state UI with camera icon and message
   */
  const EmptyState: React.FC = () => (
    <div className="empty-state" role="status" aria-live="polite">
      <IonIcon icon={camera} className="empty-state-icon" aria-hidden="true" />
      <IonText>
        <h2>No photos yet</h2>
        <p>Tap the camera button to take your first photo!</p>
      </IonText>
    </div>
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Photo Gallery</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Photo Gallery</IonTitle>
          </IonToolbar>
        </IonHeader>

        {isLoading && (
          <div className="loading-overlay" role="status" aria-live="polite" aria-label="Loading">
            <IonSpinner name="crescent" />
            <span className="sr-only">Loading photos</span>
          </div>
        )}

        {photos.length === 0 ? (
          <EmptyState />
        ) : (
          <IonGrid>
            <IonRow>
              {photos.map((photo) => (
                <IonCol size="6" key={photo.filepath}>
                  <div
                    className="photo-thumbnail"
                    onClick={() => handlePhotoClick(photo)}
                    role="button"
                    tabIndex={0}
                    aria-label={`View photo ${photos.indexOf(photo) + 1} of ${photos.length}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handlePhotoClick(photo);
                      }
                    }}
                  >
                    <IonImg src={photo.webviewPath} alt={`Photo ${photos.indexOf(photo) + 1}`} />
                  </div>
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>
        )}

        {/* Floating action buttons */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton 
            onClick={handleSelectFromGallery} 
            disabled={isLoading}
            aria-label="Select photo from gallery"
          >
            <IonIcon icon={images} aria-hidden="true"></IonIcon>
          </IonFabButton>
        </IonFab>
        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          <IonFabButton 
            onClick={handleAddPhoto} 
            disabled={isLoading}
            aria-label="Take a new photo"
          >
            <IonIcon icon={camera} aria-hidden="true"></IonIcon>
          </IonFabButton>
        </IonFab>

        <PhotoDetailModal
          isOpen={isModalOpen}
          photo={selectedPhoto}
          onClose={handleCloseModal}
          onShare={handleShare}
          onDelete={handleDelete}
        />

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          color={toastColor}
          position="top"
          aria-live={toastColor === 'danger' ? 'assertive' : 'polite'}
        />
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
