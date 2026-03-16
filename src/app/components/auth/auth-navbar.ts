import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-auth-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatIconModule],
  template: `
    <nav class="premium-nav">
      <div class="nav-pill">
        <div class="logo-area" routerLink="/">
          <div class="logo-disc">
            <mat-icon>flight_takeoff</mat-icon>
          </div>
          <span class="brand-text">Travel<span>Guide</span></span>
        </div>

        <div class="nav-links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
          <a routerLink="/destinations" routerLinkActive="active">Explore</a>
          <a routerLink="/planner" routerLinkActive="active">Planner</a>
        </div>

        <div class="auth-buttons">
          <button class="glass-btn btn-login" routerLink="/login" routerLinkActive="active-btn">Login</button>
          <button class="accent-btn btn-signup" routerLink="/signup" routerLinkActive="active-btn">Join Now</button>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .premium-nav {
      position: fixed;
      top: 24px;
      left: 0;
      width: 100%;
      height: 70px;
      z-index: 1200;
      display: flex;
      justify-content: center;
      padding: 0 20px;
    }

    .nav-pill {
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(25px) saturate(180%);
      -webkit-backdrop-filter: blur(25px) saturate(180%);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 100px;
      padding: 0 12px 0 24px;
      height: 100%;
      width: 100%;
      max-width: 1100px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25),
                  inset 0 0 0 1px rgba(255, 255, 255, 0.1);
    }

    .logo-area {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
    }

    .logo-disc {
      width: 38px;
      height: 38px;
      background: linear-gradient(135deg, #3a86ff, #ff006e);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1rem;
      box-shadow: 0 4px 15px rgba(58, 134, 255, 0.4);
    }

    .brand-text {
      color: white;
      font-size: 1.4rem;
      font-weight: 800;
      letter-spacing: -1px;
    }

    .brand-text span {
      font-weight: 300;
      opacity: 0.7;
    }

    .nav-links {
      display: flex;
      gap: 32px;
    }

    .nav-links a {
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      font-size: 0.95rem;
      font-weight: 600;
      transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
      padding: 8px 12px;
      border-radius: 12px;
    }

    .nav-links a:hover {
      color: white;
      background: rgba(255, 255, 255, 0.1);
    }

    .nav-links a.active {
      color: white;
      background: rgba(255, 255, 255, 0.15);
    }

    .auth-buttons {
      display: flex;
      gap: 10px;
    }

    .glass-btn, .accent-btn {
      padding: 10px 24px;
      border-radius: 50px;
      font-size: 0.9rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
      border: none;
    }

    .btn-login {
      background: rgba(255, 255, 255, 0.05);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .btn-login:hover {
      background: rgba(255, 255, 255, 0.15);
      border-color: white;
    }

    .btn-signup {
      background: white;
      color: #1a1a1a;
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
    }

    .btn-signup:hover {
      background: #3a86ff;
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 15px 25px rgba(58, 134, 255, 0.4);
    }

    @media (max-width: 768px) {
      .nav-links { display: none; }
      .brand-text span { display: none; }
    }
  `]
})
export class AuthNavbar {}
