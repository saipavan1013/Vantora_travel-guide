import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthNavbar } from './auth-navbar';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AuthNavbar],
  template: `
    <div class="auth-layout">
      <main class="auth-viewport">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .auth-layout {
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: url('../../../assets/images/nature-background.jpg') center/cover no-repeat;
      background-size: 150% 150%;
      animation: gradientBG 15s ease infinite alternate;
      position: relative;
      margin: 0;
      padding: 0;
      overflow: hidden;
    }

    @keyframes gradientBG {
      0% { background-position: 0% 50%; }
      100% { background-position: 100% 50%; }
    }

    .auth-viewport {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10;
    }

    .minimal-footer {
      position: fixed;
      bottom: 20px;
      width: 100%;
      text-align: center;
      color: rgba(255, 255, 255, 0.4);
      font-size: 0.85rem;
      z-index: 10;
    }

    .minimal-footer span {
      font-weight: 700;
      color: rgba(255, 255, 255, 0.7);
    }
  `]
})
export class AuthLayout {}
