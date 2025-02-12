import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../services/language.service';
import * as english from '../../../utils/english.json'

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.sass']
})
export class ChangePasswordComponent {
  currentPassword: string = '';
  newPassword: string = '';
  confirmNewPassword: string = '';
  
  passwordMismatch: boolean = false;
  emptyFieldsError: boolean = false;
  reauthenticationError: boolean = false;
  updatePasswordError: boolean = false;

  constructor(private authService: AuthService, private location: Location) {}

  languageService = inject(LanguageService)
  userLanguage = english; // Default is english, to show up before language loads

  ngOnInit(): void {
    this.languageService.getLanguage().then(lang => {
      this.userLanguage = lang;
    });
  }

  onSubmit() {
    // Reset error flags
    this.passwordMismatch = false;
    this.emptyFieldsError = false;
    this.reauthenticationError = false;
    this.updatePasswordError = false;

    // Check if any field is empty
    if (!this.currentPassword.trim() || !this.newPassword.trim() || !this.confirmNewPassword.trim()) {
      this.emptyFieldsError = true;
      return;
    }

    // Check if new password and confirm new password match
    if (this.newPassword !== this.confirmNewPassword) {
      this.passwordMismatch = true;
      return;
    }

    // Reauthenticate with the current password
    this.authService.reauthenticate(this.currentPassword).subscribe(
      () => {
        // Update the password if re-authentication is successful
        this.authService.updatePassword(this.newPassword).subscribe(
          () => {
            console.log('Password updated successfully');
            this.location.back(); // Navigate back after success
          },
          error => {
            console.error('Error updating password:', error);
            this.updatePasswordError = true;
          }
        );
      },
      error => {
        console.error('Error with re-authentication:', error);
        this.reauthenticationError = true;
      }
    );
  }

  onCancel() {
    this.location.back(); // Navigate back to the previous page
  }
}
