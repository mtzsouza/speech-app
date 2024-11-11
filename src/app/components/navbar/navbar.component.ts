import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { PreferencesComponent } from '../preferences/preferences.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [PreferencesComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.sass'
})
export class NavbarComponent {
  auth = inject(AuthService);
}
