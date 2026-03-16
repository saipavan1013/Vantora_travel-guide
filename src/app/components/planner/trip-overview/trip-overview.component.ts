import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Trip } from '../../../models/trip.model';

@Component({
  selector: 'app-trip-overview',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule],
  template: `
    <div class="trip-overview-header glass-card">
      <div class="header-content">
        <div class="title-section">
          <h1 class="trip-title">{{ trip.title || 'Untitled Trip' }}</h1>
          <div class="trip-meta">
            <span class="meta-item">
              <mat-icon>place</mat-icon>
              {{ trip.destination }}
            </span>
            <span class="meta-item">
              <mat-icon>calendar_today</mat-icon>
              {{ trip.startDate | date:'MMM d' }} - {{ trip.endDate | date:'MMM d, y' }}
            </span>
            <span class="meta-item">
              <mat-icon>people</mat-icon>
              {{ trip.travelers }} Travelers
            </span>
          </div>
        </div>
        
        <div class="actions-section">
          <mat-chip-set>
            <mat-chip [class]="'status-chip ' + trip.status.toLowerCase()">
              {{ trip.status }}
            </mat-chip>
          </mat-chip-set>
          <button mat-stroked-button color="primary" (click)="edit.emit()">
            <mat-icon>edit</mat-icon> Edit Trip
          </button>
        </div>
      </div>
      
      <div class="budget-summary">
        <div class="budget-item">
          <span class="label">Total Budget</span>
          <span class="value">{{ trip.budget | currency }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .trip-overview-header {
      padding: 24px;
      margin-bottom: 24px;
      border-radius: 20px;
    }
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 20px;
    }
    .trip-title {
      font-size: 3.5rem;
      font-weight: 900;
      margin: 0 0 15px 0;
      background: linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      line-height: 1.2;
      padding-bottom: 5px;
      display: block;
    }
    .trip-meta {
      display: flex;
      gap: 20px;
      color: #666;
    }
    .meta-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.9rem;
    }
    .meta-item mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }
    .actions-section {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 15px;
    }
    .status-chip.planning { background: #e3f2fd; color: #1976d2; }
    .status-chip.confirmed { background: #e8f5e9; color: #2e7d32; }
    .status-chip.completed { background: #f5f5f5; color: #616161; }
    
    .budget-summary {
      border-top: 1px solid rgba(255,255,255,0.2);
      padding-top: 20px;
      display: flex;
      gap: 40px;
    }
    .budget-item .label {
      display: block;
      font-size: 0.8rem;
      color: #777;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .budget-item .value {
      font-size: 1.5rem;
      font-weight: 600;
      color: #2c3e50;
    }
  `]
})
export class TripOverviewComponent {
  @Input() trip!: Trip;
  @Output() edit = new EventEmitter<void>();
}
