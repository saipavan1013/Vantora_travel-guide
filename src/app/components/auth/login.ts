import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';
import { getFriendlyErrorMessage } from '../../utils/error-handler';

@Component({
    selector: 'app-login',
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
        <h2>Login</h2>
        <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
            <div class="input-group">
                <input type="email" [(ngModel)]="email" name="email" required (input)="clearError()" #emailInput="ngModel">
                <label>Email Address</label>
            </div>

            <div class="input-group">
                <input type="password" [(ngModel)]="password" name="password" required (input)="clearError()" #passwordInput="ngModel">
                <label>Password</label>
            </div>

            <div class="remember-forgot">
                <label><input type="checkbox" [(ngModel)]="rememberMe" name="rememberMe">Remember me</label>
                <a routerLink="/forgot-password">Forgot Password?</a>
            </div>

            <button type="submit" class="login-btn" [disabled]="loading || !loginForm.form.valid">
              <span *ngIf="!loading">Login</span>
              <mat-spinner *ngIf="loading" diameter="24" color="accent"></mat-spinner>
            </button>
            
            <div class="vibe-error" *ngIf="error && !showResend">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ff4d4d" style="flex-shrink: 0;"><path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
                <span>{{ error }}</span>
            </div>

            <div class="unverified-msg" *ngIf="showResend">
                <div class="unverified-header">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffb703" style="flex-shrink: 0;"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z"/></svg>
                    <span>Verification Required</span>
                </div>
                <p>Your email address has not been verified yet. Please check your inbox to activate your account.</p>
                <button type="button" class="resend-btn" (click)="onResendVerification()" [disabled]="resending">
                    {{ resending ? 'Sending...' : 'Resend verification link' }}
                </button>
            </div>

            <div class="register-link">
                <p>Don't have an account? <a routerLink="/signup">Register</a></p>
            </div>
        </form>
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

    .input-group input::placeholder {
        color: rgba(255, 255, 255, 0.7);
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

    .login-btn:hover {
        background: rgba(255, 255, 255, 0.4);
        transform: translateY(-3px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    }

    .remember-forgot {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: rgba(255, 255, 255, 0.8);
        margin-bottom: 25px;
    }

    .remember-forgot a {
        color: #fff;
        text-decoration: none;
        transition: all 0.3s ease;
    }

    .remember-forgot a:hover {
        text-decoration: underline;
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
        text-decoration-line: underline;
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

    .unverified-msg {
        margin-top: 20px;
        background: rgba(255, 150, 0, 0.2);
        padding: 15px;
        border-radius: 10px;
        color: #fff;
        display: flex;
        flex-direction: column;
        gap: 12px;
        border: 1px solid rgba(255, 150, 0, 0.3);
    }
    
    .unverified-header {
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 600;
        font-size: 0.95rem;
    }

    .unverified-msg p {
        font-size: 0.85rem;
        margin: 0;
        opacity: 0.9;
        line-height: 1.4;
    }

    .resend-btn {
        background: rgba(255, 255, 255, 0.2);
        border: none;
        padding: 8px 15px;
        border-radius: 20px;
        color: white;
        font-weight: 600;
        font-size: 0.8rem;
        cursor: pointer;
        transition: all 0.2s ease;
        align-self: flex-start;
    }

    .resend-btn:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.3);
    }
    
    .resend-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
  `]
})
export class Login {
    email = '';
    password = '';
    rememberMe = false;
    loading = false;
    error = '';
    showResend = false;
    resending = false;

    emailFocused = false;
    passwordFocused = false;
    showPassword = false;

    constructor(private authService: AuthService) { }

    clearError() {
        this.error = '';
        this.showResend = false;
    }

    async onSubmit() {
        this.loading = true;
        this.error = '';
        this.showResend = false;

        try {
            await this.authService.login(this.email, this.password);
        } catch (err: any) {
            if (err.message === 'UNVERIFIED_EMAIL') {
                this.error = ''; // Clear main error so only the specific box shows
                this.showResend = true;
            } else {
                this.error = getFriendlyErrorMessage(err);
            }
        } finally {
            this.loading = false;
        }
    }

    async onResendVerification() {
        this.resending = true;
        try {
            // Use the email/password variant because we are strictly logged out here
            await this.authService.resendVerificationByEmail(this.email, this.password);
            alert('Verification email sent! Please check your inbox.');
            this.showResend = false;
        } catch (err: any) {
            this.error = getFriendlyErrorMessage(err);
            this.showResend = false; // Fall back to standard error box if it fails
        } finally {
            this.resending = false;
        }
    }
}
