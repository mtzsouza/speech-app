import { Component, inject, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NavbarComponent } from '../../navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SpeechService, SpeechRecognitionResult } from '../../../services/speech.service';

const STORAGE_KEY = 'speechWalkCompleted';

@Component({
  selector: 'app-speech-walk',
  standalone: true,
  imports: [NavbarComponent, RouterModule, CommonModule, HttpClientModule],
  templateUrl: './speech-walk.component.html',
  styleUrl: './speech-walk.component.sass',
})
export class SpeechWalkComponent implements OnInit {
  private speechService = inject(SpeechService);
  private sanitizer = inject(DomSanitizer);
  private http = inject(HttpClient);

  currentText: SafeHtml = '';
  isListening = false;
  isCheckpoint = false;
  currentIndex = 0;
  lives = 3;
  currentProgress = 0;
  characterState: 'standing' | 'running' = 'standing';
  feedbackClass = '';
  showInstructions = true;
  isVictory = false;

  completedStories: string[] = [];
  storyList: any[] = [];
  selectedStory: any = null;
  story: string[] = [];

  ngOnInit(): void {
    this.http.get<any[]>('assets/stories.json').subscribe(data => {
      this.storyList = data;
      this.loadProgress();
    });
  }

  loadProgress(): void {
    const stored = localStorage.getItem(STORAGE_KEY);
    this.completedStories = stored ? JSON.parse(stored) : [];
  }

  isStoryCompleted(story: any): boolean {
    return this.completedStories.includes(story.title);
  }

  selectStory(story: any): void {
    this.selectedStory = story;
    this.story = story.lines;
    this.currentIndex = 0;
    this.lives = 3;
    this.currentProgress = 0;
    this.updateText();
  }

  async handleNext(): Promise<void> {
    if (this.lives <= 0 || this.isVictory) return;

    const text = this.story[this.currentIndex];
    const checkpointWord = this.extractCheckpointWord(text);

    if (checkpointWord) {
      this.isListening = true;
      const result: SpeechRecognitionResult | null = await this.speechService.detectSpeech(2).catch(() => null);
      this.isListening = false;

      const spoken = result?.text?.toLowerCase().trim() || '';
      const expected = checkpointWord.toLowerCase();

      if (spoken.includes(expected)) {
        this.feedbackClass = 'correct-flash';
        this.characterState = 'running';
        setTimeout(() => {
          this.feedbackClass = '';
          this.characterState = 'standing';
        }, 600);
        this.nextText();
      } else {
        this.feedbackClass = 'shake-error';
        setTimeout(() => this.feedbackClass = '', 600);
        this.lives--;
        alert(`❌ Try again! You said "${spoken}". Expected: "${expected}"`);
      }
    } else {
      this.nextText();
    }
  }

  nextText(): void {
    const reachedEnd = this.currentIndex >= this.story.length - 1;

    if (reachedEnd) {
      this.isVictory = true;
      this.currentIndex = this.story.length - 1;
      this.currentProgress = 100;
      this.updateText();

      const title = this.selectedStory.title;
      if (!this.completedStories.includes(title)) {
        this.completedStories.push(title);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.completedStories));
      }
      return;
    }

    this.currentIndex++;
    this.currentProgress = (this.currentIndex / this.story.length) * 100;
    this.updateText();
  }

  restartStory(): void {
    this.currentIndex = 0;
    this.lives = 3;
    this.isVictory = false;
    this.currentProgress = 0;
    this.updateText();
  }

  returnToSelection(): void {
    this.selectedStory = null;
    this.isVictory = false;
    this.currentIndex = 0;
    this.currentProgress = 0;
    this.lives = 3;
  }

  updateText(): void {
    const current = this.story[this.currentIndex];
    const checkpointWord = this.extractCheckpointWord(current);
    let clean = this.cleanText(current);

    if (checkpointWord) {
      const safeRegex = new RegExp(`\\b(${checkpointWord})\\b`, 'i');
      clean = clean.replace(safeRegex, `<strong><u>$1</u></strong>`);
    }

    this.currentText = this.sanitizer.bypassSecurityTrustHtml(clean);
    this.isCheckpoint = !!checkpointWord;
  }

  cleanText(text: string): string {
    return text.replace(/\*\*(.*?)\*\*/g, '<span class="highlight">$1</span>');
  }

  extractCheckpointWord(text: string): string | null {
    const match = text.match(/\*\*(.*?)\*\*/);
    return match ? match[1] : null;
  }

  closeInstructions(): void {
    this.showInstructions = false;
  }
}
