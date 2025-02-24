import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { PreferencesComponent } from '../preferences/preferences.component';
import { Router } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import * as english from '../../utils/english.json'

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
  languageService = inject(LanguageService);

  userLanguage = english;

  async ngOnInit(): Promise<void> {
    this.userLanguage = await this.languageService.getLanguage();
  }

  currentPage = this.router.url;
}
