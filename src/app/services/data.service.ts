import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, map, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DataService {
    private readonly STORAGE_KEY = 'communityComments';
    private commentsSubject = new BehaviorSubject<any[]>([]);

    constructor() {
        this.loadComments();
    }

    private loadComments() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
            try {
                // Convert stored ISO strings back to objects with toDate() for compatibility
                const rawComments = JSON.parse(stored);
                const comments = rawComments.map((c: any) => ({
                    ...c,
                    timestamp: { toDate: () => new Date(c.timestamp) }
                }));
                this.commentsSubject.next(comments);
            } catch (e) {
                console.error('Error parsing stored comments', e);
                this.commentsSubject.next([]);
            }
        }
    }

    private saveComments(comments: any[]) {
        // When saving, convert the circular/mocked timestamp to just the ISO string
        const toStore = comments.map(c => ({
            ...c,
            timestamp: typeof c.timestamp.toDate === 'function' ? c.timestamp.toDate().toISOString() : c.timestamp
        }));
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(toStore));
    }

    // Trips Section - No longer used by new Planner but kept for structure
    getTrips(userId: string): Observable<any[]> {
        return of([]);
    }

    async addTrip(userId: string, destination: string, places: string[]) {
        return null;
    }

    async deleteTrip(tripId: string) {
        return null;
    }

    // Comments Section
    getComments(destination: string): Observable<any[]> {
        return this.commentsSubject.asObservable().pipe(
            map(comments => comments
                .filter(c => c.destination === destination)
                .sort((a, b) => {
                    const dateA = typeof a.timestamp.toDate === 'function' ? a.timestamp.toDate() : new Date(a.timestamp);
                    const dateB = typeof b.timestamp.toDate === 'function' ? b.timestamp.toDate() : new Date(b.timestamp);
                    return dateB.getTime() - dateA.getTime();
                })
            )
        );
    }

    async addComment(userId: string, userName: string, destination: string, message: string) {
        const currentComments = this.commentsSubject.value;
        const newComment = {
            id: 'comm_' + Date.now(),
            userId,
            userName,
            destination,
            message,
            timestamp: { toDate: () => new Date() }
        };

        const updated = [newComment, ...currentComments];
        this.commentsSubject.next(updated);
        this.saveComments(updated);
        return newComment;
    }

    async deleteComment(commentId: string) {
        const currentComments = this.commentsSubject.value;
        const updated = currentComments.filter(c => c.id !== commentId);
        this.commentsSubject.next(updated);
        this.saveComments(updated);
    }

    async updateComment(commentId: string, newMessage: string) {
        const currentComments = this.commentsSubject.value;
        const updated = currentComments.map(c =>
            c.id === commentId ? { ...c, message: newMessage } : c
        );
        this.commentsSubject.next(updated);
        this.saveComments(updated);
    }
}
