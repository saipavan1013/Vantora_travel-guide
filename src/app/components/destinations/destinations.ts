import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { DestinationService, DestinationSummary } from '../../services/destination.service';
import { ImageService } from '../../services/image.service';
import { FallbackImageDirective } from '../../directives/fallback-image.directive';

@Component({
    selector: 'app-destinations',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule, MatFormFieldModule, MatInputModule, FormsModule, RouterLink, FallbackImageDirective],
    templateUrl: './destinations.html',
    styleUrl: './destinations.css'
})
export class Destinations implements OnInit {
    allDestinations: DestinationSummary[] = [];
    filteredDestinations: DestinationSummary[] = [];
    trendingDestinations: DestinationSummary[] = [];

    // Filters
    searchTerm: string = '';
    selectedContinent: string = 'All';
    selectedCategory: string = 'All';

    continents: string[] = ['All', 'Europe', 'Asia', 'America', 'Africa', 'Oceania'];
    categories: string[] = ['All', 'Culture', 'Nature', 'City', 'Beach', 'Adventure'];

    constructor(
        private destinationService: DestinationService,
        private imageService: ImageService,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.allDestinations = this.destinationService.getAllDestinations();
        this.trendingDestinations = this.destinationService.getTrendingDestinations();
        this.filteredDestinations = [...this.allDestinations];

        // Read category filter from query params (e.g. from home page category cards)
        const categoryParam = this.route.snapshot.queryParamMap.get('category');
        if (categoryParam) {
            // Find the matching category (case-insensitive)
            const match = this.categories.find(
                c => c.toLowerCase() === categoryParam.toLowerCase()
            );
            if (match) {
                this.setCategory(match);
            }
        }
    }

    applyFilters() {
        this.filteredDestinations = this.allDestinations.filter(dest => {
            const matchesSearch = dest.city.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                dest.country.toLowerCase().includes(this.searchTerm.toLowerCase());
            const matchesContinent = this.selectedContinent === 'All' || dest.continent === this.selectedContinent;
            const matchesCategory = this.selectedCategory === 'All' || dest.category === this.selectedCategory;

            return matchesSearch && matchesContinent && matchesCategory;
        });
    }

    setContinent(continent: string) {
        this.selectedContinent = continent;
        this.applyFilters();
    }

    setCategory(category: string) {
        this.selectedCategory = category;
        this.applyFilters();
    }

    scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}
