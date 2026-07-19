import { CapacitorHttp } from '@capacitor/core'; // import { CapacitorHttp } from '@capacitor/http';

const API_KEY = '600e7b86-7157-4a65-8350-11e195c444fa';
const OPERATOR_ID = 'SA'; // SA = SMART
const BASE_URL = 'https://api.511.org/transit';

export interface TrainPosition {
  id: string;
  lat: number;
  lng: number;
  bearing: number;
  speed: number;
  direction: number;
  CurrentStopSequence: number;
  StopId: string;
  CurrentStatus: number;
  TripUpdate: string;
  alert: string;
}

export const fetchSmartTrains = async (): Promise<TrainPosition[]> => {
  const options = {
    url: `${BASE_URL}/VehiclePositions`,
    params: {
      api_key: API_KEY,
      agency: OPERATOR_ID,
      format: 'json' // FORCE JSON RESPONSE
    }
  };

  try {
    // CapacitorHttp bypasses CORS issues on mobile
    const response = await CapacitorHttp.get(options);
    
    // Log raw API response for verification
    console.log('API Response:', response);
    console.log('API Response Status:', response.status);
    
    // GTFS Realtime JSON structure
    // Structure: data.Entities[] -> Vehicle.Position
    const rawData = response.data;
    
    // Log raw data structure
    console.log('Raw API Data:', rawData);
    
    // Safety check for empty data
    if (!rawData?.Entities || !Array.isArray(rawData.Entities) || rawData.Entities.length === 0) {
      console.warn('No active trains found on the network.');
      return [];
    }

    const entities = rawData.Entities;

    // Log extracted entities array
    console.log('Extracted Entities Array:', entities);
    console.log('Entities Array Length:', entities?.length || 0);

    // Map the GTFS Realtime fields to our simple app format
    const trainPositions = entities
      .filter((entity: any) => entity?.Vehicle?.Position) // Filter out entities without position data
      .map((entity: any) => {
        const vehicle = entity?.Vehicle;
        const position = vehicle?.Position;
        const trip = vehicle?.Trip;
        return {
          id: entity?.Id || 'unknown',
          lat: position?.Latitude || 'unknown',
          lng: position?.Longitude || 'unknown',
          bearing: position?.Bearing || 'unknown',
          speed: position?.Speed || 'unknown',
          direction: trip?.DirectionId || 'unknown',
          CurrentStopSequence: vehicle?.CurrentStopSequence || 'unknown',
          StopId: vehicle?.StopId || 'unknown',
          CurrentStatus: vehicle?.CurrentStatus || 'unknown',
          TripUpdate: entity?.TripUpdate || 'unknown',
          alert: entity?.Alert || 'unknown'
        };
      });

    // Log final processed train positions array
    console.log('Final Train Positions Array:', trainPositions);
    console.log('Train Positions Array Length:', trainPositions.length);
    
    return trainPositions;

  } catch (error) {
    console.error('Failed to fetch SMART data:', error);
    // Log additional error details if available
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return [];
  }
};