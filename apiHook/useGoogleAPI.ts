// src/apiHook/useGooglePlacesAPI.ts

interface PlaceSuggestion {
    description: string;
    place_id: string;
  }
  
  interface DistanceMatrixResult {
    destination_addresses: string[];
    origin_addresses: string[];
    rows: {
      elements: {
        distance: {
          text: string;
          value: number;
        };
        duration: {
          text: string;
          value: number;
        };
        status: string;
      }[];
    }[];
    status: string;
  }
  
  interface DistanceMatrixOptions {
    origins: string;
    destinations: string;
    mode?: 'driving' | 'walking' | 'bicycling' | 'transit';
    language?: string;
    region?: string;
    avoid?: string;
    units?: 'metric' | 'imperial';
    arrival_time?: number;
    departure_time?: number;
    traffic_model?: 'best_guess' | 'pessimistic' | 'optimistic';
    transit_mode?: string;
    transit_routing_preference?: string;
  }
  
  export default function useGooglePlacesAPI() {
    const fetchSuggestions = async (input: string, sessiontoken?: string): Promise<PlaceSuggestion[]> => {
      if (!input) {
        console.log("Input is empty. Returning no suggestions.");
        return [];
      }
  
      try {
        const params = new URLSearchParams({
          input,
          ...(sessiontoken ? { sessiontoken } : {})
        });
  
        const res = await fetch(`${process.env.EXPO_PUBLIC_API_URI}/api/google/autocomplete?${params.toString()}`);
  
        if (!res.ok) {
          const errorText = await res.text();
          console.log(`Autocomplete API Error: ${res.status} - ${errorText}`);
          return [];
        }
  
        const data = await res.json();
  
        if (data.predictions) {
          console.log("Fetched Suggestions:", data.predictions);
          return data.predictions;
        } else {
          console.log("No predictions found.");
          return [];
        }
      } catch (error) {
        console.log("Autocomplete API Error:", error);
        return [];
      }
    };
  
    const fetchDistance = async (options: DistanceMatrixOptions): Promise<DistanceMatrixResult | null> => {
      const { origins, destinations, ...rest } = options;
  
      if (!origins || !destinations) {
        console.log("Origins and destinations are required.");
        return null;
      }
  
      const params = new URLSearchParams({ origins, destinations });
  
      Object.entries(rest).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, String(value));
        }
      });
  
      try {
        const res = await fetch(`${process.env.EXPO_PUBLIC_API_URI}/api/google/distance-matrix?${params.toString()}`);
  
        if (!res.ok) {
          const errorText = await res.text();
          console.log(`Distance Matrix API Error: ${res.status} - ${errorText}`);
          return null;
        }
  
        const data: DistanceMatrixResult = await res.json();
        console.log("Distance Matrix Result:", data);
        return data;
      } catch (error) {
        console.log("Distance Matrix API Error:", error);
        return null;
      }
    };
  
    return { fetchSuggestions, fetchDistance };
  }
  