import { Component, inject, Renderer2 } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { PreferencesComponent } from '../preferences/preferences.component';
import { Router } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import * as english from '../../utils/english.json';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, PreferencesComponent],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  auth = inject(AuthService);
  router = inject(Router);
  languageService = inject(LanguageService);
  private renderer = inject(Renderer2);

  userLanguage = english;
  isDarkMode = false;
  currentPage = this.router.url;

  async ngOnInit(): Promise<void> {
    this.userLanguage = await this.languageService.getLanguage();
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme === 'dark';
    
    // Apply theme on init
    if (this.isDarkMode) {
      this.renderer.addClass(document.body, 'dark-theme');
    } else {
      this.renderer.removeClass(document.body, 'dark-theme');
    }
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    
    if (this.isDarkMode) {
      this.renderer.addClass(document.body, 'dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      this.renderer.removeClass(document.body, 'dark-theme');
      localStorage.setItem('theme', 'light');
    }
  }
}
