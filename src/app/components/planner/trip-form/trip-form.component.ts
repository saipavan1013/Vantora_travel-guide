import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { Trip } from '../../../models/trip.model';
import { DestinationService, DestinationSummary } from '../../../services/destination.service';
import { Observable, map, startWith } from 'rxjs';

@Component({
  selector: 'app-trip-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatIconModule
  ],
  template: `
    <div class="form-container">
      <form [formGroup]="tripForm" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Trip Title</mat-label>
          <input matInput formControlName="title" required placeholder="e.g. Summer in Paris">
        </mat-form-field>
        
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Main Destination</mat-label>
          <input matInput formControlName="destination" [matAutocomplete]="auto" required placeholder="Search City...">
          <mat-autocomplete #auto="matAutocomplete">
            <mat-option *ngFor="let dest of filteredDestinations | async" [value]="dest.city">
              <div class="dest-option">
                <img [src]="dest.image" class="dest-thumb">
                <span>{{ dest.city }}, {{ dest.country }}</span>
              </div>
            </mat-option>
          </mat-autocomplete>
        </mat-form-field>
        
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Start Date</mat-label>
            <input matInput [matDatepicker]="picker1" formControlName="startDate" required>
            <mat-datepicker-toggle matSuffix [for]="picker1"></mat-datepicker-toggle>
            <mat-datepicker #picker1></mat-datepicker>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>End Date</mat-label>
            <input matInput [matDatepicker]="picker2" formControlName="endDate" required>
            <mat-datepicker-toggle matSuffix [for]="picker2"></mat-datepicker-toggle>
            <mat-datepicker #picker2></mat-datepicker>
          </mat-form-field>
        </div>
        
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Number of Travelers</mat-label>
            <input matInput type="number" formControlName="travelers" required min="1">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Total Budget</mat-label>
            <input matInput type="number" formControlName="budget" required min="0">
            <span matPrefix>$&nbsp;</span>
          </mat-form-field>
        </div>

        <div class="budget-info" *ngIf="tripForm.get('budget')?.value && tripForm.get('travelers')?.value">
            <div class="info-tag">
                <mat-icon>payments</mat-icon>
                Estimated: <strong>{{ budgetPerTraveler | currency }}</strong> per traveler
            </div>
        </div>
        
        <div class="actions">
          <button mat-button type="button" (click)="cancel.emit()">Cancel</button>
          <button mat-raised-button color="primary" type="submit" [disabled]="!tripForm.valid">
            {{ trip ? 'Save Changes' : 'Start Planning' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .form-container { padding: 10px; border-radius: 20px; max-width: 600px; margin: 0 auto; background: white; }
    .full-width { width: 100%; }
    .form-row { display: flex; gap: 20px; }
    .form-row mat-form-field { flex: 1; }
    .actions { display: flex; justify-content: flex-end; gap: 15px; margin-top: 25px; border-top: 1px solid #eee; padding-top: 20px; }
    h2 { margin-bottom: 25px; color: #1a202c; font-weight: 800; border-bottom: 3px solid #3f51b5; display: inline-block; padding-bottom: 5px; }
    .dest-option { display: flex; align-items: center; gap: 12px; padding: 4px 0; }
    .dest-thumb { width: 32px; height: 32px; border-radius: 6px; object-fit: cover; }
    .budget-info { margin: 10px 0 20px; padding: 15px; background: #f0f7ff; border-radius: 12px; border-left: 4px solid #3182ce; }
    .info-tag { display: flex; align-items: center; gap: 8px; color: #2b6cb0; font-size: 0.95rem; }
    .info-tag mat-icon { font-size: 20px; width: 20px; height: 20px; }
  `]
})
export class TripFormComponent implements OnInit {
  @Input() trip?: Trip;
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  tripForm: FormGroup;
  destinations: DestinationSummary[] = [];
  filteredDestinations!: Observable<DestinationSummary[]>;

  constructor(private fb: FormBuilder, private destService: DestinationService) {
    this.tripForm = this.fb.group({
      title: ['', Validators.required],
      destination: ['', Validators.required],
      startDate: [new Date(), Validators.required],
      endDate: [new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), Validators.required],
      travelers: [1, [Validators.required, Validators.min(1)]],
      budget: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit() {
    this.destinations = this.destService.getAllDestinations();

    if (this.trip) {
      this.tripForm.patchValue({
        title: this.trip.title,
        destination: this.trip.destination,
        startDate: this.trip.startDate,
        endDate: this.trip.endDate,
        travelers: this.trip.travelers,
        budget: this.trip.budget
      });
    }

    this.filteredDestinations = this.tripForm.get('destination')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );
  }

  private _filter(value: string): DestinationSummary[] {
    const filterValue = value.toLowerCase();
    return this.destinations.filter(option =>
      option.city.toLowerCase().includes(filterValue) ||
      option.country.toLowerCase().includes(filterValue)
    );
  }

  get budgetPerTraveler(): number {
    const total = this.tripForm.get('budget')?.value || 0;
    const count = this.tripForm.get('travelers')?.value || 1;
    return total / (count || 1);
  }

  onSubmit() {
    if (this.tripForm.valid) {
      this.save.emit(this.tripForm.value);
    }
  }
}
