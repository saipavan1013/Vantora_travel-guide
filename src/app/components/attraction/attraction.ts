import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SafeUrlPipe } from '../../pipes/safe-url.pipe';
import { SlugifyPipe } from '../../pipes/slugify.pipe';
import { DestinationService, DestinationData, AttractionDetail } from '../../services/destination.service';
import { ImageService } from '../../services/image.service';
import { attractionImages } from '../../../assets/data/attraction-images';
import { FallbackImageDirective } from '../../directives/fallback-image.directive';

@Component({
  selector: 'app-attraction',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, RouterLink, SafeUrlPipe, SlugifyPipe, FallbackImageDirective],
  templateUrl: './attraction.html',
  styleUrls: ['./attraction.css']
})
export class Attraction implements OnInit {
  city: string | null = null;
  attractionSlug: string | null = null;
  destData: DestinationData | null = null;

  attraction: AttractionDetail | null = null;
  galleryImages: string[] = [];
  nearbyAttractions: AttractionDetail[] = [];

  // Mock Data since it's an enhancement
  visitingHours = '09:00 AM - 06:00 PM (Daily)';
  ticketInfo = 'Adults: $25 | Children: $15';

  defaultReviews = [
    { user: 'John Doe', avatar: 'https://i.pravatar.cc/150?u=john', rating: 5, comment: 'Incredible experience! Highly recommend visiting early in the morning.', date: 'Jan 2024' },
    { user: 'Emma W.', avatar: 'https://i.pravatar.cc/150?u=emma', rating: 4, comment: 'Very beautiful, but can get quite crowded. The views are worth it though!', date: 'Dec 2023' }
  ];

  constructor(
    private route: ActivatedRoute,
    private destinationService: DestinationService,
    private imageService: ImageService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.city = params.get('city');
      this.attractionSlug = params.get('attractionName');

      if (this.city && this.attractionSlug) {
        this.destData = this.destinationService.getDestinationData(this.city);
        if (this.destData) {
          // Find the attraction that matches the slug
          this.attraction = this.destData.attractions.find(a => this.formatSlug(a.name) === this.attractionSlug) || null;

          if (this.attraction) {
            // Use static dataset, or what was already in the mock details, or a placeholder
            this.attraction.image = attractionImages[this.attraction.name] || this.attraction.image || '/assets/images/travel-placeholder.jpg';

            // Fetch gallery (we can keep this dynamic as it adds flavor for details)
            this.imageService.getGalleryImages(`${this.attraction.name} ${this.city} travel`, 6).subscribe(urls => {
              this.galleryImages = urls;
            });

            // Logic for Nearby Attractions (other attractions in the same city)
            this.nearbyAttractions = this.destData.attractions
              .filter(a => a.name !== this.attraction?.name)
              .slice(0, 3);
          }
        }
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  private formatSlug(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }
}

