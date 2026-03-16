import { Routes } from '@angular/router';

import { Home } from './components/home/home';
import { Destination } from './components/destination/destination';
import { Destinations } from './components/destinations/destinations';
import { Attraction } from './components/attraction/attraction';
import { Planner } from './components/planner/planner';
import { Login } from './components/auth/login';
import { Signup } from './components/auth/signup';
import { authGuard } from './guards/auth.guard';
import { AuthLayout } from './components/auth/auth-layout';
import { NotFoundComponent } from './components/not-found/not-found.component';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'destinations', component: Destinations },
    { path: 'destination/:city', component: Destination },
    { path: 'destination/:city/attraction/:attractionName', component: Attraction },
    { path: 'planner', component: Planner, canActivate: [authGuard] },
    { path: 'my-trips', loadComponent: () => import('./components/my-trips/my-trips.component').then(m => m.MyTrips), canActivate: [authGuard] },
    { path: 'profile', loadComponent: () => import('./components/profile/profile').then(m => m.Profile), canActivate: [authGuard] },
    {
        path: '',
        component: AuthLayout,
        children: [
            { path: 'login', component: Login },
            { path: 'signup', component: Signup }
        ]
    },
    { path: '**', component: NotFoundComponent }
];
