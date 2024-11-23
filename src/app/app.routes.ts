import { Routes } from '@angular/router';
import { redirectUnauthorizedTo, redirectLoggedInTo, canActivate } from '@angular/fire/compat/auth-guard';

// Components
import { LandingComponent } from './components/landing/landing.component';
import { DashboardComponent } from './components/landing/dashboard/dashboard.component';
import { combineChange } from '@angular/fire/compat/firestore';
import { DashboardAlphaComponent } from './components/dashboard-alpha/dashboard-alpha.component';
import { PTHComponent } from './components/pth/pth.component';
import { PTEComponent } from './components/pte/pte.component';
import { PTUEComponent } from './components/ptue/ptue.component';
import { PTDComponent } from './components/ptd/ptd.component';
import { VHComponent } from './components/vh/vh.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToDashboard = () => redirectLoggedInTo(['']);

export const routes: Routes = [
    { 
        path: '', 
        component: DashboardComponent, 
        ...canActivate(redirectUnauthorizedToLogin)
    },

    { 
        path: 'login', 
        component: LandingComponent, 
        ...canActivate(redirectLoggedInToDashboard)

    },

    {
        path: 'dashboardAlpha',
        component: DashboardAlphaComponent
    },

    {
        path: 'progressTrackingHome',
        component: PTHComponent
    },

    {
        path: 'progressTrackingEarned',
        component: PTEComponent
    },

    {
        path: 'progressTrackingUnearned',
        component: PTUEComponent
    },

    {
        path: 'progressTrackingData',
        component: PTDComponent
    },

    {
        path: 'videosHome',
        component: VHComponent
    },

];
