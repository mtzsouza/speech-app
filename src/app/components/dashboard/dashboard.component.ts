import { Component, inject, OnInit, Renderer2 } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { AuthService } from '../../services/auth.service';
import { LanguageService } from '../../services/language.service';
import * as english from '../../utils/english.json'

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, NavbarComponent],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  auth = inject(AuthService);
  languageService = inject(LanguageService);
  renderer = inject(Renderer2);
  language = english; // Default is english, to show up before language loads
  isDarkMode = false;

  ngOnInit() {
    this.auth.firebaseAuth.onAuthStateChanged((user) => {
      if (user) {
        this.languageService.getLanguage().then(lang => {
          this.language = lang;
        });
      }
    });

    // Check for saved theme preference
    this.checkThemePreference();

    // Set up theme toggle event listener
    setTimeout(() => {
      const themeToggleBtn = document.getElementById('theme-toggle');
      if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => this.toggleTheme());
      }
    }, 0);
  }

  checkThemePreference() {
    // Check if user has a saved preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Apply theme based on saved preference or system preference
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      this.isDarkMode = true;
      this.renderer.addClass(document.documentElement, 'dark');
    } else {
      this.isDarkMode = false;
      this.renderer.removeClass(document.documentElement, 'dark');
    }
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    
    if (this.isDarkMode) {
      this.renderer.addClass(document.documentElement, 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      this.renderer.removeClass(document.documentElement, 'dark');
      localStorage.setItem('theme', 'light');
    }
  }
}
