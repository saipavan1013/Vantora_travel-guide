import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { Trip, DayPlan, Activity } from '../../../models/trip.model';

@Component({
  selector: 'app-itinerary-builder',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, DragDropModule],
  template: `
    <div class="itinerary-container">
      <h2 class="section-title">Your Timeline</h2>
      
      <div class="days-list">
        <div *ngFor="let day of trip.itinerary" class="day-card glass-card">
          <div class="day-header">
            <div class="day-info">
              <span class="day-number">Day {{ day.day }}</span>
              <span class="day-date">{{ day.date | date:'EEEE, MMM d' }}</span>
            </div>
            <button mat-icon-button (click)="addActivity.emit(day.day)">
              <mat-icon>add_circle</mat-icon>
            </button>
          </div>
          
          <div cdkDropList [cdkDropListData]="day.activities" (cdkDropListDropped)="onDrop($event, day)" class="activities-list">
            <div *ngIf="day.activities.length === 0" class="empty-state">
              <mat-icon>event_note</mat-icon>
              <p>No activities planned yet</p>
            </div>
            
            <div *ngFor="let activity of day.activities" cdkDrag class="activity-item glass-card">
              <div class="activity-icon" [ngClass]="activity.category.toLowerCase()">
                <mat-icon>{{ getIcon(activity.category) }}</mat-icon>
              </div>
              <div class="activity-details">
                <div class="activity-time">{{ activity.time }}</div>
                <div class="activity-name">{{ activity.name }}</div>
                <div class="activity-location" *ngIf="activity.location">
                  <mat-icon>place</mat-icon> {{ activity.location }}
                </div>
              </div>
              <div class="activity-actions">
                <span class="activity-cost" *ngIf="activity.cost">{{ activity.cost | currency }}</span>
                <button mat-icon-button color="warn" (click)="removeActivity.emit({day: day.day, activity: activity})">
                  <mat-icon>delete_outline</mat-icon>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .itinerary-container {
      margin-bottom: 30px;
    }
    .section-title {
      font-size: 1.8rem;
      font-weight: 700;
      margin-bottom: 20px;
      color: #2c3e50;
    }
    .days-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .day-card {
      padding: 20px;
      border-radius: 15px;
    }
    .day-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }
    .day-number {
      font-size: 1.2rem;
      font-weight: 700;
      color: #00d2ff;
      margin-right: 15px;
    }
    .day-date {
      font-size: 1.1rem;
      color: #666;
    }
    .activities-list {
      min-height: 50px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .activity-item {
      display: flex;
      align-items: center;
      padding: 12px 15px;
      border-radius: 12px;
      cursor: move;
      transition: transform 0.2s;
    }
    .activity-item:hover {
      transform: translateX(5px);
    }
    .activity-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 15px;
    }
    .activity-icon.sightseeing { background: #e3f2fd; color: #1976d2; }
    .activity-icon.food { background: #fff3e0; color: #f57c00; }
    .activity-icon.adventure { background: #e8f5e9; color: #2e7d32; }
    .activity-icon.shopping { background: #fce4ec; color: #c2185b; }
    .activity-icon.transport { background: #f3e5f5; color: #7b1fa2; }
    .activity-icon.culture { background: #efebe9; color: #5d4037; }
    .activity-icon.relaxation { background: #e0f2f1; color: #00796b; }
    .activity-icon.nightlife { background: #eceff1; color: #455a64; }
    .activity-icon.hiking { background: #f1f8e9; color: #33691e; }
    .activity-icon.wellness { background: #fce4ec; color: #ad1457; }
    
    .activity-details {
      flex: 1;
    }
    .activity-time {
      font-size: 0.8rem;
      color: #888;
      font-weight: 600;
    }
    .activity-name {
      font-weight: 600;
      color: #333;
    }
    .activity-location {
      font-size: 0.8rem;
      color: #777;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .activity-location mat-icon { font-size: 14px; width: 14px; height: 14px; }
    
    .activity-actions {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    .activity-cost {
      font-weight: 700;
      color: #2c3e50;
    }
    .empty-state {
      padding: 30px;
      text-align: center;
      color: #999;
      border: 2px dashed rgba(0,0,0,0.05);
      border-radius: 12px;
    }
    .empty-state mat-icon { font-size: 32px; width: 32px; height: 32px; margin-bottom: 10px; }
  `]
})
export class ItineraryBuilderComponent {
  @Input() trip!: Trip;
  @Output() addActivity = new EventEmitter<number>();
  @Output() removeActivity = new EventEmitter<{ day: number, activity: Activity }>();
  @Output() reorderActivities = new EventEmitter<{ day: number, activities: Activity[] }>();

  getIcon(category: string): string {
    switch (category.toLowerCase()) {
      case 'sightseeing': return 'museum';
      case 'food': return 'restaurant';
      case 'adventure': return 'terrain';
      case 'shopping': return 'shopping_bag';
      case 'transport': return 'directions_bus';
      case 'culture': return 'theater_comedy';
      case 'relaxation': return 'spa';
      case 'nightlife': return 'nightlife';
      case 'hiking': return 'hiking';
      case 'wellness': return 'self_improvement';
      default: return 'event';
    }
  }

  onDrop(event: CdkDragDrop<Activity[]>, day: DayPlan) {
    const previousIndex = event.previousIndex;
    const currentIndex = event.currentIndex;

    const newActivities = [...day.activities];
    moveItemInArray(newActivities, previousIndex, currentIndex);

    this.reorderActivities.emit({ day: day.day, activities: newActivities });
  }
}
