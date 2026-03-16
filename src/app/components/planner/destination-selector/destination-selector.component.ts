import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { DestinationService } from '../../../services/destination.service';
import { Destination } from '../../../models/trip.model';
import { Observable, of, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-destination-selector',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule
  ],
  template: `
    <div class="selector-container glass-card">
      <h2 class="section-title">Add Destinations</h2>
      <div class="search-box">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Search for a city...</mat-label>
          <input matInput 
                 placeholder="e.g. Paris" 
                 [(ngModel)]="searchQuery"
                 (ngModelChange)="onSearchChange($event)"
                 [matAutocomplete]="auto">
          <mat-icon matSuffix>search</mat-icon>
          <mat-autocomplete #auto="matAutocomplete" 
                            [displayWith]="displayFn"
                            (optionSelected)="onSelected($event.option.value)">
            <mat-option *ngFor="let option of filteredOptions$ | async" [value]="option">
              {{ option.city }}, {{ option.country }}
            </mat-option>
          </mat-autocomplete>
        </mat-form-field>
      </div>
      
      <div class="selected-destinations" *ngIf="selectedDestinations.length > 0">
        <div *ngFor="let dest of selectedDestinations" class="dest-card glass-card">
          <img [src]="dest.imageUrl" [alt]="dest.name" class="dest-img" (error)="dest.imageUrl = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=200'">
          <div class="dest-info">
            <h3>{{ dest.name }}</h3>
            <p>{{ dest.country }}</p>
          </div>
          <button mat-icon-button color="warn" (click)="remove(dest)">
            <mat-icon>remove_circle</mat-icon>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .selector-container { padding: 24px; border-radius: 20px; margin-bottom: 24px; }
    .full-width { width: 100%; }
    .section-title { font-size: 1.5rem; font-weight: 700; margin-bottom: 20px; color: #2c3e50; }
    .selected-destinations { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 15px; margin-top: 20px; }
    .dest-card { display: flex; align-items: center; padding: 10px; border-radius: 12px; overflow: hidden; }
    .dest-img { width: 60px; height: 60px; border-radius: 10px; object-fit: cover; margin-right: 15px; }
    .dest-info { flex: 1; }
    .dest-info h3 { margin: 0; font-size: 1rem; }
    .dest-info p { margin: 0; font-size: 0.8rem; color: #666; }
  `]
})
export class DestinationSelectorComponent implements OnInit {
  @Output() destinationSelected = new EventEmitter<Destination>();
  @Output() destinationRemoved = new EventEmitter<Destination>();

  searchQuery: string = '';
  selectedDestinations: Destination[] = [];
  filteredOptions$: Observable<any[]>;
  private searchSubject = new Subject<string>();

  constructor(private destinationService: DestinationService) {
    this.filteredOptions$ = this.searchSubject.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  ngOnInit() { }

  onSearchChange(value: string) {
    this.searchSubject.next(value);
  }

  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    const allDestinations = this.destinationService.getAllDestinations();
    return allDestinations.filter(option =>
      option.city.toLowerCase().includes(filterValue) ||
      option.country.toLowerCase().includes(filterValue)
    ).slice(0, 10);
  }

  displayFn(dest: any): string {
    return dest ? dest.city : '';
  }

  onSelected(dest: any) {
    const newDest: Destination = {
      name: dest.city,
      country: dest.country || '',
      description: dest.description || '',
      imageUrl: dest.image || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600'
    };

    if (!this.selectedDestinations.find(d => d.name === newDest.name)) {
      this.selectedDestinations.push(newDest);
      this.destinationSelected.emit(newDest);
    }
    this.searchQuery = '';
    this.searchSubject.next('');
  }

  remove(dest: Destination) {
    this.selectedDestinations = this.selectedDestinations.filter(d => d.name !== dest.name);
    this.destinationRemoved.emit(dest);
  }
}
