/**
 * Photo Detail Modal Component
 * 
 * A modal component that displays detailed information about a selected photo,
 * including the full-size image, metadata (date taken and file size), and action
 * buttons for sharing and deleting. The modal includes a confirmation alert before
 * deleting to prevent accidental data loss.
 */

import React from 'react';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  IonButtons,
  IonImg,
  IonText,
  IonAlert,
} from '@ionic/react';
import { close, shareOutline, trashOutline } from 'ionicons/icons';
import { UserPhoto } from '../hooks/usePhotoGallery';
import './PhotoDetailModal.css';

/**
 * Photo Detail Modal Props Interface
 * 
 * Defines the props required by the PhotoDetailModal component.
 * 
 * @interface PhotoDetailModalProps
 * @property {boolean} isOpen - Controls the visibility of the modal
 * @property {UserPhoto | null} photo - The photo object to display, or null if no photo is selected
 * @property {() => void} onClose - Callback function called when the modal should be closed
 * @property {(photo: UserPhoto) => Promise<void>} onShare - Async callback function to share the photo
 * @property {(filepath: string) => Promise<void>} onDelete - Async callback function to delete the photo
 */
interface PhotoDetailModalProps {
  isOpen: boolean;
  photo: UserPhoto | null;
  onClose: () => void;
  onShare: (photo: UserPhoto) => Promise<void>;
  onDelete: (filepath: string) => Promise<void>;
}

/**
 * PhotoDetailModal Component
 * 
 * Displays a modal with photo details and action buttons. The modal shows:
 * - Full-size photo image
 * - Photo metadata (date taken, file size)
 * - Share button (with loading state)
 * - Delete button (with confirmation alert)
 * 
 * The component manages its own internal state for delete confirmation and
 * loading states, while delegating actual share/delete operations to parent callbacks.
 * 
 * @component
 * @param {PhotoDetailModalProps} props - Component props
 * @returns {JSX.Element | null} The photo detail modal or null if no photo is provided
 */
const PhotoDetailModal: React.FC<PhotoDetailModalProps> = ({
  isOpen,
  photo,
  onClose,
  onShare,
  onDelete,
}) => {
  /** Controls visibility of the delete confirmation alert */
  const [showDeleteAlert, setShowDeleteAlert] = React.useState(false);
  /** Loading state for delete operation */
  const [isDeleting, setIsDeleting] = React.useState(false);
  /** Loading state for share operation */
  const [isSharing, setIsSharing] = React.useState(false);

  /**
   * Handles the share photo action
   * 
   * Calls the onShare callback with the current photo and manages the sharing
   * loading state. Errors are logged but not displayed to the user (handled by parent).
   */
  const handleShare = async () => {
    if (!photo) return;
    try {
      setIsSharing(true);
      await onShare(photo);
    } catch (error) {
      console.error('Failed to share photo:', error);
    } finally {
      setIsSharing(false);
    }
  };

  /**
   * Handles the confirmed delete action
   * 
   * Called after user confirms deletion in the alert dialog. Calls the onDelete
   * callback with the photo's filepath, closes the alert, and then closes the modal.
   * Errors are logged but not displayed to the user (handled by parent).
   */
  const handleDeleteConfirm = async () => {
    if (!photo) return;
    try {
      setIsDeleting(true);
      await onDelete(photo.filepath);
      setShowDeleteAlert(false);
      onClose();
    } catch (error) {
      console.error('Failed to delete photo:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  /**
   * Formats a timestamp into a human-readable date string
   * 
   * Converts a Unix timestamp (milliseconds) into a formatted date string
   * with full month name, day, year, and time.
   * 
   * @param {number | undefined} timestamp - Unix timestamp in milliseconds
   * @returns {string} Formatted date string or "Unknown date" if timestamp is missing
   */
  const formatDate = (timestamp?: number): string => {
    if (!timestamp) return 'Unknown date';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  /**
   * Formats file size in bytes into a human-readable string
   * 
   * Converts bytes to the most appropriate unit (B, KB, or MB) with one decimal place.
   * 
   * @param {number | undefined} bytes - File size in bytes
   * @returns {string} Formatted size string (e.g., "1.5 MB") or "Unknown size" if bytes is missing
   */
  const formatSize = (bytes?: number): string => {
    if (!bytes) return 'Unknown size';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (!photo) return null;

  return (
    <>
      <IonModal isOpen={isOpen} onDidDismiss={onClose} aria-labelledby="photo-modal-title">
        <IonHeader className="photo-modal-header">
          <IonToolbar>
            <IonTitle id="photo-modal-title">Photo Details</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={onClose} className="close-button" aria-label="Close photo details">
                <IonIcon icon={close} aria-hidden="true" />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="photo-detail-content">
          <div className="photo-detail-container">
            <IonImg
              src={photo.webviewPath}
              alt="Photo detail view"
              className="photo-detail-image"
            />
            <div className="photo-detail-metadata" id="photo-metadata" aria-label="Photo information">
              <IonText>
                <p className="metadata-item">
                  <strong>Date:</strong> {formatDate(photo.dateTaken)}
                </p>
                <p className="metadata-item">
                  <strong>Size:</strong> {formatSize(photo.size)}
                </p>
              </IonText>
            </div>
            <div className="photo-detail-actions">
              <IonButton
                expand="block"
                className="share-button"
                onClick={handleShare}
                disabled={isSharing}
                aria-label="Share photo"
                aria-describedby="photo-metadata"
              >
                <IonIcon icon={shareOutline} slot="start" aria-hidden="true" />
                {isSharing ? 'Sharing...' : 'Share'}
              </IonButton>
              <IonButton
                expand="block"
                className="delete-button"
                onClick={() => setShowDeleteAlert(true)}
                disabled={isDeleting}
                aria-label="Delete photo"
                aria-describedby="photo-metadata"
              >
                <IonIcon icon={trashOutline} slot="start" aria-hidden="true" />
                Delete
              </IonButton>
            </div>
          </div>
        </IonContent>
      </IonModal>

      <IonAlert
        isOpen={showDeleteAlert}
        onDidDismiss={() => setShowDeleteAlert(false)}
        header="Delete Photo"
        message="Are you sure you want to delete this photo? This action cannot be undone."
        buttons={[
          {
            text: 'Cancel',
            role: 'cancel',
          },
          {
            text: 'Delete',
            role: 'destructive',
            handler: handleDeleteConfirm,
          },
        ]}
      />
    </>
  );
};

export default PhotoDetailModal;

