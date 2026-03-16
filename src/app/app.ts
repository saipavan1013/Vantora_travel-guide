import { Component, signal, computed } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('travel-guide');
  showNavbar = true;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: any) => {
      // Hide navbar on 404 (wildcard matches anything not defined)
      const knownRoutes = ['/', '/destinations', '/planner', '/my-trips', '/profile', '/login', '/signup'];
      const url: string = e.urlAfterRedirects;
      const isKnown =
        knownRoutes.includes(url) ||
        url.startsWith('/destination/') ||
        url.startsWith('/login') ||
        url.startsWith('/signup');
      this.showNavbar = isKnown;
    });
  }
}
