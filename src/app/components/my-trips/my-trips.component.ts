import { Component, OnInit, ViewChild, AfterViewInit, Inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MyTripService } from '../../services/my-trip.service';
import { Trip } from '../../models/trip.model';
import { User } from '@angular/fire/auth';
import { TripFormComponent } from '../planner/trip-form/trip-form.component';

@Component({
  selector: 'app-trip-detail-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatDividerModule, MatListModule],
  template: `
    <div class="dialog-header">
      <h2 mat-dialog-title>Trip Details: {{data.title}}</h2>
      <button mat-icon-button mat-dialog-close><mat-icon>close</mat-icon></button>
    </div>
    <mat-dialog-content>
      <div class="detail-grid">
        <div class="detail-item">
          <label>Destination</label>
          <p>{{data.destination}}</p>
        </div>
        <div class="detail-item">
          <label>Dates</label>
          <p>{{data.startDate | date:'mediumDate'}} - {{data.endDate | date:'mediumDate'}}</p>
        </div>
        <div class="detail-item">
          <label>Status</label>
          <p><span class="status-badge" [class]="getStatusClass(data.status)">{{data.status}}</span></p>
        </div>
        <div class="detail-item">
          <label>Travelers</label>
          <p>{{data.travelers}} People</p>
        </div>
        <div class="detail-item">
          <label>Budget</label>
          <p>{{data.budget | currency}}</p>
        </div>
        <div class="detail-item">
          <label>Trip ID</label>
          <p>{{data.id}}</p>
        </div>
      </div>
      
      <mat-divider></mat-divider>
      
      <div class="itinerary-summary" *ngIf="data.itinerary && data.itinerary.length > 0">
        <h3>Itinerary Overview</h3>
        <mat-list>
          <mat-list-item *ngFor="let day of data.itinerary">  
            <span matListItemTitle>Day {{day.day}} - {{day.date | date:'EEE, MMM d'}}</span>
            <span matListItemLine>{{day.activities.length}} Activities planned</span>
          </mat-list-item>
        </mat-list>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-header { display: flex; justify-content: space-between; align-items: center; padding-right: 8px; }
    .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; padding-top: 10px; }
    .detail-item label { color: #666; font-size: 0.85rem; font-weight: 600; text-transform: uppercase; display: block; margin-bottom: 4px; }
    .detail-item p { font-size: 1.1rem; color: #1a1a1a; margin: 0; font-weight: 500; }
    .status-badge { padding: 4px 12px; border-radius: 6px; font-size: 0.85rem; font-weight: 600; }
    .status-planning { background-color: #e3f2fd; color: #1976d2; }
    .status-confirmed { background-color: #e8f5e9; color: #2e7d32; }
    .status-completed { background-color: #fff3e0; color: #ef6c00; }
    h3 { margin: 24px 0 12px; font-size: 1.2rem; font-weight: 600; }
    mat-dialog-content { min-width: 450px; }
  `]
})
export class TripDetailDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: Trip) { }
  getStatusClass(status: string): string {
    switch (status?.toLowerCase() || '') {
      case 'confirmed': return 'status-confirmed';
      case 'planning': return 'status-planning';
      case 'completed': return 'status-completed';
      default: return '';
    }
  }
}

@Component({
  selector: 'app-trip-edit-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, TripFormComponent],
  template: `
    <h2 mat-dialog-title>Edit Trip Details</h2>
    <mat-dialog-content>
      <app-trip-form [trip]="data" (save)="onSave($event)" (cancel)="onCancel()"></app-trip-form>
    </mat-dialog-content>
  `,
  styles: [`
    h2 { font-size: 1.5rem; font-weight: 700; color: #1a1a1a; margin-bottom: 20px; }
  `]
})
export class TripEditDialog {
  constructor(
    public dialogRef: MatDialogRef<TripEditDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Trip
  ) { }
  onSave(updatedTrip: any) { this.dialogRef.close(updatedTrip); }
  onCancel() { this.dialogRef.close(); }
}

