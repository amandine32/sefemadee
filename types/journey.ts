export interface JourneyRequest {
  id: string;
  userId: string;
  type: 'solo' | 'shared';
  departure: {
    address: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  destination: {
    address: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  estimatedDepartureTime: string;
  transportMode?: 'walking' | 'metro' | 'rer' | 'bus';
  description?: string;
  status: 'pending' | 'matched' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  createdAt: number;
  matchedWith?: string; // User ID of matched partner
}

export interface JourneyMatch {
  id: string;
  requestId: string;
  matchedRequestId: string;
  compatibility: number; // 0-100 score
  estimatedMeetingPoint?: {
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  status: 'pending' | 'accepted' | 'declined';
  createdAt: number;
}

export interface ActiveJourney {
  id: string;
  participants: string[];
  startTime: number;
  estimatedEndTime: number;
  route: {
    departure: {
      address: string;
      coordinates: {
        latitude: number;
        longitude: number;
      };
    };
    destination: {
      address: string;
      coordinates: {
        latitude: number;
        longitude: number;
      };
    };
  };
  emergencyContacts: string[];
  status: 'active' | 'completed' | 'emergency';
  lastUpdate: number;
}