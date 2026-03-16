import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { Observable, take } from 'rxjs';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-profile-edit-dialog',
  standalone: true,
  imports: [
    CommonModule, 
    MatDialogModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    ReactiveFormsModule
  ],
  template: `
    <h2 mat-dialog-title>Edit Profile</h2>
    <mat-dialog-content>
      <form [formGroup]="editForm" style="padding-top: 10px;">
        <mat-form-field appearance="outline" style="width: 100%;">
          <mat-label>Display Name</mat-label>
          <input matInput formControlName="displayName" placeholder="Your Name">
          <mat-error *ngIf="editForm.get('displayName')?.hasError('required')">
            Display name is required
          </mat-error>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="!editForm.valid">Save Changes</button>
    </mat-dialog-actions>
  `
})
export class ProfileEditDialog {
  editForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProfileEditDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { displayName: string }
  ) {
    this.editForm = this.fb.group({
      displayName: [data.displayName || '', Validators.required]
    });
  }

  onSave() {
    if (this.editForm.valid) {
      this.dialogRef.close(this.editForm.value.displayName);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule, 
    MatDividerModule, 
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {
  user$: Observable<User | null>;

  constructor(
    private authService: AuthService, 
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.user$ = this.authService.user$;
  }

  logout() {
    this.authService.logout();
  }

  editProfile() {
    this.user$.pipe(take(1)).subscribe(user => {
      if (user) {
        const dialogRef = this.dialog.open(ProfileEditDialog, {
          width: '400px',
          data: { displayName: user.displayName }
        });

        dialogRef.afterClosed().subscribe(async (newName) => {
          if (newName !== undefined && newName !== user.displayName) {
            try {
              await this.authService.updateUserName(newName);
              this.snackBar.open('Profile updated successfully!', 'Close', { duration: 3000 });
            } catch (error: any) {
              this.snackBar.open('Error updating profile: ' + error.message, 'Close', { duration: 3000 });
            }
          }
        });
      }
    });
  }
}
