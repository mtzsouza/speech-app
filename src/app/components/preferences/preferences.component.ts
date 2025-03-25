import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import { User } from '@angular/fire/auth';
import { Subscription } from 'rxjs';
import { LanguageService } from '../../services/language.service';
import * as english from '../../utils/english.json'


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
  theme: Theme = 'default';
  language: Language = 'default';
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

  languageService = inject(LanguageService)
  userLanguage = english; // Default is english, to show up before language loads

  constructor(
    private router: Router,
    private authService: AuthService,
    private databaseService: DatabaseService
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.getUser$().subscribe(async (user: User | null) => {
      if (user) {
        this.userId = this.authService.getEmail()!;
        this.username = user.displayName || 'User'; // Set the username directly here
        this.isSignedIn = true;

        // Fetch user preferences from Firestore
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
      } else {
        // Handle user not signed in
        this.isSignedIn = false;
        this.username = null;
      }
    });

    this.authService.firebaseAuth.onAuthStateChanged((user) => {
      if (user) {
        this.languageService.getLanguage().then(lang => {
          this.language = lang;
        });
      }
    })
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
        // Update the language in the database if the user is signed in
        await this.databaseService.updateUserPreference(this.userId, 'language', language);
        console.log('Language updated in database:', language);
      }
  
      // Always update the language in local storage
      localStorage.setItem('preferredLanguage', language);
      this.language = language;
  
      console.log('Language updated to:', language);
      window.location.reload(); // Refresh the page to apply the changes
    } catch (error) {
      console.error('Error updating language:', error);
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
