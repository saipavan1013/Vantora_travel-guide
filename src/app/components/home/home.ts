import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeatherService } from '../../services/weather.service';
import { DestinationService, DestinationSummary } from '../../services/destination.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatChipsModule,
    RouterLink
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, AfterViewInit, OnDestroy {
  searchCity: string = '';
  weatherData: any = null;
  loading: boolean = false;
  error: string | null = null;

  featuredDestinations: DestinationSummary[] = [];
  trendingDestinations: DestinationSummary[] = [];
  categories = [
    { name: 'Beach', icon: 'beach_access', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400' },
    { name: 'Culture', icon: 'account_balance', image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400' },
    { name: 'Nature', icon: 'landscape', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400' },
    { name: 'City', icon: 'location_city', image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400' },
    { name: 'Adventure', icon: 'explore', image: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=400' }
  ];

  backgroundImages: string[] = [
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1600',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600',
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1600',
    'https://images.unsplash.com/photo-1493246507139-91e8bef99c02?w=1600'
  ];
  currentImageIndex = signal(0);
  private sliderTimer: any;

  constructor(
    private weatherService: WeatherService,
    private destinationService: DestinationService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    const all = this.destinationService.getAllDestinations();
    this.featuredDestinations = all.slice(0, 6);
    this.trendingDestinations = this.destinationService.getTrendingDestinations();

    this.startSlider();
  }

  ngAfterViewInit() {
    this.initScrollReveal();
  }

  ngOnDestroy() {
    this.stopSlider();
  }

  private startSlider() {
    this.stopSlider();
    const rotate = () => {
      this.currentImageIndex.update(idx => (idx + 1) % this.backgroundImages.length);
      this.cdr.detectChanges();
      this.sliderTimer = setTimeout(rotate, 5000);
    };
    this.sliderTimer = setTimeout(rotate, 5000);
  }

  private stopSlider() {
    if (this.sliderTimer) {
      clearTimeout(this.sliderTimer);
      this.sliderTimer = null;
    }
  }

  scrollCarousel(direction: 'left' | 'right', element: HTMLElement) {
    const scrollAmount = 400; // Adjust based on card width + gap
    if (direction === 'left') {
      element.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      element.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }

  private initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, {
      threshold: 0.1
    });

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));
  }

  getWeather() {
    if (!this.searchCity.trim()) return;

    this.loading = true;
    this.error = null;
    this.weatherData = null;

    this.weatherService.getWeather(this.searchCity).subscribe({
      next: (data) => {
        this.weatherData = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Oops! We couldn\'t find a destination with that name. Please check your spelling and try again.';
        this.loading = false;
      }
    });
  }

  navigateToCategory(categoryName: string) {
    this.router.navigate(['/destinations'], {
      queryParams: { category: categoryName.toLowerCase() }
    });
  }

  explore(cityName: string) {
    this.router.navigate(['/destination', cityName]);
  }
}
