import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';

import { TripService } from '../../services/trip.service';
import { AuthService } from '../../services/auth.service';
import { Trip, Activity, Destination, DayPlan } from '../../models/trip.model';
import { Observable, of } from 'rxjs';

// Sub-components
import { TripOverviewComponent } from './trip-overview/trip-overview.component';
import { ItineraryBuilderComponent } from './itinerary-builder/itinerary-builder.component';
import { BudgetTrackerComponent } from './budget-tracker/budget-tracker.component';
import { DestinationSelectorComponent } from './destination-selector/destination-selector.component';
import { ActivityFormComponent } from './activity-form/activity-form.component';
import { TripFormComponent } from './trip-form/trip-form.component';
import { AccommodationFormComponent } from './accommodation-form/accommodation-form.component';
import { TransportationFormComponent } from './transportation-form/transportation-form.component';

@Component({
  selector: 'app-confirm-trip-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Delete Trip</h2>
    <mat-dialog-content>
      <p>Are you sure you want to delete this trip? This action cannot be undone.</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="warn" [mat-dialog-close]="true">Delete</button>
    </mat-dialog-actions>
  `
})
export class ConfirmTripDialogComponent {}

@Component({
  selector: 'app-planner',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatSnackBarModule,
    MatCardModule,
    MatDialogModule,
    TripOverviewComponent,
    ItineraryBuilderComponent,
    BudgetTrackerComponent,
    DestinationSelectorComponent,
    ActivityFormComponent,
    TripFormComponent,
    AccommodationFormComponent,
    TransportationFormComponent
  ],
  templateUrl: './planner.html',
  styleUrl: './planner.css',
})
export class Planner implements OnInit {
  trips: Trip[] = [];
  activeTrip: Trip | null = null;
  userId: string | null = null;

  // UI State
  viewMode: 'list' | 'dashboard' | 'create' | 'edit' = 'list';
  showActivityForm = false;
  showAccommodationForm = false;
  showTransportationForm = false;
  selectedDayForActivity: number | null = null;

  constructor(
    private tripService: TripService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.userId = (user as any).uid;
      }
    });

    this.tripService.trips$.subscribe(trips => {
      this.trips = trips;
      // Update activeTrip if it's currently being viewed to reflect changes
      if (this.activeTrip) {
        const updated = trips.find(t => t.id === this.activeTrip?.id);
        if (updated) {
          this.activeTrip = { ...updated };
        }
      }
    });
  }

  selectTrip(trip: Trip) {
    this.activeTrip = { ...trip };
    this.viewMode = 'dashboard';
  }

  createNewTrip() {
    this.activeTrip = null;
    this.viewMode = 'create';
  }

  editTrip(trip: Trip) {
    this.activeTrip = { ...trip };
    this.viewMode = 'edit';
  }

  async onTripSave(tripData: any) {
    if (this.viewMode === 'edit' && this.activeTrip?.id) {
      await this.tripService.updateTrip(this.activeTrip.id, {
        ...tripData
      });
      this.snackBar.open('Trip updated!', 'Close', { duration: 3000 });
    } else {
      const itinerary = this.tripService.generateItinerary(tripData.startDate, tripData.endDate);
      await this.tripService.createTrip({
        ...tripData,
        userId: this.userId || 'guest',
        itinerary: itinerary
      });
      this.snackBar.open('Trip created!', 'Close', { duration: 3000 });
    }
    this.viewMode = 'list';
    this.activeTrip = null;
  }

  deleteTrip(id: string) {
    const dialogRef = this.dialog.open(ConfirmTripDialogComponent, {
      width: '400px',
      position: { top: '10%' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tripService.deleteTrip(id);
        this.snackBar.open('Trip deleted', 'Close', { duration: 3000 });
        if (this.activeTrip?.id === id) {
          this.activeTrip = null;
          this.viewMode = 'list';
        }
        this.cdr.detectChanges();
      }
    });
  }

  // Itinerary Actions
  onAddActivity(day: number) {
    this.selectedDayForActivity = day;
    this.showActivityForm = true;
  }

  saveActivity(activity: Activity) {
    if (!this.activeTrip || this.selectedDayForActivity === null) return;

    const updatedItinerary = [...this.activeTrip.itinerary];
    const dayIndex = updatedItinerary.findIndex(d => d.day === this.selectedDayForActivity);

    if (dayIndex > -1) {
      const updatedDay = {
        ...updatedItinerary[dayIndex],
        activities: [...updatedItinerary[dayIndex].activities, activity]
      };
      updatedItinerary[dayIndex] = updatedDay;

      this.tripService.updateTrip(this.activeTrip.id!, { itinerary: updatedItinerary });
      this.showActivityForm = false;
      this.snackBar.open('Activity added!', 'Close', { duration: 2000 });
    }
  }

  removeActivity(data: { day: number, activity: Activity }) {
    if (!this.activeTrip) return;

    const updatedItinerary = this.activeTrip.itinerary.map(day => {
      if (day.day === data.day) {
        return { ...day, activities: day.activities.filter(a => a !== data.activity) };
      }
      return day;
    });

    this.tripService.updateTrip(this.activeTrip.id!, { itinerary: updatedItinerary });
  }

  reorderActivities(data: { day: number, activities: Activity[] }) {
    if (!this.activeTrip) return;

    const updatedItinerary = this.activeTrip.itinerary.map(day => {
      if (day.day === data.day) {
        return { ...day, activities: data.activities };
      }
      return day;
    });

    this.tripService.updateTrip(this.activeTrip.id!, { itinerary: updatedItinerary });
  }

  // Destination Actions
  onDestinationSelected(dest: Destination) {
    if (!this.activeTrip) return;
    const updatedDestinations = [...(this.activeTrip.destinations || []), dest];
    this.tripService.updateTrip(this.activeTrip.id!, { destinations: updatedDestinations });
  }

  // Accommodation & Transportation
  saveAccommodation(acc: any) {
    if (!this.activeTrip) return;
    const updatedAcc = [...(this.activeTrip.accommodations || []), acc];
    this.tripService.updateTrip(this.activeTrip.id!, { accommodations: updatedAcc });
    this.showAccommodationForm = false;
  }

  saveTransportation(trans: any) {
    if (!this.activeTrip) return;
    const updatedTrans = [...(this.activeTrip.transportation || []), trans];
    this.tripService.updateTrip(this.activeTrip.id!, { transportation: updatedTrans });
    this.showTransportationForm = false;
  }
}
