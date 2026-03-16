import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Activity } from '../../../models/trip.model';
import { DestinationService } from '../../../services/destination.service';

@Component({
  selector: 'app-activity-form',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, MatAutocompleteModule],
  template: `
    <div class="activity-modal glass-card">
      <div class="modal-header">
        <div class="header-title">
          <mat-icon class="header-icon">add_task</mat-icon>
          <h3>Add Activity for Day {{ day }}</h3>
        </div>
        <button mat-icon-button (click)="cancel.emit()" class="close-btn">
          <mat-icon>close</mat-icon>
        </button>
      </div>
      
      <form (ngSubmit)="onSubmit()" class="modal-content">
        <!-- Row 1: Activity Name -->
        <div class="form-group full-width">
          <label class="field-label">Activity Name*</label>
          <mat-form-field appearance="outline" class="premium-field">
            <mat-icon matPrefix>edit_note</mat-icon>
            <input matInput name="name" [(ngModel)]="activity.name" required placeholder="e.g. Visit Eiffel Tower">
          </mat-form-field>
        </div>
        
        <!-- Row 2: Time and Category -->
        <div class="form-row grid-2">
          <div class="form-group">
            <label class="field-label">Start Time</label>
            <div class="time-picker-row">
              <mat-form-field appearance="outline" class="time-field hour">
                <mat-select name="hour" [(ngModel)]="selectedHour">
                  <mat-option *ngFor="let h of hours" [value]="h">{{ h }}</mat-option>
                </mat-select>
              </mat-form-field>
              
              <span class="time-sep">:</span>
              
              <mat-form-field appearance="outline" class="time-field minute">
                <mat-select name="minute" [(ngModel)]="selectedMinute">
                  <mat-option *ngFor="let m of minutes" [value]="m">{{ m }}</mat-option>
                </mat-select>
              </mat-form-field>
              
              <mat-form-field appearance="outline" class="time-field ampm">
                <mat-select name="ampm" [(ngModel)]="selectedAmPm">
                  <mat-option value="AM">AM</mat-option>
                  <mat-option value="PM">PM</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
          </div>
          
          <div class="form-group">
            <label class="field-label">Category</label>
            <mat-form-field appearance="outline" class="premium-field">
              <mat-icon matPrefix>category</mat-icon>
              <mat-select name="category" [(ngModel)]="activity.category" (selectionChange)="suggestCost()">
                <mat-option *ngFor="let cat of categories" [value]="cat">{{ cat }}</mat-option>
              </mat-select>
            </mat-form-field>
          </div>
        </div>
        
        <!-- Row 3: Location -->
        <div class="form-group full-width">
          <label class="field-label">Location</label>
          <mat-form-field appearance="outline" class="premium-field">
            <mat-icon matPrefix>place</mat-icon>
            <input matInput 
                   name="location" 
                   [(ngModel)]="activity.location" 
                   [matAutocomplete]="auto"
                   (input)="onLocationInput()"
                   (blur)="suggestCost()" 
                   placeholder="Search popular spots in {{ destination }}...">
            <mat-autocomplete #auto="matAutocomplete" (optionSelected)="onLocationSelected($event.option.value)">
              <mat-option *ngFor="let loc of filteredLocations" [value]="loc">
                {{ loc }}
              </mat-option>
            </mat-autocomplete>
          </mat-form-field>
        </div>
        
        <!-- Row 4: Cost and Notes -->
        <div class="form-row grid-2">
          <div class="form-group">
            <label class="field-label">Estimated Cost</label>
            <mat-form-field appearance="outline" class="premium-field">
              <mat-icon matPrefix>payments</mat-icon>
              <input matInput type="number" name="cost" [(ngModel)]="activity.cost" placeholder="0.00">
              <span matTextPrefix class="currency-symbol">$</span>
            </mat-form-field>
          </div>
          
          <div class="form-group">
            <label class="field-label">Notes</label>
            <mat-form-field appearance="outline" class="premium-field">
              <mat-icon matPrefix>description</mat-icon>
              <textarea matInput name="notes" [(ngModel)]="activity.notes" placeholder="Booking details, tips..." rows="1"></textarea>
            </mat-form-field>
          </div>
        </div>
        
        <div class="modal-footer">
          <button mat-button type="button" class="btn-cancel" (click)="cancel.emit()">Cancel</button>
          <button mat-raised-button color="primary" class="btn-submit" type="submit" [disabled]="!activity.name">
            Add Activity
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .activity-modal {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      width: 100%;
      max-width: 600px;
    }

    .modal-header {
      padding: 16px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #f0f0f0;
      background: #fcfcfc;
    }

    .header-title {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .header-icon {
      color: #3f51b5;
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    h3 {
      margin: 0;
      font-size: 1.2rem;
      font-weight: 700;
      color: #1a202c;
    }

    .close-btn { color: #a0aec0; }

    .modal-content {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .field-label {
      font-size: 0.85rem;
      font-weight: 600;
      color: #4a5568;
      margin-left: 2px;
    }

    .form-row.grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .full-width { width: 100%; }

    /* Time Picker Row */
    .time-picker-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .time-field.hour, .time-field.minute { width: 70px; }
    .time-field.ampm { width: 85px; }

    .time-sep {
      font-weight: 800;
      color: #cbd5e0;
      padding-bottom: 4px;
    }

    /* Fixed alignment for icons and prefixes */
    mat-icon[matPrefix] {
      color: #cbd5e0;
      font-size: 20px;
      width: 20px;
      height: 20px;
      margin-right: 8px;
    }

    .currency-symbol {
      font-weight: 600;
      color: #4a5568;
      margin-right: 4px;
      font-size: 0.95rem;
    }

    /* Material Overrides for clean alignment */
    ::ng-deep .premium-field .mat-mdc-form-field-flex,
    ::ng-deep .time-field .mat-mdc-form-field-flex {
      align-items: center !important;
    }

    ::ng-deep .mat-mdc-form-field-subscript-wrapper {
      display: none !important;
    }

    /* Footer Buttons */
    .modal-footer {
      margin-top: 8px;
      padding-top: 24px;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      border-top: 1px solid #f0f0f0;
    }

    .btn-cancel {
      font-weight: 600;
      color: #718096;
    }

    .btn-submit {
      font-weight: 700;
      border-radius: 8px !important;
      padding: 0 24px !important;
    }
  `]
})
export class ActivityFormComponent {
  @Input() day!: number;
  @Input() destination: string = '';
  @Output() save = new EventEmitter<Activity>();
  @Output() cancel = new EventEmitter<void>();

