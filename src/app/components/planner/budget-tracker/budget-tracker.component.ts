import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { Trip } from '../../../models/trip.model';

@Component({
    selector: 'app-budget-tracker',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatProgressBarModule, MatIconModule],
    template: `
    <div class="budget-container glass-card">
      <h2 class="section-title">Budget Tracker</h2>
      
      <div class="overall-status">
        <div class="status-top">
          <span class="spent">{{ totals.total | currency }} spent</span>
          <span class="total">of {{ trip.budget | currency }}</span>
        </div>
        <mat-progress-bar mode="determinate" [value]="percentSpent" [color]="progressColor"></mat-progress-bar>
        <div class="remaining" [ngStyle]="{'color': totals.remaining < 0 ? '#f44336' : '#4caf50'}">
          {{ totals.remaining < 0 ? 'Over budget by' : 'Remaining:' }} {{ Math.abs(totals.remaining) | currency }}
        </div>
      </div>
      
      <div class="breakdown">
        <div class="breakdown-item">
          <div class="item-header">
            <mat-icon color="primary">hotel</mat-icon>
            <span>Accommodation</span>
          </div>
          <span class="item-amount">{{ totals.accommodation | currency }}</span>
        </div>
        
        <div class="breakdown-item">
          <div class="item-header">
            <mat-icon color="accent">flight</mat-icon>
            <span>Transportation</span>
          </div>
          <span class="item-amount">{{ totals.transportation | currency }}</span>
        </div>
        
        <div class="breakdown-item">
          <div class="item-header">
            <mat-icon color="warn">local_activity</mat-icon>
            <span>Activities</span>
          </div>
          <span class="item-amount">{{ totals.activities | currency }}</span>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .budget-container {
      padding: 24px;
      border-radius: 20px;
      margin-bottom: 24px;
    }
    .section-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 20px;
      color: #2c3e50;
    }
    .overall-status {
      margin-bottom: 30px;
    }
    .status-top {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 8px;
    }
    .spent {
      font-size: 1.8rem;
      font-weight: 800;
      color: #2c3e50;
    }
    .total {
      font-size: 1rem;
      color: #777;
    }
    .remaining {
      margin-top: 10px;
      font-weight: 600;
      text-align: right;
    }
    .breakdown {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    .breakdown-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid rgba(0,0,0,0.05);
    }
    .item-header {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .item-amount {
      font-weight: 600;
      color: #444;
    }
    mat-progress-bar {
      height: 12px;
      border-radius: 6px;
    }
  `]
})
export class BudgetTrackerComponent implements OnChanges {
    @Input() trip!: Trip;

    totals = {
        accommodation: 0,
        transportation: 0,
        activities: 0,
        total: 0,
        remaining: 0
    };

    percentSpent = 0;
    progressColor: 'primary' | 'accent' | 'warn' = 'primary';
    Math = Math;

    ngOnChanges() {
        this.calculateTotals();
    }

    calculateTotals() {
        this.totals.accommodation = this.trip.accommodations?.reduce((sum, item) => sum + (item.cost || 0), 0) || 0;
        this.totals.transportation = this.trip.transportation?.reduce((sum, item) => sum + (item.cost || 0), 0) || 0;
        this.totals.activities = this.trip.itinerary?.reduce((sum, day) =>
            sum + day.activities.reduce((dSum, act) => dSum + (act.cost || 0), 0), 0) || 0;

        this.totals.total = this.totals.accommodation + this.totals.transportation + this.totals.activities;
        this.totals.remaining = (this.trip.budget || 0) - this.totals.total;

        this.percentSpent = (this.totals.total / (this.trip.budget || 1)) * 100;

        if (this.percentSpent > 90) this.progressColor = 'warn';
        else if (this.percentSpent > 70) this.progressColor = 'accent';
        else this.progressColor = 'primary';
    }
}
