import { Component, inject } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { LanguageService } from '../../services/language.service';
import * as english from '../../utils/english.json'

@Component({
  selector: 'app-games',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './games.component.html',
  styleUrl: './games.component.sass'
})
export class GamesComponent {
  languageService = inject(LanguageService);
  
  userLanguage = english;

  async ngOnInit(): Promise<void> {
    this.userLanguage = await this.languageService.getLanguage();
  }

}
