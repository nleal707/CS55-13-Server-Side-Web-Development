import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Home.css';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="success">
          <IonTitle>Rail Scout</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen>
        <div className="home-container">
          <h1>Welcome to Rail Scout</h1>
          <p>Your SMART transit companion</p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
