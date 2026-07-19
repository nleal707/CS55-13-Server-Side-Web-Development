/**
 * Place Detail Page
 * 
 * This page displays the full content of a selected place, including the featured
 * image, all place sections (up to 5) with associated metadata (cuisine type, vibe,
 * location address and URL), and a secondary image. The place data is passed via
 * React Router's location state from the Places listing page. All HTML content is
 * sanitized before rendering to prevent XSS attacks.
 */

import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonImg,
  IonLabel,
  IonItem,
  IonText
} from '@ionic/react';
import React, { useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { arrowBack } from 'ionicons/icons';
import { sanitizeHTML, decodeHTMLEntities } from '../utils/htmlUtils';
import './PlaceDetail.css';

/**
 * Place Data Interface
 * 
 * Represents the structure of place data passed from the Places listing page.
 * Places contain multiple sections (up to 5) with titles, descriptions, images,
 * addresses, cuisine types, vibe information, and location URLs. Each section
 * can have associated metadata for location-based content.
 * 
 * @interface Place
 */
interface Place {
  ID: number;
  post_title: string;
  physical_address: string;
  preview_title: string;
  preview_description: string;
  preview_image: string;
  preview_image_url: string;
  featured_image_title: string;
  featured_image_description: string;
  featured_image: string;
  featured_image_url: string;
  section_1_title: string;
  section_1_description: string;
  section_1_image: string;
  section_1_url: string;
  section_1_address: string;
  section_1_cuisine: string;
  section_1_vibe: string;
  section_2_title: string;
  section_2_description: string;
  section_2_image: string;
  section_2_url: string;
  section_2_address: string;
  section_2_cuisine: string;
  section_2_vibe: string;
  section_3_title: string;
  section_3_description: string;
  section_3_image: string;
  section_3_url: string;
  section_3_address: string;
  section_3_cuisine: string;
  section_3_vibe: string;
  section_4_title: string;
  section_4_description: string;
  section_4_image: string;
  section_4_url: string;
  section_4_address: string;
  section_4_cuisine: string;
  section_4_vibe: string;
  section_5_title: string;
  section_5_description: string;
  section_5_image: string;
  section_5_url: string;
  section_5_address: string;
  section_5_cuisine: string;
  section_5_vibe: string;
  secondary_image_title: string;
  secondary_image_description: string;
  secondary_image: string;
  secondary_image_url: string;
}

/**
 * Location State Interface
 * 
 * Defines the structure of data passed via React Router's location state.
 * Used to pass place data from the listing page to the detail page.
 * 
 * @interface LocationState
 */
interface LocationState {
  place?: Place;
}

/**
 * PlaceDetail Component
 * 
 * Displays the full content of a selected place in a scrollable card-based layout.
 * The component receives place data via React Router's location state. If no place
 * data is available, it redirects back to the Places listing page. All HTML content
 * is sanitized using DOMPurify before rendering to ensure security.
 * 
 * Features:
 * - Featured image with title and description
 * - Up to 5 place sections with titles, descriptions, and images
 * - Section metadata: cuisine type, vibe, and location (with clickable address link)
 * - Secondary image with title and description
 * - Back navigation to Places list
 * - Skip link for accessibility
 * 
 * Each section can optionally include:
 * - Cuisine type (e.g., "Italian", "Mexican")
 * - Vibe description (e.g., "Casual", "Upscale")
 * - Location address with external link to maps/directions
 * - Section-specific image
 * 
 * @component
 * @returns {JSX.Element | null} The place detail page or null if redirecting
 */
const PlaceDetail: React.FC = () => {
  const location = useLocation<LocationState>();
  const history = useHistory();
  const place = location.state?.place;

  /**
   * Redirects to Places list if place data is missing
   * 
   * Only redirects if we're on the place route without data (not when navigating
   * to other tabs). This prevents unnecessary redirects during normal tab navigation.
   */
  useEffect(() => {
    if (!place && location.pathname === '/place') {
      history.replace('/tab3');
    }
  }, [place, location.pathname, history]);

  /**
   * Handles back button click navigation
   * 
   * Uses replace instead of push to maintain tab context and prevent history
   * stack issues. This ensures the user returns to the Places tab without
   * creating additional history entries.
   */
  const handleBackClick = () => {
    // Use replace to maintain tab context and prevent history stack issues
    history.replace('/tab3');
  };

  /**
   * Returns null while redirecting if no place data is available
   * This prevents rendering incomplete content during the redirect process
   */
  if (!place) {
    return null;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={handleBackClick} aria-label="Go back to places list">
              <IonIcon slot="icon-only" icon={arrowBack} aria-hidden="true" />
            </IonButton>
          </IonButtons>
          <IonTitle>Places</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <a href="#place-content" className="skip-link">Skip to place content</a>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{decodeHTMLEntities(place.post_title)}</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div id="place-content">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>{decodeHTMLEntities(place.featured_image_title)}</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {place.featured_image && (
              <>
                <IonImg src={place.featured_image} alt={decodeHTMLEntities(place.post_title)} />
                {place.featured_image_description && (
                  <IonText>
                    <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(place.featured_image_description) }} />
                  </IonText>
                )}
              </>
            )}
          </IonCardContent>
        </IonCard>

        {place.section_1_title && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>{decodeHTMLEntities(place.section_1_title)}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
                <IonText>
                <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(place.section_1_description) }} />
                </IonText>
                {(place.section_1_cuisine || place.section_1_vibe) && (
                  <div className="section-metadata">
                    {place.section_1_cuisine && (
                      <IonText className="metadata-item">
                        <span className="metadata-label">Cuisine:</span> {decodeHTMLEntities(place.section_1_cuisine)}
                      </IonText>
                    )}
                    {place.section_1_vibe && (
                      <IonText className="metadata-item">
                        <span className="metadata-label">Vibe:</span> {decodeHTMLEntities(place.section_1_vibe)}
                      </IonText>
                    )}
                  </div>
                )}
                {place.section_1_url && place.section_1_address && (
                  <div className="section-location">
                    <span className="metadata-label">Location:</span>
                    <a
                      href={place.section_1_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="location-link"
                    >
                      {decodeHTMLEntities(place.section_1_address)}
                    </a>
                  </div>
                )}
                {place.section_1_image && (
                    <IonImg
                    className="section-image"
                    src={place.section_1_image}
                    alt={decodeHTMLEntities(
                        place.section_1_title || place.section_1_description || 'Section image'
                    )}
                    />
                )}
            </IonCardContent>
          </IonCard>
        )}

        {place.section_2_title && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>{decodeHTMLEntities(place.section_2_title)}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonText>
                <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(place.section_2_description) }} />
              </IonText>
              {(place.section_2_cuisine || place.section_2_vibe) && (
                <div className="section-metadata">
                  {place.section_2_cuisine && (
                    <IonText className="metadata-item">
                      <span className="metadata-label">Cuisine:</span> {decodeHTMLEntities(place.section_2_cuisine)}
                    </IonText>
                  )}
                  {place.section_2_vibe && (
                    <IonText className="metadata-item">
                      <span className="metadata-label">Vibe:</span> {decodeHTMLEntities(place.section_2_vibe)}
                    </IonText>
                  )}
                </div>
              )}
              {place.section_2_url && place.section_2_address && (
                <div className="section-location">
                  <span className="metadata-label">Location:</span>
                  <a
                    href={place.section_2_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="location-link"
                  >
                    {decodeHTMLEntities(place.section_2_address)}
                  </a>
                </div>
              )}
              {place.section_2_image && (
                <IonImg
                className="section-image"
                src={place.section_2_image}
                alt={decodeHTMLEntities(
                    place.section_2_title || place.section_2_description || 'Section image'
                )}
                />
              )}
            </IonCardContent>
          </IonCard>
        )}

        {place.section_3_title && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>{decodeHTMLEntities(place.section_3_title)}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonText>
                <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(place.section_3_description) }} />
              </IonText>
              {(place.section_3_cuisine || place.section_3_vibe) && (
                <div className="section-metadata">
                  {place.section_3_cuisine && (
                    <IonText className="metadata-item">
                      <span className="metadata-label">Cuisine:</span> {decodeHTMLEntities(place.section_3_cuisine)}
                    </IonText>
                  )}
                  {place.section_3_vibe && (
                    <IonText className="metadata-item">
                      <span className="metadata-label">Vibe:</span> {decodeHTMLEntities(place.section_3_vibe)}
                    </IonText>
                  )}
                </div>
              )}
              {place.section_3_url && place.section_3_address && (
                <div className="section-location">
                  <span className="metadata-label">Location:</span>
                  <a
                    href={place.section_3_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="location-link"
                  >
                    {decodeHTMLEntities(place.section_3_address)}
                  </a>
                </div>
              )}
              {place.section_3_image && (
                <IonImg
                className="section-image"
                src={place.section_3_image}
                alt={decodeHTMLEntities(
                    place.section_3_title || place.section_3_description || 'Section image'
                )}
                />
              )}
            </IonCardContent>
          </IonCard>
        )}

        {place.section_4_title && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>{decodeHTMLEntities(place.section_4_title)}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonText>
                <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(place.section_4_description) }} />
              </IonText>
              {(place.section_4_cuisine || place.section_4_vibe) && (
                <div className="section-metadata">
                  {place.section_4_cuisine && (
                    <IonText className="metadata-item">
                      <span className="metadata-label">Cuisine:</span> {decodeHTMLEntities(place.section_4_cuisine)}
                    </IonText>
                  )}
                  {place.section_4_vibe && (
                    <IonText className="metadata-item">
                      <span className="metadata-label">Vibe:</span> {decodeHTMLEntities(place.section_4_vibe)}
                    </IonText>
                  )}
                </div>
              )}
              {place.section_4_url && place.section_4_address && (
                <div className="section-location">
                  <span className="metadata-label">Location:</span>
                  <a
                    href={place.section_4_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="location-link"
                  >
                    {decodeHTMLEntities(place.section_4_address)}
                  </a>
                </div>
              )}
              {place.section_4_image && (
                <IonImg
                className="section-image"
                src={place.section_4_image}
                alt={decodeHTMLEntities(
                    place.section_4_title || place.section_4_description || 'Section image'
                )}
                />
              )}
            </IonCardContent>
          </IonCard>
        )}

        {place.section_5_title && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>{decodeHTMLEntities(place.section_5_title)}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonText>
                <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(place.section_5_description) }} />
              </IonText>
              {(place.section_5_cuisine || place.section_5_vibe) && (
                <div className="section-metadata">
                  {place.section_5_cuisine && (
                    <IonText className="metadata-item">
                      <span className="metadata-label">Cuisine:</span> {decodeHTMLEntities(place.section_5_cuisine)}
                    </IonText>
                  )}
                  {place.section_5_vibe && (
                    <IonText className="metadata-item">
                      <span className="metadata-label">Vibe:</span> {decodeHTMLEntities(place.section_5_vibe)}
                    </IonText>
                  )}
                </div>
              )}
              {place.section_5_url && place.section_5_address && (
                <div className="section-location">
                  <span className="metadata-label">Location:</span>
                  <a
                    href={place.section_5_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="location-link"
                  >
                    {decodeHTMLEntities(place.section_5_address)}
                  </a>
                </div>
              )}
              {place.section_5_image && (
                <IonImg
                className="section-image"
                src={place.section_5_image}
                alt={decodeHTMLEntities(
                    place.section_5_title || place.section_5_description || 'Section image'
                )}
                />
              )}
            </IonCardContent>
          </IonCard>
        )}

        {place.secondary_image && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>{decodeHTMLEntities(place.secondary_image_title)}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonText>
                <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(place.secondary_image_description) }} />
              </IonText>
              {place.secondary_image && (
                <IonImg
                className="section-image"
                src={place.secondary_image}
                alt={decodeHTMLEntities(
                    place.secondary_image_title || place.secondary_image_description || 'Secondary image'
                )}
                />
              )}
            </IonCardContent>
          </IonCard>
        )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default PlaceDetail;

