import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';  // Adjust the path as necessary
import { FormsModule } from '@angular/forms';  // Ensure FormsModule is imported
import { Location } from '@angular/common';    // Import Location for navigating back
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../services/language.service';
import * as english from '../../../utils/english.json'

@Component({
  selector: 'app-update-name',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './update-name.component.html',
  styleUrls: ['./update-name.component.sass']
})
export class UpdateNameComponent implements OnInit {
  currentUsername: string | null | undefined = ''; // Store current username
  newUsername: string = ''; // New username input

  constructor(private authService: AuthService, private location: Location) {}  // Inject Location

  languageService = inject(LanguageService)
  userLanguage = english; // Default is english, to show up before language loads

  ngOnInit(): void {
    // Fetch the current username when the component is initialized
    this.currentUsername = this.authService.getUsername();

    this.languageService.getLanguage().then(lang => {
      this.userLanguage = lang;
    });
  }

  emptyFieldError: boolean = false;

  onSubmit() {
    this.emptyFieldError = false;

    if (!this.newUsername.trim()) {
      this.emptyFieldError = true;
      return;
    }

    if (this.newUsername.trim()) {
      this.authService.updateUsername(this.newUsername.trim()).subscribe(
        () => {
          console.log('Username updated successfully');
          this.currentUsername = this.newUsername;
          this.newUsername = ''; // Clear the input field

          // Navigate back to the previous page after updating the username
          this.location.back();
        },
        error => console.error('Error updating username:', error)
      );
    }
  }

  onCancel() {
    this.location.back(); // Navigate to the previous page
  }
}
