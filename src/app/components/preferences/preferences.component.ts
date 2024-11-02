import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '@angular/fire/auth';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-preferences',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.sass']
})
export class PreferencesComponent implements OnInit {
  isSidebarOpen = false;
  dropdowns = {
    theme: false,
    language: false,
  };

  username: string | null = null;  // Property to store the username
  private userSubscription: Subscription | undefined;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    // Subscribe to the user observable to fetch the username reactively
    this.userSubscription = this.authService.getUser$().subscribe((user: User | null) => {
      this.username = user?.displayName || 'User';  // Fallback to 'User' if displayName is not set
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe to avoid memory leaks
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleDropdown(dropdown: 'theme' | 'language') {
    this.dropdowns[dropdown] = !this.dropdowns[dropdown];
  }

  setTheme(theme: string) {
    console.log('Theme set to:', theme);
  }

  setLanguage(language: string) {
    console.log('Language set to:', language);
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
    this.toggleSidebar();
  }
}
