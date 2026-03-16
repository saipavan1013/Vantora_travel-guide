import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, firstValueFrom } from 'rxjs';
import { Trip, DayPlan, Activity } from '../models/trip.model';
import { TravelService } from './travel.service';

@Injectable({
    providedIn: 'root'
})
export class TripService {
    private readonly STORAGE_KEY = 'userTrips';
    private tripsSubject = new BehaviorSubject<Trip[]>([]);
    public trips$ = this.tripsSubject.asObservable();

    constructor(private travelService: TravelService) {
        this.loadTripsFromStorage();
    }

    private loadTripsFromStorage() {
        const storedTrips = localStorage.getItem(this.STORAGE_KEY);
        if (storedTrips) {
            try {
                const trips = JSON.parse(storedTrips).map((trip: any) => this.mapTripDates(trip));
                this.tripsSubject.next(trips);
            } catch (e) {
                console.error('Error parsing trips from localStorage', e);
                this.tripsSubject.next([]);
            }
        }
    }

    private saveTripsToStorage(trips: Trip[]) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trips));
        this.tripsSubject.next(trips);
    }

    getTrips(): Observable<Trip[]> {
        return this.trips$;
    }

    getTripById(id: string): Trip | undefined {
        return this.tripsSubject.value.find(t => t.id === id);
    }

    async createTrip(trip: Partial<Trip>): Promise<void> {
        const currentTrips = this.tripsSubject.value;

        let imageUrl = trip.imageUrl;
        if (!imageUrl && trip.destination) {
            try {
                const imageData = await firstValueFrom(this.travelService.getDestinationImages(trip.destination));
                if (imageData?.results?.length > 0) {
                    imageUrl = imageData.results[0].urls.regular;
                }
            } catch (e) {
                console.error('Error fetching destination image', e);
            }
        }

        const newTrip: Trip = {
            ...trip as Trip,
            id: `trip_${Date.now()}`,
            createdAt: new Date(),
            imageUrl: imageUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=800',
            destinations: trip.destinations || [],
            itinerary: trip.itinerary || [],
            accommodations: trip.accommodations || [],
            transportation: trip.transportation || [],
            expenses: trip.expenses || [],
            status: trip.status || 'Planning'
        };

        this.saveTripsToStorage([...currentTrips, newTrip]);
    }

    async updateTrip(tripId: string, tripUpdate: Partial<Trip>): Promise<void> {
        const currentTrips = this.tripsSubject.value;
        const index = currentTrips.findIndex(t => t.id === tripId);

        if (index !== -1) {
            const updatedTrips = [...currentTrips];
            let imageUrl = tripUpdate.imageUrl || updatedTrips[index].imageUrl;

            // If destination changed and no explicit imageUrl provided, fetch new one
            if (tripUpdate.destination && tripUpdate.destination !== updatedTrips[index].destination && !tripUpdate.imageUrl) {
                try {
                    const imageData = await firstValueFrom(this.travelService.getDestinationImages(tripUpdate.destination));
                    if (imageData?.results?.length > 0) {
                        imageUrl = imageData.results[0].urls.regular;
                    }
                } catch (e) {
                    console.error('Error fetching new destination image', e);
                }
            }

            updatedTrips[index] = {
                ...updatedTrips[index],
                ...tripUpdate,
                imageUrl: imageUrl
            };
            this.saveTripsToStorage(updatedTrips);
        }
    }

    deleteTrip(tripId: string): void {
        const currentTrips = this.tripsSubject.value;
        const updatedTrips = currentTrips.filter(t => t.id !== tripId);
        this.saveTripsToStorage(updatedTrips);
    }

    generateItinerary(startDate: Date, endDate: Date): DayPlan[] {
        const itinerary: DayPlan[] = [];
        const start = new Date(startDate);
        const end = new Date(endDate);

        let current = new Date(start);
        let dayCount = 1;

        while (current <= end) {
            itinerary.push({
                day: dayCount,
                date: new Date(current),
                activities: []
            });
            current.setDate(current.getDate() + 1);
            dayCount++;
        }

        return itinerary;
    }

    calculateBudget(trip: Trip) {
        const accCost = trip.accommodations?.reduce((sum, item) => sum + (item.cost || 0), 0) || 0;
        const transCost = trip.transportation?.reduce((sum, item) => sum + (item.cost || 0), 0) || 0;
        const actCost = trip.itinerary?.reduce((sum, day) =>
            sum + day.activities.reduce((dSum, act) => dSum + (act.cost || 0), 0), 0) || 0;

        return {
            accommodation: accCost,
            transportation: transCost,
            activities: actCost,
            total: accCost + transCost + actCost,
            remaining: (trip.budget || 0) - (accCost + transCost + actCost)
        };
    }

    private mapTripDates(trip: any): Trip {
        if (!trip) return trip;

        return {
            ...trip,
            startDate: new Date(trip.startDate),
            endDate: new Date(trip.endDate),
            createdAt: new Date(trip.createdAt),
            itinerary: trip.itinerary?.map((day: any) => ({
                ...day,
                date: new Date(day.date)
            }))
        };
    }
}
