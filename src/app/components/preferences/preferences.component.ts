import { Component, OnInit, OnDestroy, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import { User } from '@angular/fire/auth';
import { Subscription } from 'rxjs';
import { LanguageService } from '../../services/language.service';
import * as english from '../../utils/english.json';

// Define types for theme and language
type Theme = 'light' | 'dark' | 'default';
type Language = 'english' | 'spanish' | 'default';

@Component({
  selector: 'app-preferences',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.sass']
})
export class PreferencesComponent implements OnInit, OnDestroy {
  isSidebarOpen = false;
  dropdowns = {
    profile: false,
    language: false,
  };

  username: string | null = null;
  isSignedIn: boolean = false;
  theme: Theme = 'default';
  language: Language = 'default';
  private userId: string | null = null;
  private userSubscription: Subscription | undefined;

  themeLabels: Record<Theme, string> = {
    light: 'Light Mode',
    dark: 'Dark Mode',
    default: 'Device Default'
  };

  languageLabels: Record<Language, string> = {
    english: 'English',
    spanish: 'Spanish',
    default: 'Device Default'
  };

  languageService = inject(LanguageService);
  userLanguage = english;

  constructor(
    private router: Router,
    private authService: AuthService,
    private databaseService: DatabaseService
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.getUser$().subscribe(async (user: User | null) => {
      if (user) {
        this.userId = this.authService.getEmail()!;
        this.username = user.displayName || 'User';
        this.isSignedIn = true;

        const preferences = await this.databaseService.fetchDocumentById('users', this.userId);

        if (!preferences) {
          await this.databaseService.addDocWithCustomId('users', {
            theme: 'default',
            language: 'default'
          }, this.userId);
          console.log('User preferences document created with default values');
        } else {
          this.theme = preferences.theme || 'default';
          this.language = preferences.language || 'default';
        }
      } else {
        this.isSignedIn = false;
        this.username = null;
      }
    });

    this.authService.firebaseAuth.onAuthStateChanged((user) => {
      if (user) {
        this.languageService.getLanguage().then(lang => {
          const validLanguages: Language[] = ['english', 'spanish', 'default'];
          const possibleLang = typeof lang === 'object' && 'default' in lang ? lang.default : lang;

          if (validLanguages.includes(possibleLang as Language)) {
            this.language = possibleLang as Language;
          } else {
            console.warn('Invalid language value:', lang);
            this.language = 'default';
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  async setTheme(theme: Theme) {
    if (this.userId) {
      try {
        await this.databaseService.updateUserPreference(this.userId, 'theme', theme);
        this.theme = theme;
        console.log('Theme updated to:', theme);
        window.location.reload();
      } catch (error) {
        console.error('Error updating theme:', error);
      }
    }
  }

  async setLanguage(language: Language) {
    try {
      if (this.userId) {
        await this.databaseService.updateUserPreference(this.userId, 'language', language);
        console.log('Language updated in database:', language);
      }

      localStorage.setItem('preferredLanguage', language);
      this.language = language;

      console.log('Language updated to:', language);
      window.location.reload();
    } catch (error) {
      console.error('Error updating language:', error);
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.preferences-wrapper')) {
      this.dropdowns.profile = false;
      this.dropdowns.language = false;
    }
  }

  toggleDropdown(dropdown: 'profile' | 'language') {
    if (dropdown === 'profile') {
      this.dropdowns.profile = !this.dropdowns.profile;
      this.dropdowns.language = false;
    } else {
      this.dropdowns.language = !this.dropdowns.language;
    }
    event?.stopPropagation();
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
    this.toggleSidebar();
  }

  accountStatus() {
    if (this.isSignedIn) {
      this.authService.logout().subscribe(() => {
        console.log('User signed out');
        this.router.navigate(['/login']);
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  getThemeLabel(): string {
    return this.themeLabels[this.theme] || 'Unknown';
  }

  getLanguageLabel(): string {
    return this.languageLabels[this.language] || 'Unknown';
  }
}