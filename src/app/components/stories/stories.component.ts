import { Component, inject, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { AuthService } from '../../services/auth.service';
import { LanguageService } from '../../services/language.service';
import { StoryService } from '../../services/story.service';
import { StoryInterface } from '../../utils/story.interface';
import * as english from '../../utils/english.json';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Add this import

@Component({
  selector: 'app-stories',
  standalone: true,
  imports: [NavbarComponent, CommonModule, RouterModule], // Add this to imports array
  templateUrl: './stories.component.html',
  styleUrls: ['./stories.component.sass']
})
export class StoriesComponent implements OnInit {
  languageService = inject(LanguageService);
  auth = inject(AuthService);
  storyService = inject(StoryService);

  isAdmin = false;
  userLanguage = english;
  stories: any;

  async ngOnInit(): Promise<void> {
    this.userLanguage = await this.languageService.getLanguage();
    this.stories = await this.storyService.fetchStories();
    this.isAdmin = await this.auth.isAdmin();
  }

  encodeTitle(title: string) {
    return title.replaceAll(" ", "_");
  }

  isEnglish() {
    return JSON.stringify(this.userLanguage) === JSON.stringify(english);
  }
}
