import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';
import { validateEmail, isDisposableEmail } from '../../utils/email-validator';
import { getFriendlyErrorMessage } from '../../utils/error-handler';

@Component({
    selector: 'app-signup',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterLink,
        MatIconModule,
        MatProgressSpinnerModule
    ],
    template: `
    <div class="glass-container">
        <h2 *ngIf="!success">Join Us</h2>
        <h2 *ngIf="success">Verify Your Email</h2>
        
        <form *ngIf="!success" (ngSubmit)="onSubmit()" #signupForm="ngForm">
            <div class="input-group">
                <input type="text" [(ngModel)]="name" name="name" required (input)="clearError()" #nameInput="ngModel">
                <label>Full Name</label>
            </div>

            <div class="input-group" [class.invalid]="emailError">
                <input type="email" [(ngModel)]="email" name="email" required (blur)="onEmailBlur()" (input)="clearError()" #emailInput="ngModel">
                <label>Email Address</label>
                <div class="field-error" *ngIf="emailError">{{ emailError }}</div>
            </div>

            <div class="input-group">
                <input type="password" [(ngModel)]="password" name="password" required minlength="6" (input)="clearError()" #passwordInput="ngModel">
                <label>Password</label>
                <div class="field-error" *ngIf="passwordInput.invalid && passwordInput.touched">Password must be at least 6 characters</div>
            </div>

            <button type="submit" class="login-btn" [disabled]="loading || !signupForm.form.valid || !!emailError">
              <span *ngIf="!loading">Create Account</span>
              <mat-spinner *ngIf="loading" diameter="24" color="accent"></mat-spinner>
            </button>
            
            <div class="vibe-error" *ngIf="error">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ff4d4d" style="flex-shrink: 0;"><path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
                <span>{{ error }}</span>
            </div>

            <div class="register-link">
                <p>Already a member? <a routerLink="/login">Sign In</a></p>
            </div>
        </form>

        <div class="success-message" *ngIf="success">
            <svg class="success-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
            <p>Verification email sent to <strong>{{ email }}</strong></p>
            <p>Please check your inbox and click the link to activate your account.</p>
            <button class="login-btn" routerLink="/login">Go to Login</button>
        </div>
    </div>
  `,
    styles: [`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .glass-container {
        position: relative;
        width: 380px;
        padding: 40px;
        border-radius: 20px;
        backdrop-filter: blur(15px);
        background: rgba(255, 255, 255, 0.4);
        border: 1px solid rgba(255, 255, 255, 0.4);
        box-shadow: 0 25px 45px rgba(0, 0, 0, 0.4);
        z-index: 10;
        overflow: hidden;
    }

    .glass-container h2 {
        color: #7f7c7c;
        font-size: 28px;
        font-weight: 600;
        text-align: center;
        letter-spacing: 1px;
        margin-bottom: 40px;
    }

    .dual-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
    }

    .input-group {
        position: relative;
        margin-bottom: 30px;
    }

    .input-group input {
        width: 100%;
        padding: 15px 20px;
        background: rgba(255, 255, 255, 0.2);
        border: none;
        outline: none;
        border-radius: 35px;
        font-size: 16px;
        color: #fff !important;
        transition: all 0.3s ease;
    }

    .input-group input:focus {
        background: rgba(255, 255, 255, 0.3);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    }

    .input-group input:-webkit-autofill,
    .input-group input:-webkit-autofill:hover, 
    .input-group input:-webkit-autofill:focus, 
    .input-group input:-webkit-autofill:active{
        -webkit-box-shadow: 0 0 0 30px rgba(255, 255, 255, 0.2) inset !important;
        -webkit-text-fill-color: white !important;
        transition: background-color 5000s ease-in-out 0s;
    }

    .input-group label {
        position: absolute;
        top: 50%;
        left: 20px;
        transform: translateY(-50%);
        color: rgba(255, 255, 255, 0.8);
        font-size: 16px;
        pointer-events: none;
        transition: all 0.3s ease;
    }

    .input-group input:focus + label,
    .input-group input:valid + label {
        top: 0;
        left: 15px;
        font-size: 12px;
        background: rgba(255, 255, 255, 0.2);
        padding: 2px 8px;
        border-radius: 10px;
        color: #7f7c7c;
    }

    .login-btn {
        width: 100%;
        padding: 15px;
        background: rgba(255, 255, 255, 0.3);
        border: none;
        border-radius: 35px;
        color: #fff;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .login-btn:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.4);
        transform: translateY(-3px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    }

    .register-link {
        text-align: center;
        margin-top: 25px;
        color: rgba(255, 255, 255, 0.8);
        font-size: 14px;
    }

    .register-link a {
        color: #fff;
        font-weight: 600;
        text-decoration: none;
        transition: all 0.3s ease;
    }

    .register-link a:hover {
        text-decoration: underline;
    }

    .vibe-error {
        margin-top: 20px;
        background: rgba(255, 0, 0, 0.2);
        padding: 12px;
        border-radius: 10px;
        color: #fff;
        display: flex;
        align-items: flex-start;
        gap: 10px;
        font-size: 0.85rem;
        line-height: 1.4;
    }

    @media (max-width: 650px) {
        .wide-card { width: 100%; max-width: 380px; }
        .dual-row { grid-template-columns: 1fr; gap: 0; }
    }

    .field-error {
        color: #ff4d4d;
        font-size: 11px;
        margin-top: 5px;
        padding-left: 15px;
    }

    .success-message {
        text-align: center;
        color: #fff;
    }

    .success-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        margin-bottom: 20px;
        color: #4CAF50;
    }

    .success-message p {
        margin-bottom: 15px;
        line-height: 1.5;
    }
  `]
})
export class Signup {
    name = '';
    email = '';
    password = '';
    loading = false;
    error = '';
    success = false;
    emailError = '';

    constructor(private authService: AuthService) { }

    clearError() {
        this.error = '';
        this.emailError = '';
    }

    onEmailBlur() {
        this.emailError = '';
        if (this.email && !validateEmail(this.email)) {
            this.emailError = 'Invalid email format';
        } else if (this.email && isDisposableEmail(this.email)) {
            this.emailError = 'Disposable emails are not allowed';
        }
    }

    async onSubmit() {
        this.onEmailBlur();
        if (this.emailError) return;

        this.loading = true;
        this.error = '';

        try {
            await this.authService.signUp(this.email, this.password, this.name);
            this.success = true;
        } catch (err: any) {
            this.error = getFriendlyErrorMessage(err);
        } finally {
            this.loading = false;
        }
    }
}
