import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common'; 
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../services/language.service';
import * as english from '../../../utils/english.json'
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-request-admin',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './request-admin.component.html',
  styleUrl: './request-admin.component.sass'
})
export class RequestAdminComponent {
  code: string = '';

  constructor(
    private auth: AuthService, 
    private location: Location, 
    private languageService: LanguageService,
    private router: Router) {}

  userLanguage = english; // Default is english before loading correct language

  ngOnInit(): void {
    this.languageService.getLanguage().then(lang => {
      this.userLanguage = lang;
    });
  }

  emptyFieldError: boolean = false;

  async onSubmit() {
    if (await this.auth.requestAdmin(this.code)) {
      alert("You are now an admin.");
      this.router.navigateByUrl("/");
    } else {
      alert("This code is not valid.");
    }
  }

  onCancel() {
    this.location.back(); // Navigate to the previous page
  }
}
