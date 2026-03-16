import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TravelService {
    private countriesAlphaUrl = 'https://restcountries.com/v3.1/alpha';
    private unsplashUrl = 'https://api.unsplash.com/search/photos';
    private unsplashAccessKey = environment.unsplashAccessKey;

    constructor(private http: HttpClient) { }

    getCountryInfo(countryCode: string): Observable<any> {
        console.log('Fetching Country Info for code:', countryCode);
        return this.http.get(`${this.countriesAlphaUrl}/${countryCode}`).pipe(
            map((response: any) => {
                if (Array.isArray(response)) {
                    return response[0];
                }
                return response;
            }),
            tap(data => console.log('Country Info API Success:', data)),
            catchError(err => {
                console.error('Country Info API Error:', err);
                return of(null);
            })
        );
    }

    getDestinationImages(city: string): Observable<any> {
        console.log('Fetching Unsplash images for city:', city);
        const url = `${this.unsplashUrl}?query=${city}&client_id=${this.unsplashAccessKey}&per_page=6`;
        return this.http.get(url).pipe(
            tap(data => console.log('Unsplash API Success (images found):', (data as any).results?.length)),
            catchError(err => {
                console.error('Unsplash API Error:', err);
                return of({ results: [] });
            })
        );
    }
}
