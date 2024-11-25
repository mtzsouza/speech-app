import { Routes } from '@angular/router';
import { redirectUnauthorizedTo, redirectLoggedInTo, canActivate } from '@angular/fire/compat/auth-guard';

// Components
import { DashboardAlphaComponent } from './components/dashboard-alpha/dashboard-alpha.component';
import { PTHComponent } from './components/pth/pth.component';
import { PTEComponent } from './components/pte/pte.component';
import { PTUEComponent } from './components/ptue/ptue.component';
import { PTDComponent } from './components/ptd/ptd.component';
import { VHComponent } from './components/vh/vh.component';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { RecoverComponent } from './components/recover/recover.component';
import { SoundboardComponent } from './components/features/soundboard/soundboard.component';
import { UpdateNameComponent } from './components/update-info/update-name/update-name.component';
import { ChangePasswordComponent } from './components/update-info/change-password/change-password.component';
import { GamesComponent } from './components/games/games.component';

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
        path: 'soundboard', 
        component: SoundboardComponent
    },
    {
        path: 'games', 
        component: GamesComponent, 
        ...canActivate(redirectUnauthorizedToLogin)
    },

    {
        path: 'dashboardAlpha',
        component: DashboardAlphaComponent
    },

    {
        path: 'progress',
        component: PTHComponent
    },

    {
        path: 'progress/earned',
        component: PTEComponent
    },

    {
        path: 'progress/unearned',
        component: PTUEComponent
    },

    {
        path: 'progress/data',
        component: PTDComponent
    },

    {
        path: 'videos',
        component: VHComponent
    }
];
