import { Routes } from '@angular/router';
import { redirectUnauthorizedTo, redirectLoggedInTo, canActivate } from '@angular/fire/compat/auth-guard';

// Components
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { RecoverComponent } from './components/recover/recover.component';
import { PreferencesComponent } from './components/preferences/preferences.component';
import { UpdateNameComponent } from './components/update-info/update-name/update-name.component';
import { ChangePasswordComponent } from './components/update-info/change-password/change-password.component';

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
    }
];
