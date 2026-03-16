import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { Transportation } from '../../../models/trip.model';

@Component({
    selector: 'app-transportation-form',
    standalone: true,
    imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatButtonModule],
    template: `
    <div class="form-container glass-card">
      <h3>Add Transportation</h3>
      <form #f="ngForm" (ngSubmit)="onSubmit(f.value)">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Transport Type</mat-label>
          <mat-select name="type" ngModel="Flight" required>
            <mat-option value="Flight">Flight</mat-option>
            <mat-option value="Train">Train</mat-option>
            <mat-option value="Car">Car</mat-option>
            <mat-option value="Bus">Bus</mat-option>
          </mat-select>
        </mat-form-field>
        
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>From</mat-label>
            <input matInput name="departureLocation" ngModel required>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>To</mat-label>
            <input matInput name="arrivalLocation" ngModel required>
          </mat-form-field>
        </div>
        
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Departure Time</mat-label>
            <input matInput [matDatepicker]="picker1" name="departureTime" ngModel required>
            <mat-datepicker-toggle matSuffix [for]="picker1"></mat-datepicker-toggle>
            <mat-datepicker #picker1></mat-datepicker>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Arrival Time</mat-label>
            <input matInput [matDatepicker]="picker2" name="arrivalTime" ngModel required>
            <mat-datepicker-toggle matSuffix [for]="picker2"></mat-datepicker-toggle>
            <mat-datepicker #picker2></mat-datepicker>
          </mat-form-field>
        </div>
        
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Cost</mat-label>
            <input matInput type="number" name="cost" ngModel>
            <span matPrefix>$&nbsp;</span>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Booking Ref</mat-label>
            <input matInput name="bookingReference" ngModel>
          </mat-form-field>
        </div>
        
        <div class="actions">
          <button mat-button type="button" (click)="cancel.emit()">Cancel</button>
          <button mat-raised-button color="primary" type="submit" [disabled]="!f.valid">Save</button>
        </div>
      </form>
    </div>
  `,
    styles: [`
    .form-container { padding: 20px; border-radius: 15px; }
    .full-width { width: 100%; }
    .form-row { display: flex; gap: 15px; }
    .form-row mat-form-field { flex: 1; }
    .actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px; }
    h3 { margin-bottom: 20px; color: #2c3e50; }
  `]
})
export class TransportationFormComponent {
    @Output() save = new EventEmitter<Transportation>();
    @Output() cancel = new EventEmitter<void>();
    onSubmit(values: any) { this.save.emit(values); }
}
