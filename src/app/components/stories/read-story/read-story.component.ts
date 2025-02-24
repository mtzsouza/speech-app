import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StoryService } from '../../../services/story.service';
import { SpeechService } from '../../../services/speech.service';
import { LanguageService } from '../../../services/language.service';
import * as english from '../../../utils/english.json'

@Component({
  selector: 'app-read-story',
  standalone: true,
  imports: [],
  templateUrl: './read-story.component.html',
  styleUrl: './read-story.component.sass'
})

export class ReadStoryComponent {
  router = inject(Router);
  storyService = inject(StoryService);
  speech = inject(SpeechService);
  languageService = inject(LanguageService);

  userLanguage = english;

  title_english = "";
  title_spanish = "";
  text_english = "";
  text_spanish = "";

  async ngOnInit(): Promise<void> {
    this.userLanguage = await this.languageService.getLanguage();
    this.loadStory();
  }

  isEnglish() {
    return JSON.stringify(this.userLanguage) === JSON.stringify(english);
  }

  async loadStory() {
    this.title_english = this.router.url.split("/")[2].replaceAll("_", " ");
    const buffer = await this.storyService.fetchStoryByEnglishTitle(this.title_english);
    
    this.title_spanish = buffer.title_spanish;
    this.text_english = buffer.text_english;
    this.text_spanish = buffer.text_spanish;
  }

  speak() {
    if (this.isEnglish()) {
      this.speech.speak(this.text_english, "Google US English");
    } else {
      this.speech.speak(this.text_spanish, "Google español de Estados Unidos");
    }
  }

  stop() {
    this.speech.stop()
  }
}
