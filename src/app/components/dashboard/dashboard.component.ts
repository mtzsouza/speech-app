import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { AuthService } from '../../services/auth.service';
import { LanguageService } from '../../services/language.service';
import * as english from '../../utils/english.json'

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {
  auth = inject(AuthService);
  languageService = inject(LanguageService)
  language = english; // Default is english, to show up before language loads

  ngOnInit() {
    this.auth.firebaseAuth.onAuthStateChanged((user) => {
      if (user) {
        this.languageService.getLanguage().then(lang => {
          this.language = lang;
        });
      }
    })
  }
}
