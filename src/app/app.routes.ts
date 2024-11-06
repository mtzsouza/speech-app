import { Routes } from '@angular/router';
import { redirectUnauthorizedTo, redirectLoggedInTo, canActivate } from '@angular/fire/compat/auth-guard';

// Components
import { LandingComponent } from './components/landing/landing.component';
import { DashboardComponent } from './components/landing/dashboard/dashboard.component';
import { RegisterComponent } from './components/landing/register/register.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToDashboard = () => redirectLoggedInTo(['']);

export const routes: Routes = [
    { 
        path: '', 
        component: DashboardComponent
    },
    { 
        path: 'login', 
        component: LandingComponent, 
        ...canActivate(redirectLoggedInToDashboard)
    },
    {
        path: 'register',
        component: RegisterComponent,
        ...canActivate(redirectLoggedInToDashboard)
    }
];
