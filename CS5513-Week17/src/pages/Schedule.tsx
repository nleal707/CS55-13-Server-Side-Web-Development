import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';

const Schedule: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="success">
          <IonTitle>Schedule</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen>
        <div style={{ padding: '1rem' }}>
          <h2>Train Schedule</h2>
          <p>Schedule information will be displayed here.</p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Schedule;
