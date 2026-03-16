import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map, catchError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ImageService {
    private unsplashUrl = 'https://api.unsplash.com/search/photos';
    private unsplashAccessKey = environment.unsplashAccessKey;

    /**
     * Curated, verified fallback images by category.
     * Used ONLY when no specific image is available and Unsplash fails.
     */
    private categoryFallbacks: { [key: string]: string } = {
        'Beach': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200',
        'Nature': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200',
        'City': 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?q=80&w=1200',
        'Culture': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200',
        'Adventure': 'https://images.unsplash.com/photo-1533240332313-0db3604598a8?q=80&w=1200',
        'Default': 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1200'
    };

    public get DEFAULT_FALLBACK(): string {
        return this.categoryFallbacks['Default'];
    }

    constructor(private http: HttpClient) { }

    /**
     * Curated, definitive image URLs for specific top attractions.
     * Prevents mismatched images on initial load.
     */
    private readonly attractionMappings: { [key: string]: string } = {
        "Uluwatu Temple": "https://images.unsplash.com/photo-1604999333679-b86d54738315?auto=format&fit=crop&w=800&q=80",
        "Sacred Monkey Forest": "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80",
        "Ithaa Undersea Restaurant": "https://images.unsplash.com/photo-1582967788606-a171c1080cb0?q=80&w=600&auto=format&fit=crop",
        "Hanifaru Bay": "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?q=80&w=600&auto=format&fit=crop",
        "Matterhorn": "https://images.unsplash.com/photo-1531315630201-bb15abeb1653?q=80&w=600&auto=format&fit=crop",
        "Jungfraujoch": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=600&auto=format&fit=crop",
        "Red Beach": "https://images.unsplash.com/photo-1629918731050-76c24364020c?q=80&w=600&auto=format&fit=crop",
        "Lake Brienz": "https://images.unsplash.com/photo-1621516223708-eb5febe2c246?q=80&w=600&auto=format&fit=crop",
        "Tegalalang Rice Terrace": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
        "Mount Batur": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
        "Grand Palace": "https://images.unsplash.com/photo-1594916309858-a89f921d7bcf?auto=format&fit=crop&w=800&q=80",
        "Wat Arun": "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80"
    };

    /**
     * Prevents duplicates within the same session.
     */
    private usedImages = new Set<string>();

    /**
     * Helper to retrieve or initialize cached selections from localStorage.
     */
    private getCachedImage(attractionName: string, cityName: string): string | null {
        const cacheKey = `img_cache_${cityName}_${attractionName}`.replace(/\s+/g, '_').toLowerCase();
        return localStorage.getItem(cacheKey);
    }

    private setCachedImage(attractionName: string, cityName: string, url: string): void {
        const cacheKey = `img_cache_${cityName}_${attractionName}`.replace(/\s+/g, '_').toLowerCase();
        localStorage.setItem(cacheKey, url);
        this.usedImages.add(url);
    }

    /**
     * Core method: Fetches the best-match image deterministically.
     * Order of precedence:
     * 1. Hardcoded mapping
     * 2. LocalStorage cache (stable across page refresh)
     * 3. Unsplash search (finds first URL not in usedImages Set)
     * 4. Category fallback
     */
    getImage(
        name: string,
        city: string = '',
        orientation: 'landscape' | 'portrait' | 'squarish' = 'landscape',
        category?: string
    ): Observable<string> {
        if (!name) return of(this.getCategoryFallback(category));

        // 1. Check exact mapping (priority #1)
        if (this.attractionMappings[name]) {
            const mappedUrl = this.attractionMappings[name];
            this.usedImages.add(mappedUrl);
            return of(mappedUrl);
        }

        // 2. Check localStorage cache (priority #2)
        const cachedUrl = this.getCachedImage(name, city);
        if (cachedUrl) {
            this.usedImages.add(cachedUrl);
            return of(cachedUrl);
        }

        // 3. Fallback to API (priority #3)
        // Request "attractionName cityName travel landmark" to get strict matches
        const primaryQuery = city ? `${name.trim()} ${city.trim()} travel landmark` : `${name.trim()} travel`;

        return this.searchUniqueUnsplash(primaryQuery, orientation, name, city).pipe(
            catchError(() => {
                const fbUrl = this.getCategoryFallback(category);
                this.usedImages.add(fbUrl); // track fallbacks too
                return of(fbUrl);
            })
        );
    }

    /**
     * Fetches a set of high-quality gallery images for a destination.
     * e.g., "Maldives travel" → returns 8 landscape images
     */
    getGalleryImages(query: string, count: number = 6): Observable<string[]> {
        if (!query) return of([]);
        const url = `${this.unsplashUrl}?query=${encodeURIComponent(query)}&client_id=${this.unsplashAccessKey}&per_page=${count}&orientation=landscape`;

        return this.http.get(url).pipe(
            map((res: any) => {
                if (res.results && res.results.length > 0) {
                    return res.results.map((img: any) => img.urls.regular);
                }
                return [];
            }),
            catchError(() => of([]))
        );
    }

    /**
     * Internal: searches Unsplash, fetching a few results to find an unused one.
     */
    private searchUniqueUnsplash(query: string, orientation: string, attrName: string, cityName: string): Observable<string> {
        // Fetch up to 5 so we have a pool to choose unique images from
        const url = `${this.unsplashUrl}?query=${encodeURIComponent(query)}&client_id=${this.unsplashAccessKey}&per_page=5&orientation=${orientation}`;

        return this.http.get(url).pipe(
            map((res: any) => {
                if (res.results && res.results.length > 0) {
                    // Try to find an image that isn't used yet
                    for (const img of res.results) {
                        const imgUrl = img.urls.regular;
                        if (!this.usedImages.has(imgUrl)) {
                            // Found unique
                            this.setCachedImage(attrName, cityName, imgUrl);
                            return imgUrl;
                        }
                    }

                    // If all 5 somehow used, just give the first and accept dupes safely instead of crashing
                    const fallbackUrl = res.results[0].urls.regular;
                    this.setCachedImage(attrName, cityName, fallbackUrl);
                    return fallbackUrl;
                }
                throw new Error('No results: ' + query);
            })
        );
    }

    /** For backward compatibility */
    getVariedFallback(name: string = '', category?: string): string {
        return this.getCategoryFallback(category);
    }

    private getCategoryFallback(category?: string): string {
        if (category && this.categoryFallbacks[category]) {
            return this.categoryFallbacks[category];
        }
        return this.categoryFallbacks['Default'];
    }
}
