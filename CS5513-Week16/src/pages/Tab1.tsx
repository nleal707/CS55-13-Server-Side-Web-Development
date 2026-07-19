/**
 * Articles Listing Page (Tab1)
 * 
 * This page displays a list of articles fetched from a WordPress REST API endpoint.
 * Each article is displayed as a card with a featured image, title, and truncated
 * preview description. Users can click on an article card to navigate to the
 * detailed article view.
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
  IonText
} from '@ionic/react';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { chevronForwardOutline } from 'ionicons/icons';
import { decodeHTMLEntities, processPreviewDescription, PREVIEW_WORD_LIMIT } from '../utils/htmlUtils';
import './Tab1.css';

/**
 * Article Data Interface
 * 
 * Represents the structure of article data returned from the WordPress REST API.
 * Articles contain multiple sections (up to 5) with titles and descriptions,
 * along with featured and secondary images.
 * 
 * @interface Article
 */
interface Article {
  ID: number;
  post_title: string;
  preview_title: string;
  preview_description: string;
  featured_image: string;
  featured_image_description: string;
  section_1_title: string;
  section_1_description: string;
  section_2_title: string;
  section_2_description: string;
  section_3_title: string;
  section_3_description: string;
  section_4_title: string;
  section_4_description: string;
  section_5_title: string;
  section_5_description: string;
  secondary_image: string;
  secondary_image_description: string;
}

/**
 * Tab1 Component - Articles Listing Page
 * 
 * Displays a scrollable list of articles fetched from a WordPress REST API.
 * Each article is rendered as an interactive card that navigates to the detail
 * view when clicked. Preview descriptions are truncated to a word limit and
 * sanitized for safe HTML rendering.
 * 
 * @component
 * @returns {JSX.Element} The articles listing page with card-based layout
 */
const Tab1: React.FC = () => {
  const history = useHistory();

  /**
   * State for storing articles fetched from the WordPress REST API
   */
  const [dataset, setDataset] = useState<Article[]>([]);

  /**
   * WordPress REST API endpoint URL for fetching articles
   * Uses a custom endpoint that returns article data in a structured format
   */
  const dataURL = 'https://dev-nleal-cs5513.pantheonsite.io/wp-json/twentytwentyfive-child/v1/articles';
 //  const dataURL = 'http://localhost:8000/wp-json/wp/v2/articles';

  /**
   * Fetches articles from the WordPress REST API on component mount
   * 
   * The effect runs once when the component mounts and retrieves all available
   * articles from the API endpoint, storing them in the dataset state.
   */
  useEffect(() => {
    fetch(dataURL)
      .then(response => response.json())
      .then(data => setDataset(data));
  }, []);

  /**
   * Handles article card click events
   * 
   * Navigates to the article detail page, passing the selected article data
   * via React Router's location state.
   * 
   * @param {Article} article - The article object that was clicked
   */
  const handleArticleClick = (article: Article) => {
    history.push('/article', { article });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Articles</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Articles</IonTitle>
          </IonToolbar>
        </IonHeader>
        {/* use map() to loop through JSON array returned from WP REST API */}
        <div className="articles-container animate-stagger">
          {dataset.map((item, index) => (
            <IonCard 
              key={index} 
              className="article-card"
              button 
              onClick={() => handleArticleClick(item)}
              role="article"
              aria-label={`Article: ${decodeHTMLEntities(item.preview_title)}`}
            >
              {item.featured_image && (
                <IonImg 
                  src={item.featured_image} 
                  alt={decodeHTMLEntities(item.preview_title)}
                  className="article-card-image"
                />
              )}
              <IonCardHeader>
                <IonCardTitle>{decodeHTMLEntities(item.preview_title)}</IonCardTitle>
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

export default Tab1;
