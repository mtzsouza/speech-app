import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StoryService } from '../../../services/story.service';
import { SpeechService } from '../../../services/speech.service';
import { LanguageService } from '../../../services/language.service';
import { DatabaseService } from '../../../services/database.service';
import * as english from '../../../utils/english.json'
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../navbar/navbar.component';

@Component({
  selector: 'app-read-story',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent
  ],
  templateUrl: './read-story.component.html',
  styleUrl: './read-story.component.sass'
})

export class ReadStoryComponent implements OnInit {
  router = inject(Router);
  storyService = inject(StoryService);
  speechService = inject(SpeechService);
  languageService = inject(LanguageService);
  databaseService = inject(DatabaseService);

  isAdmin = false
  userLanguage = english;
  generatedAudio = false;
  isReading = false;
  finishedReading = false;
  isGenerating = false;

  story_id = "";
  title_english = "";
  title_spanish = "";
  text_english = "";
  text_spanish = "";
  audio_id = "";

  async ngOnInit(): Promise<void> {
    this.userLanguage = await this.languageService.getLanguage();
    this.isAdmin = await this.languageService.auth.isAdmin();
    this.loadStory();
  }

  isEnglish() {
    return JSON.stringify(this.userLanguage) === JSON.stringify(english);
  }

  async loadStory() {
    this.title_english = this.router.url.split("/")[2].replaceAll("_", " ");
    const buffer = await this.storyService.fetchStoryByEnglishTitle(this.title_english);
    
    this.story_id = await this.databaseService.getDocumentIdByField("stories", "title_english", this.title_english) ?? "";
    this.title_spanish = buffer.title_spanish;
    this.text_english = buffer.text_english;
    this.text_spanish = buffer.text_spanish;
    this.audio_id = buffer.audio_id;
  }

  speak() {
    this.isReading = true;
    this.generatedAudio = true;

    const text = this.isEnglish() ? this.text_english : this.text_spanish;
    const lang = this.isEnglish() ? 'english' : 'spanish';

    this.speechService.start(lang, this.audio_id);
    this.speechService.onAudioEnd(() => {
      this.isReading = false;
      this.finishedReading = true;
    });
  }

  pauseOrResume() {
    const lang = this.isEnglish() ? 'english' : 'spanish';

    if (this.isReading) {
      this.speechService.pause();
      this.isReading = false;
    } else {
      if (this.finishedReading) {
        this.speechService.start(lang, this.audio_id);
        this.finishedReading = false;
      } else {
        this.speechService.resume();
      }
      this.isReading = true;
    }
  
    this.speechService.onAudioEnd(() => {
      this.isReading = false;
      this.finishedReading = true;
    });
  }

  restart() {
    const lang = this.isEnglish() ? 'english' : 'spanish';
    this.speechService.restart(lang, this.audio_id);
    this.isReading = true;

    this.speechService.onAudioEnd(() => {
      this.isReading = false;
    })
  }

  async fixAudio() {  
    if (this.audio_id) {
      alert("This story already has a generated audio.");
    } else {
      const audio_id = this.title_english
        .replace(/\s+/g, '_')
        .toLowerCase()
        .slice(0, 10);

      this.isGenerating = true;

      try {
        await Promise.all([
          // Store audio ids
          this.databaseService.updateField("stories", this.story_id!, "audio_id", audio_id),

          // Generate audios
          this.speechService.generateAudio(this.text_english, "english", audio_id),
          this.speechService.generateAudio(this.text_spanish, "spanish", audio_id),
        ]);
  
        alert("Audio generated successfully.");
        this.router.navigateByUrl("/stories");
      } catch (error) {
        console.error("Error generating audio or saving story:", error);
      } finally {
        this.isGenerating = false;
      }
    }
  }

  goBack(): void {
    this.router.navigate(['/stories']);
  }
}