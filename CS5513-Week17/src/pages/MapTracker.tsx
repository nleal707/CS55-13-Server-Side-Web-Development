import React, { useEffect, useState, useRef } from 'react';
import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, 
  IonFab, IonFabButton, IonIcon, IonLoading, IonToast 
} from '@ionic/react';
import { refresh } from 'ionicons/icons';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Geolocation } from '@capacitor/geolocation';
import L from 'leaflet';

// Import our new service
import { fetchSmartTrains, TrainPosition } from '../services/SmartTransitService';
import './MapTracker.css';

// --- Icon Setup ---
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// --- Train Bubble Icon ---
const TrainBubbleIcon = L.divIcon({
    className: 'train-bubble-icon',
    html: '<div style="background-color: #0066cc; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
});
// -----------------------------------

// Helper function to convert DirectionId to readable text
const getDirectionText = (directionId: number): string => {
  if (directionId === 1) {
    return 'Northbound';
  } else if (directionId === 0) {
    return 'Southbound';
  } else {
    return 'Unknown';
  }
};

const MapTracker: React.FC = () => {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [trains, setTrains] = useState<TrainPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  
  // Ref to manage auto-refresh interval
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const loadData = async () => {
    // 1. Get User Location (only once usually, but strictly speaking here we do it on load)
    console.log('Requesting user location...');
    // Check permissions first
    const permissionStatus = await Geolocation.checkPermissions();
    console.log('Permission status:', permissionStatus);
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      console.log('Location retrieved successfully:', {
        latitude: coordinates.coords.latitude,
        longitude: coordinates.coords.longitude,
        accuracy: coordinates.coords.accuracy,
        timestamp: coordinates.timestamp
      });
      const userPosition: [number, number] = [coordinates.coords.latitude, coordinates.coords.longitude];
      setPosition(userPosition);
      console.log('Final map position set to:', userPosition);
    } catch (e) {
      // Default to Petaluma/Santa Rosa area if GPS fails
      console.error('Failed to get user location:', e);
      if (e instanceof Error) {
        console.error('Error message:', e.message);
        console.error('Error name:', e.name);
      }
      const defaultPosition: [number, number] = [38.2324, -122.6367];
      console.warn('Defaulting to Petaluma/Santa Rosa area:', defaultPosition);
      setPosition(defaultPosition);
      console.log('Final map position set to:', defaultPosition);
    }

    // 2. Get Live Trains
    console.log('Fetching live train data...');
    const liveTrains = await fetchSmartTrains();
    console.log(`Retrieved ${liveTrains.length} train(s)`);
    setTrains(liveTrains);
    setLoading(false);
    console.log('Data loading complete. Trains:', liveTrains.length, 'Position:', position);
    
    if (liveTrains.length === 0) {
      setShowToast(true);
    }
  };

  useEffect(() => {
    loadData();

    // Auto-refresh every 30 seconds
    intervalRef.current = setInterval(() => {
      fetchSmartTrains().then(data => setTrains(data));
    }, 30000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="success">
          <IonTitle>SMART Live Tracker</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen>
        <IonLoading isOpen={loading} message={'Scanning for trains...'} />
        
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message="No active SMART trains found right now."
          duration={3000}
        />

        {position && (
          <MapContainer center={position} zoom={10} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* User Marker */}
            <Marker position={position}>
              <Popup>You are here</Popup>
            </Marker>

            {/* Live Train Markers */}
            {trains.map((train) => (
              <Marker key={train.id} position={[train.lat, train.lng]} icon={TrainBubbleIcon}>
                <Popup>
                  <strong>Train # </strong>{train.id}<br />
                  <strong>Speed: </strong>{`${train.speed} mph`}<br />
                  <strong>Direction: </strong>{getDirectionText(train.direction)}<br />
                  <strong>Stop Sequence: </strong>{train.CurrentStopSequence}<br />
                  <strong>Stop ID: </strong>{train.StopId}<br />
                  <strong>Current Status: </strong>{train.CurrentStatus}<br />
                  <strong>Trip Update: </strong>{train.TripUpdate}<br />
                  <strong>Alert: </strong>{train.alert}<br />
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}

        {/* Manual Refresh Button */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => { setLoading(true); loadData(); }}>
            <IonIcon icon={refresh} />
          </IonFabButton>
        </IonFab>

      </IonContent>
    </IonPage>
  );
};

export default MapTracker;
