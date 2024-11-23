import { Routes } from '@angular/router';
import { redirectUnauthorizedTo, redirectLoggedInTo, canActivate } from '@angular/fire/compat/auth-guard';

// Components
<<<<<<< HEAD
import { LandingComponent } from './components/landing/landing.component';
import { DashboardComponent } from './components/landing/dashboard/dashboard.component';
import { combineChange } from '@angular/fire/compat/firestore';
import { DashboardAlphaComponent } from './components/dashboard-alpha/dashboard-alpha.component';
import { PTHComponent } from './components/pth/pth.component';
import { PTEComponent } from './components/pte/pte.component';
import { PTUEComponent } from './components/ptue/ptue.component';
import { PTDComponent } from './components/ptd/ptd.component';
import { VHComponent } from './components/vh/vh.component';
=======
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { RecoverComponent } from './components/recover/recover.component';
import { UpdateNameComponent } from './components/update-info/update-name/update-name.component';
import { ChangePasswordComponent } from './components/update-info/change-password/change-password.component';
import { GamesComponent } from './components/games/games.component';
>>>>>>> 61988c95cc5be91cee6189a5fb85d6913a6b5b1e

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToDashboard = () => redirectLoggedInTo(['']);

export const routes: Routes = [
    { 
        path: '', 
        component: DashboardComponent
    },
    { 
        path: 'login', 
        component: LoginComponent, 
        ...canActivate(redirectLoggedInToDashboard)

    },
<<<<<<< HEAD

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

=======
    {
        path: 'register',
        component: RegisterComponent,
        ...canActivate(redirectLoggedInToDashboard)
    },
    {
        path: 'recover',
        component: RecoverComponent,
        ...canActivate(redirectLoggedInToDashboard)
    },
    { 
        path: 'update-name', 
        component: UpdateNameComponent, 
        ...canActivate(redirectUnauthorizedToLogin)
    },
    {
        path: 'change-password', 
        component: ChangePasswordComponent, 
        ...canActivate(redirectUnauthorizedToLogin)
    },
    {
        path: 'games', 
        component: GamesComponent, 
        ...canActivate(redirectUnauthorizedToLogin)
    }
>>>>>>> 61988c95cc5be91cee6189a5fb85d6913a6b5b1e
];