@Component({
  selector: 'app-delete-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="delete-dialog">
      <div class="icon-header">
        <mat-icon color="warn">report_problem</mat-icon>
      </div>
      <h2 mat-dialog-title>Are you sure?</h2>
      <mat-dialog-content>
        <p>You are about to delete your trip to <strong>{{data.destination}}</strong>.</p>
        <p class="secondary-text">This action is permanent and all planned activities will be lost.</p>
      </mat-dialog-content>
      <mat-dialog-actions align="center">
        <button mat-button mat-dialog-close class="cancel-btn">No, Keep it</button>
        <button mat-raised-button color="warn" [mat-dialog-close]="true" class="delete-btn">Yes, Delete Trip</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .delete-dialog { text-align: center; padding: 16px; }
    .icon-header { margin-bottom: 20px; }
    .icon-header mat-icon { font-size: 64px; width: 64px; height: 64px; opacity: 0.8; }
    h2 { font-size: 1.5rem; font-weight: 700; color: #212121; margin: 0 0 12px !important; border:none !important; }
    p { margin: 0; font-size: 1.1rem; color: #424242; line-height: 1.5; }
    .secondary-text { font-size: 0.95rem; color: #757575; margin-top: 12px; }
    mat-dialog-content { padding: 0 24px !important; }
    mat-dialog-actions { padding: 24px 0 8px; display: flex; justify-content: center; gap: 16px; }
    .cancel-btn { font-weight: 600; color: #616161; }
    .delete-btn { font-weight: 600; padding: 0 24px !important; border-radius: 8px; }
  `]
})
export class DeleteConfirmDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
}

@Component({
  selector: 'app-my-trips',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatPaginatorModule, MatSortModule,
    MatInputModule, MatFormFieldModule, MatButtonModule, MatIconModule,
    MatChipsModule, MatProgressSpinnerModule, MatDialogModule,
    MatTooltipModule, MatSnackBarModule, TripFormComponent
  ],
  templateUrl: './my-trips.component.html',
  styleUrl: './my-trips.component.css'
})
export class MyTrips implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'destination', 'location', 'category', 'date', 'budget', 'status', 'actions'];
  dataSource = new MatTableDataSource<Trip>([]);
  isLoading = true;
  showCreateForm = false;
  userId: string = 'guest';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private myTripService: MyTripService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.authService.user$.subscribe((user: User | null) => {
      if (user) this.userId = user.uid;
    });
    this.fetchTrips();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  fetchTrips(): void {
    this.isLoading = true;
    this.myTripService.getMyTrips().subscribe({
      next: (trips) => {
        this.dataSource.data = trips;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching trips', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onCreateTrip(tripData: any): void {
    const newTrip: Trip = {
      ...tripData,
      status: 'Planning',
      createdAt: new Date(),
      itinerary: [],
      destinations: [],
      accommodations: [],
      transportation: [],
      expenses: [],
      userId: this.userId
    };

    this.myTripService.createTrip(newTrip).subscribe({
      next: () => {
        this.snackBar.open('Trip created successfully!', 'Close', { duration: 3000 });
        this.showCreateForm = false;
        this.fetchTrips();
      },
      error: (err) => {
        console.error('Error creating trip', err);
        this.snackBar.open('Failed to create trip. Please try again.', 'Close', { duration: 3000 });
      }
    });
  }

  viewTrip(trip: Trip): void {
    this.dialog.open(TripDetailDialog, { data: trip, width: '500px' });
  }

  editTrip(trip: Trip): void {
    const dialogRef = this.dialog.open(TripEditDialog, { data: trip, width: '600px' });
    dialogRef.afterClosed().subscribe(result => {
      if (result && trip.id) {
        this.myTripService.updateTrip(trip.id, result).subscribe({
          next: () => this.fetchTrips(),
          error: (err) => console.error('Error updating trip', err)
        });
      }
    });
  }

  deleteTrip(trip: Trip): void {
    const dialogRef = this.dialog.open(DeleteConfirmDialog, {
      data: trip, width: '400px', panelClass: 'friendly-delete-dialog'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.myTripService.deleteTrip(trip.id!).subscribe({
          next: () => {
            this.snackBar.open('Trip deleted successfully', 'Close', { duration: 3000 });
            this.fetchTrips();
          },
          error: (err) => {
            console.error('Error deleting trip', err);
            this.snackBar.open('Failed to delete trip', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase() || '') {
      case 'confirmed': return 'status-confirmed';
      case 'planning': return 'status-planning';
      case 'completed': return 'status-completed';
      default: return '';
    }
  }
}
