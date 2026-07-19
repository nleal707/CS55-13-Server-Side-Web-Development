/**
 * Places Listing Page (Tab3)
 * 
 * This page displays a list of places fetched from a WordPress REST API endpoint.
 * Each place is displayed as a card with a preview image, title, location indicator,
 * and truncated preview description. Users can click on a place card to navigate to
 * the detailed place view which includes additional metadata like cuisine type, vibe,
 * and location information.
 */

import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar, 
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonImg,
  IonLabel,
  IonIcon,
  IonText,
  IonBadge
} from '@ionic/react';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { chevronForwardOutline, locationOutline } from 'ionicons/icons';
import { decodeHTMLEntities, processPreviewDescription, PREVIEW_WORD_LIMIT } from '../utils/htmlUtils';
import './Tab3.css';

/**
 * Place Data Interface
 * 
 * Represents the structure of place data returned from the WordPress REST API.
 * Places contain multiple sections (up to 5) with titles, descriptions, images,
 * addresses, cuisine types, and vibe information. Each section can have associated
 * metadata for location-based content.
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
 * Tab3 Component - Places Listing Page
 * 
 * Displays a scrollable list of places fetched from a WordPress REST API.
 * Each place is rendered as an interactive card that navigates to the detail
 * view when clicked. Preview descriptions are truncated to a word limit and
 * sanitized for safe HTML rendering. Places include location indicators to
 * distinguish them from articles.
 * 
 * @component
 * @returns {JSX.Element} The places listing page with card-based layout
 */
const Tab3: React.FC = () => {
  const history = useHistory();

  /**
   * State for storing places fetched from the WordPress REST API
   */
  const [dataset, setDataset] = useState<Place[]>([]);

  /**
   * WordPress REST API endpoint URL for fetching places
   * Uses a custom endpoint that returns place data in a structured format
   * with location, cuisine, and vibe metadata
   */
  const dataURL = 'https://dev-nleal-cs5513.pantheonsite.io/wp-json/twentytwentyfive-child/v1/places';
 //  const dataURL = 'http://localhost:8000/wp-json/wp/v2/articles';

  /**
   * Fetches places from the WordPress REST API on component mount
   * 
   * The effect runs once when the component mounts and retrieves all available
   * places from the API endpoint, storing them in the dataset state.
   */
  useEffect(() => {
    fetch(dataURL)
      .then(response => response.json())
      .then(data => setDataset(data));
  }, []);

  /**
   * Handles place card click events
   * 
   * Navigates to the place detail page, passing the selected place data
   * via React Router's location state.
   * 
   * @param {Place} place - The place object that was clicked
   */
  const handlePlaceClick = (place: Place) => {
    history.push('/place', { place });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Places</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Places</IonTitle>
          </IonToolbar>
        </IonHeader>
        {/* use map() to loop through JSON array returned from WP REST API */}
        <div className="places-container animate-stagger">
          {dataset.map((item, index) => (
            <IonCard 
              key={index} 
              className="place-card"
              button 
              onClick={() => handlePlaceClick(item)}
              role="article"
              aria-label={`Place: ${decodeHTMLEntities(item.preview_title)}`}
            >
              {item.preview_image && (
                <IonImg 
                  src={item.preview_image} 
                  alt={decodeHTMLEntities(item.preview_title)}
                  className="place-card-image"
                />
              )}
              <IonCardHeader>
                <IonCardTitle>{decodeHTMLEntities(item.preview_title)}</IonCardTitle>
                <div className="place-location-indicator" aria-label="Location">
                  <IonIcon icon={locationOutline} className="location-icon" aria-hidden="true" />
                  <IonText className="location-text">{decodeHTMLEntities(item.physical_address)}</IonText>
                </div>
              </IonCardHeader>
              <IonCardContent>
                <IonText>
                  <p className="preview-description">
                    {(() => {
                      const { processedHTML, isTruncated } = processPreviewDescription(
                        item.preview_description,
                        PREVIEW_WORD_LIMIT
                      );
                      return (
                        <>
                          <span
                            dangerouslySetInnerHTML={{
                              __html: processedHTML
                            }}
                          />
                          {isTruncated && (
                            <IonIcon 
                              icon={chevronForwardOutline} 
                              className="preview-chevron"
                              aria-hidden="true"
                            />
                          )}
                        </>
                      );
                    })()}
                  </p>
                </IonText>
              </IonCardContent>
            </IonCard>
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;