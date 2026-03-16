import { Component, OnInit, inject, EnvironmentInjector, runInInjectionContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { TravelService } from '../../services/travel.service';
import { WeatherService } from '../../services/weather.service';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { DestinationService, DestinationData } from '../../services/destination.service';
import { ImageService } from '../../services/image.service';
import { FallbackImageDirective } from '../../directives/fallback-image.directive';
import { attractionImages } from '../../../assets/data/attraction-images';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin, catchError, of, Observable, tap, finalize, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Delete Comment</h2>
    <mat-dialog-content>
      <p>Are you sure you want to delete this comment? This action cannot be undone.</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="warn" [mat-dialog-close]="true">Delete</button>
    </mat-dialog-actions>
  `
})
export class ConfirmDialogComponent {}

@Component({
  selector: 'app-destination',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDialogModule,
    FormsModule,
    RouterLink,
    FallbackImageDirective
  ],
  templateUrl: './destination.html',
  styleUrl: './destination.css',
})
export class Destination implements OnInit {
  loading: boolean = true;
  error: string | null = null;
  city: string | null = null;

  weatherData: any = null;
  images: any[] = [];
  destData: DestinationData | null = null;
  safeMapUrl: SafeResourceUrl | null = null;
  isDynamic: boolean = false;

  newComment: string = '';
  comments$: Observable<any[]> = of([]);

  editingCommentId: string | null = null;
  editCommentContent: string = '';

  showAllComments: boolean = false;

  private injector = inject(EnvironmentInjector);

  constructor(
    private route: ActivatedRoute,
    private travelService: TravelService,
    private weatherService: WeatherService,
    private dataService: DataService,
    private destinationService: DestinationService,
    private imageService: ImageService,
    public authService: AuthService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.city = params.get('city');
      if (this.city) {
        // Load static structured data immediately if available
        let foundData = this.destinationService.getDestinationData(this.city);
        
        if (foundData) {
          this.destData = foundData;
          this.isDynamic = false;
        } else {
          // Dynamic Generation for User-Friendly REAL-TIME experience
          this.isDynamic = true;
          this.destData = {
            tagline: `Discover the Beauty of ${this.city}`,
            heroImage: '', // Fetch below from Unsplash
            overview: {
                description: `Explore the vibrant culture and beautiful landscapes of ${this.city}. This dynamic destination profile is generated in real-time.`,
                bestTime: 'Year-round',
                currency: 'Local Currency',
                language: 'Local Language'
            },
            category: 'City',
            attractions: [],
            thingsToDo: [
                `Explore ${this.city}'s local cuisine`,
                `Take a walking tour of the city center`,
                `Discover local parks and nature`,
                `Visit historical landmarks`
            ],
            travelTips: {
                safety: 'Always stay aware of your surroundings and check local travel advisories.',
                transport: 'Use local public transport or trusted ride-sharing apps.',
                etiquette: 'Respect local customs, traditions, and the environment.'
            },
            nearby: [],
            mapUrl: `https://maps.google.com/maps?width=100%25&height=600&hl=en&q=${encodeURIComponent(this.city)}&t=&z=12&ie=UTF8&iwloc=B&output=embed`
          };
          
          // Fetch Real-Time Wikipedia Summary
          const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(this.city)}`;
          this.http.get<any>(wikiUrl).pipe(catchError(() => of(null))).subscribe(wikiRes => {
              if (wikiRes && wikiRes.extract) {
                  if (this.destData) {
                     this.destData.overview.description = wikiRes.extract;
                  }
              }
          });
        }

        if (this.destData) {
          this.safeMapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.destData.mapUrl);
        }

        // Fetch external API data robustly
        this.loading = true;

        const weather$ = this.weatherService.getWeather(this.city).pipe(catchError(() => of(null)));
        const gallery$ = this.imageService.getGalleryImages(`${this.city} travel tourism`, 8).pipe(catchError(() => of([])));

        forkJoin({
          weather: weather$,
          gallery: gallery$
        }).pipe(
          finalize(() => this.loading = false)
        ).subscribe(res => {
          this.weatherData = res.weather;
          this.images = res.gallery.map(url => ({ urls: { small: url } }));
        });

        // Ensure Hero image exists
        if (this.destData && !this.destData.heroImage) {
          this.imageService.getImage(this.city, '', 'landscape', this.destData.category).subscribe(url => {
            if (this.destData) this.destData.heroImage = url;
          });
        }

        // Use static image dataset for attractions, or fallback
        if (this.destData) {
          this.destData.attractions.forEach(attr => {
            // Priority: 1. Static Custom Dataset > 2. Existing Hardcoded > 3. Placeholder
            attr.image = attractionImages[attr.name] || attr.image || '/assets/images/travel-placeholder.jpg';
          });
        }

        // Load comments asynchronously in injection context
        runInInjectionContext(this.injector, () => {
          this.comments$ = this.dataService.getComments(this.city!).pipe(catchError(() => of([])));
        });

      } else {
        this.loading = false;
      }
    });
  }

  async postComment() {
    if (this.newComment.trim() && this.city) {
      const user = await new Promise(resolve => this.authService.user$.subscribe(resolve));
      if (user) {
        try {
          await this.dataService.addComment(
            (user as any).uid,
            (user as any).displayName || (user as any).email,
            this.city,
            this.newComment
          );
          this.newComment = '';
        } catch (err) {
          console.error('Error posting comment:', err);
        }
      }
    }
  }

  async deleteComment(commentId: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      position: { top: '10%' }
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        try {
          await this.dataService.deleteComment(commentId);
        } catch (err) {
          console.error('Error deleting comment:', err);
        }
      }
    });
  }

  startEdit(comment: any) {
    this.editingCommentId = comment.id;
    this.editCommentContent = comment.message;
  }

  cancelEdit() {
    this.editingCommentId = null;
    this.editCommentContent = '';
  }

  async saveEdit() {
    if (this.editingCommentId && this.editCommentContent.trim()) {
      try {
        await this.dataService.updateComment(this.editingCommentId, this.editCommentContent);
        this.cancelEdit();
      } catch (err) {
        console.error('Error updating comment:', err);
      }
    }
  }

  toggleComments() {
    this.showAllComments = !this.showAllComments;
  }

  formatSlug(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }
}


