import { Component, inject } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { LanguageService } from '../../../services/language.service';
import * as english from '../../../utils/english.json'

@Component({
  selector: 'app-listening',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './listening.component.html',
  styleUrl: './listening.component.sass'
})
export class ListeningComponent {
  languageService = inject(LanguageService);
  
  userLanguage = english;

  async ngOnInit(): Promise<void> {
    this.userLanguage = await this.languageService.getLanguage();
  }
}
