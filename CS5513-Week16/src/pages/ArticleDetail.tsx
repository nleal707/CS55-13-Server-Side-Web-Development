/**
 * Article Detail Page
 * 
 * This page displays the full content of a selected article, including the featured
 * image, all article sections (up to 5), and a secondary image. The article data
 * is passed via React Router's location state from the Articles listing page.
 * All HTML content is sanitized before rendering to prevent XSS attacks.
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
import './ArticleDetail.css';

/**
 * Article Data Interface
 * 
 * Represents the structure of article data passed from the Articles listing page.
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
 * Location State Interface
 * 
 * Defines the structure of data passed via React Router's location state.
 * Used to pass article data from the listing page to the detail page.
 * 
 * @interface LocationState
 */
interface LocationState {
  article?: Article;
}

/**
 * ArticleDetail Component
 * 
 * Displays the full content of a selected article in a scrollable card-based layout.
 * The component receives article data via React Router's location state. If no article
 * data is available, it redirects back to the Articles listing page. All HTML content
 * is sanitized using DOMPurify before rendering to ensure security.
 * 
 * Features:
 * - Featured image with description
 * - Up to 5 article sections with titles and descriptions
 * - Secondary image with description
 * - Back navigation to Articles list
 * - Skip link for accessibility
 * 
 * @component
 * @returns {JSX.Element | null} The article detail page or null if redirecting
 */
const ArticleDetail: React.FC = () => {
  const location = useLocation<LocationState>();
  const history = useHistory();
  const article = location.state?.article;

  /**
   * Redirects to Articles list if article data is missing
   * 
   * Only redirects if we're on the article route without data (not when navigating
   * to other tabs). This prevents unnecessary redirects during normal tab navigation.
   */
  useEffect(() => {
    if (!article && location.pathname === '/article') {
      history.replace('/tab1');
    }
  }, [article, location.pathname, history]);

  /**
   * Handles back button click navigation
   * 
   * Uses replace instead of push to maintain tab context and prevent history
   * stack issues. This ensures the user returns to the Articles tab without
   * creating additional history entries.
   */
  const handleBackClick = () => {
    // Use replace to maintain tab context and prevent history stack issues
    history.replace('/tab1');
  };

  /**
   * Returns null while redirecting if no article data is available
   * This prevents rendering incomplete content during the redirect process
   */
  if (!article) {
    return null;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={handleBackClick} aria-label="Go back to articles list">
              <IonIcon slot="icon-only" icon={arrowBack} aria-hidden="true" />
            </IonButton>
          </IonButtons>
          <IonTitle>Articles</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <a href="#article-content" className="skip-link">Skip to article content</a>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{decodeHTMLEntities(article.post_title)}</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div id="article-content">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>{decodeHTMLEntities(article.preview_title)}</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {article.featured_image && (
              <>
                <IonImg src={article.featured_image} alt={decodeHTMLEntities(article.post_title)} />
                {article.featured_image_description && (
                  <IonText>
                    <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(article.featured_image_description) }} />
                  </IonText>
                )}
              </>
            )}
          </IonCardContent>
        </IonCard>

        {article.section_1_title && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>{decodeHTMLEntities(article.section_1_title)}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonText>
                <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(article.section_1_description) }} />
              </IonText>
            </IonCardContent>
          </IonCard>
        )}

        {article.section_2_title && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>{decodeHTMLEntities(article.section_2_title)}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonText>
                <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(article.section_2_description) }} />
              </IonText>
            </IonCardContent>
          </IonCard>
        )}

        {article.section_3_title && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>{decodeHTMLEntities(article.section_3_title)}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonText>
                <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(article.section_3_description) }} />
              </IonText>
            </IonCardContent>
          </IonCard>
        )}

        {article.section_4_title && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>{decodeHTMLEntities(article.section_4_title)}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonText>
                <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(article.section_4_description) }} />
              </IonText>
            </IonCardContent>
          </IonCard>
        )}

        {article.section_5_title && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>{decodeHTMLEntities(article.section_5_title)}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonText>
                <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(article.section_5_description) }} />
              </IonText>
            </IonCardContent>
          </IonCard>
        )}

        {article.secondary_image && (
          <IonCard>
            <IonCardContent>
              <IonImg src={article.secondary_image} alt={article.secondary_image_description || 'Secondary image'} />
              {article.secondary_image_description && (
                <IonText>
                  <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(article.secondary_image_description) }} />
                </IonText>
              )}
            </IonCardContent>
          </IonCard>
        )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ArticleDetail;

