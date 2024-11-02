import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import { User } from '@angular/fire/auth';
import { Subscription } from 'rxjs';

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
    theme: false,
    language: false,
  };

  username: string | null = null;
  isSignedIn: boolean = false;
  theme: Theme = 'default';       // Use the Theme type here
  language: Language = 'default'; // Use the Language type here
  private userId: string | null = null;
  private userSubscription: Subscription | undefined;

  // Mappings for display labels with explicit types
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

  constructor(
    private router: Router,
    private authService: AuthService,
    private databaseService: DatabaseService
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.getUser$().subscribe(async (user: User | null) => {
      if (user) {
        this.userId = user.uid;

        // Check if the user document exists
        const preferences = await this.databaseService.fetchDocumentById('users', this.userId);

        if (!preferences) {
          // If the document doesn't exist, create it with default settings
          await this.databaseService.addDocWithCustomId('users', {
            theme: 'default',
            language: 'default'
          }, this.userId);
          console.log('User preferences document created with default values');
        } else {
          // If it exists, load the current preferences
          this.theme = preferences.theme || 'default';
          this.language = preferences.language || 'default';
        }
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
      } catch (error) {
        console.error('Error updating theme:', error);
      }
    }
  }

  async setLanguage(language: Language) {
    if (this.userId) {
      try {
        await this.databaseService.updateUserPreference(this.userId, 'language', language);
        this.language = language;
        console.log('Language updated to:', language);
      } catch (error) {
        console.error('Error updating language:', error);
      }
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleDropdown(dropdown: 'theme' | 'language') {
    this.dropdowns[dropdown] = !this.dropdowns[dropdown];
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

  // Method to get the user-friendly theme label
  getThemeLabel(): string {
    return this.themeLabels[this.theme];
  }

  // Method to get the user-friendly language label
  getLanguageLabel(): string {
    return this.languageLabels[this.language];
  }
}
