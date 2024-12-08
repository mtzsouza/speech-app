import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
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
  languageService = inject(LanguageService)
  language = english; // Default is english, to show up before language loads

  ngOnInit() {
    this.languageService.getLanguage().then(lang => {
      this.language = lang;
    });
  }
}
