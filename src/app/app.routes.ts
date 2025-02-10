import { Routes } from '@angular/router';
import { redirectUnauthorizedTo, redirectLoggedInTo, canActivate } from '@angular/fire/compat/auth-guard';

// Components
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
import { StoriesComponent } from './components/stories/stories.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { Game1Component } from './components/games/game1/game1.component';
import { EducationalArticlesComponent } from './components/educational-articles/educational-articles.component';
import { RequestAdminComponent } from './components/update-info/request-admin/request-admin.component';
import { AddStoryComponent } from './components/stories/add-story/add-story.component';
import { ReadStoryComponent } from './components/stories/read-story/read-story.component';

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
        path: 'request-admin', 
        component: RequestAdminComponent, 
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
        path: 'matching', 
        component: Game1Component, 
        ...canActivate(redirectUnauthorizedToLogin)
    },

    {
        path: 'progress',
        component: PTHComponent,
        ...canActivate(redirectUnauthorizedToLogin)
    },

    {
        path: 'progress/earned',
        component: PTEComponent,
        ...canActivate(redirectUnauthorizedToLogin)
    },

    {
        path: 'progress/unearned',
        component: PTUEComponent,
        ...canActivate(redirectUnauthorizedToLogin)
    },

    {
        path: 'progress/data',
        component: PTDComponent,
        ...canActivate(redirectUnauthorizedToLogin)
    },

    {
        path: 'videos',
        component: VHComponent
    },

    {
        path: 'stories',
        component: StoriesComponent,
        ...canActivate(redirectUnauthorizedToLogin)
    },

    {
        path: 'stories/add',
        component: AddStoryComponent,
        ...canActivate(redirectUnauthorizedToLogin)
    },

    {
        path: 'stories/:title',
        component: ReadStoryComponent
    },

    {
        path: 'articles',
        component: EducationalArticlesComponent
    },

    {
        path: '**', // 404 Page
        component: PageNotFoundComponent
    }
];
