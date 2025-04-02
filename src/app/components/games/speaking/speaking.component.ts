import { Component, inject } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { LanguageService } from '../../../services/language.service';
import * as english from '../../../utils/english.json'

@Component({
  selector: 'app-speaking',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './speaking.component.html',
  styleUrl: './speaking.component.sass'
})
export class SpeakingComponent {
  languageService = inject(LanguageService);
  
  userLanguage = english;

  async ngOnInit(): Promise<void> {
    this.userLanguage = await this.languageService.getLanguage();
  }
}