  activity: Activity = {
    name: '',
    time: '10:00 AM',
    category: 'Sightseeing',
    location: '',
    cost: 0
  };

  hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  minutes = ['00', '15', '30', '45'];
  selectedHour = 10;
  selectedMinute = '00';
  selectedAmPm = 'AM';

  locations: string[] = [];
  filteredLocations: string[] = [];

  constructor(private destService: DestinationService) { }

  ngOnInit() {
    this.loadLocations();
  }

  ngOnChanges() {
    this.loadLocations();
  }

  loadLocations() {
    if (this.destination) {
      this.locations = this.destService.getAttractions(this.destination);
      this.filteredLocations = [...this.locations];
    }
  }

  onLocationInput() {
    const filterValue = this.activity.location.toLowerCase();
    this.filteredLocations = this.locations.filter(loc =>
      loc.toLowerCase().includes(filterValue)
    );
  }

  onLocationSelected(value: string) {
    this.activity.location = value;
    this.suggestCost();
  }

  categories = [
    'Sightseeing', 'Food', 'Adventure', 'Shopping',
    'Transport', 'Culture', 'Relaxation', 'Nightlife',
    'Hiking', 'Wellness'
  ];

  suggestCost() {
    const loc = this.activity.location.toLowerCase();
    const cat = this.activity.category;

    // Categorical base costs
    const baseCosts: Record<string, number> = {
      'Food': 25,
      'Sightseeing': 15,
      'Adventure': 50,
      'Shopping': 0,
      'Transport': 10,
      'Culture': 20,
      'Relaxation': 30,
      'Nightlife': 40,
      'Hiking': 0,
      'Wellness': 60
    };

    let suggested = baseCosts[cat] || 0;
    const dest = this.destination.toLowerCase();

    // Destination-specific landmarks/activities
    if (dest.includes('paris')) {
      if (loc.includes('eiffel') || loc.includes('louvre')) suggested = 25;
      if (loc.includes('disney')) suggested = 90;
    } else if (dest.includes('london')) {
      if (loc.includes('eye') || loc.includes('tower')) suggested = 30;
    } else if (dest.includes('tokyo')) {
      if (loc.includes('skytree') || loc.includes('disney')) suggested = 60;
    } else if (dest.includes('bali')) {
      if (loc.includes('temple') || loc.includes('tour')) suggested = 10;
    }

    // Keyword based modifiers (overrides)
    if (loc.includes('fine dining') || loc.includes('michelin')) suggested = 150;
    else if (loc.includes('museum') || loc.includes('palace')) suggested = 25;
    else if (loc.includes('free') || loc.includes('park')) suggested = 0;
    else if (loc.includes('airport') || loc.includes('taxi')) suggested = 40;
    else if (loc.includes('spa') || loc.includes('massage')) suggested = 80;
    else if (loc.includes('cinema') || loc.includes('theater')) suggested = 20;

    this.activity.cost = suggested;
  }

  onSubmit() {
    this.activity.time = `${this.selectedHour}:${this.selectedMinute} ${this.selectedAmPm}`;
    this.save.emit(this.activity);

    // Reset for next use
    this.activity = {
      name: '',
      time: '10:00 AM',
      category: 'Sightseeing',
      location: '',
      cost: 0
    };
  }
}
