import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { PreferencesComponent } from '../preferences/preferences.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [PreferencesComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.sass'
})
export class NavbarComponent {
  auth = inject(AuthService);
  router = inject(Router);

  currentPage = this.router.url;
}
