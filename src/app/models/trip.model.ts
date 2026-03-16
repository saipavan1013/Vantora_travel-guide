export interface Activity {
  id?: string;
  name: string;
  time: string;
  category: 'Sightseeing' | 'Food' | 'Adventure' | 'Shopping' | 'Transport' | 'Culture' | 'Relaxation' | 'Nightlife' | 'Hiking' | 'Wellness';
  location: string;
  notes?: string;
  cost?: number;
}

export interface DayPlan {
  day: number;
  date: Date;
  activities: Activity[];
}

export interface Destination {
  id?: string;
  name: string;
  country: string;
  description: string;
  imageUrl: string;
}

export interface Accommodation {
  id?: string;
  hotelName: string;
  checkInDate: Date;
  checkOutDate: Date;
  address: string;
  bookingReference?: string;
  cost: number;
}

export interface Transportation {
  id?: string;
  type: 'Flight' | 'Train' | 'Car' | 'Bus';
  departureLocation: string;
  arrivalLocation: string;
  departureTime: Date;
  arrivalTime: Date;
  bookingReference?: string;
  cost: number;
}

export interface Trip {
  id?: string;
  userId: string;
  title: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  travelers: number;
  budget: number;
  status: 'Planning' | 'Confirmed' | 'Completed';
  imageUrl?: string;
  destinations: Destination[];
  itinerary: DayPlan[];
  accommodations: Accommodation[];
  transportation: Transportation[];
  expenses: {
    category: string;
    amount: number;
    notes?: string;
  }[];
  createdAt: any;
}
