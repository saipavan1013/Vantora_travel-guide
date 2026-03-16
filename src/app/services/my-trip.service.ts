import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { Trip } from '../models/trip.model';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MyTripService {
  private apiUrl = '/api/my-trips';
  private readonly STORAGE_KEY = 'myTripDetails';
  private tripsSubject = new BehaviorSubject<Trip[]>([]);
  public trips$ = this.tripsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (data) {
      try {
        const trips = JSON.parse(data).map((t: any) => ({
          ...t,
          startDate: new Date(t.startDate),
          endDate: new Date(t.endDate),
          createdAt: new Date(t.createdAt)
        }));
        this.tripsSubject.next(trips);
      } catch (e) {
        console.error('Error parsing local storage', e);
      }
    }
  }

  private saveToStorage(trips: Trip[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trips));
    this.tripsSubject.next(trips);
  }

  getMyTrips(): Observable<Trip[]> {
    // Try to get from API, but if it fails (likely due to no backend), use local storage
    return this.http.get<Trip[]>(this.apiUrl).pipe(
      catchError(error => {
        console.warn('API fetch failed, using local storage:', error.message);
        return of(this.tripsSubject.value);
      })
    );
  }

  createTrip(trip: Trip): Observable<Trip> {
    // We'll simulate a successful POST by saving locally if the API fails
    const newTrip = { ...trip, id: trip.id || `TRIP-${Date.now()}` };
    
    return this.http.post<Trip>(this.apiUrl, newTrip).pipe(
      tap(() => {
        const updated = [...this.tripsSubject.value, newTrip];
        this.saveToStorage(updated);
      }),
      catchError(error => {
        console.warn('API POST failed, saving locally:', error.message);
        const updated = [...this.tripsSubject.value, newTrip];
        this.saveToStorage(updated);
        return of(newTrip);
      })
    );
  }

  updateTrip(id: string, tripUpdate: Partial<Trip>): Observable<Trip> {
    const currentTrips = this.tripsSubject.value;
    const index = currentTrips.findIndex(t => t.id === id);
    let updatedTrip = currentTrips[0]; // fallback

    if (index !== -1) {
      updatedTrip = { ...currentTrips[index], ...tripUpdate };
    }

    return this.http.put<Trip>(`${this.apiUrl}/${id}`, tripUpdate).pipe(
      tap(() => {
        if (index !== -1) {
          const updatedTrips = [...currentTrips];
          updatedTrips[index] = updatedTrip;
          this.saveToStorage(updatedTrips);
        }
      }),
      catchError(error => {
        console.warn('API PUT failed, updating locally:', error.message);
        if (index !== -1) {
          const updatedTrips = [...currentTrips];
          updatedTrips[index] = updatedTrip;
          this.saveToStorage(updatedTrips);
        }
        return of(updatedTrip);
      })
    );
  }

  deleteTrip(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const updated = this.tripsSubject.value.filter(t => t.id !== id);
        this.saveToStorage(updated);
      }),
      catchError(error => {
        console.warn('API DELETE failed, removing locally:', error.message);
        const updated = this.tripsSubject.value.filter(t => t.id !== id);
        this.saveToStorage(updated);
        return of({ success: true });
      })
    );
  }
}
