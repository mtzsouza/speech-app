import { Component, inject, OnInit } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../services/language.service';
import { AuthService } from '../../../services/auth.service';
import * as english from '../../../utils/english.json'

@Component({
  selector: 'app-soundboard',
  standalone: true,
  imports: [NavbarComponent, RouterModule, CommonModule],
  templateUrl: './soundboard.component.html',
  styleUrl: './soundboard.component.sass'
})
export class SoundboardComponent {
  isPopupOpen: boolean = false;
  currentSound: string = '';
  showExamples: boolean = false;
  showPairs: boolean = false;

  authService = inject(AuthService);
  languageService = inject(LanguageService);
  language = english; // Default is english, to show up before language loads

  ngOnInit() {
    this.authService.firebaseAuth.onAuthStateChanged((user) => {
      if (user) {
        this.languageService.getLanguage().then(lang => {
          this.language = lang;
          this.updateCategories();
        });
      }
      this.updateCategories();
    })
  }

  currentLanguage:string = '';
  categories: { [key: string]: string[] } = {};
  objectKeys = Object.keys;

  updateCategories(): void {
    if(this.language.dashboard.title === 'Dashboard')
      this.currentLanguage = 'english';
    else
      this.currentLanguage = 'spanish';

    this.categories = this.language.soundboard.categories;
  }

  handleOutsideClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
  
    if (target.classList.contains('menu')) {
      this.closePopup();
    }
  }
  
  openPopup(sound: string): void {
    this.isPopupOpen = true;
    this.currentSound = sound;
    this.showExamples = false; // Reset to main menu
    this.showPairs = false;
  }

  closePopup(): void {
    this.isPopupOpen = false;
    this.currentSound = '';
  }

  currentAudio: HTMLAudioElement | null = null; // Shared audio object for both methods

  playSound(sound: string): void {
      if (this.currentAudio) {
        this.currentAudio.pause(); // Pause the currently playing audio
        this.currentAudio.currentTime = 0; // Reset to the beginning
      }
      sound = sound.replace(/\//g, ''); // Remove '/' characters
      this.currentAudio = new Audio(`/assets/sounds/${this.currentLanguage === 'english' ? 'eng' : 'spa'}Pronunciations/${sound}.mp3`);
      this.currentAudio.play();

      this.trackSoundProgress(sound);
  }
  
  playExample(sound: string): void {
      if (this.currentAudio) {
        this.currentAudio.pause(); // Pause the currently playing audio
        this.currentAudio.currentTime = 0; // Reset to the beginning
      }
      sound = sound.toLocaleLowerCase(); // Convert to lowercase
      this.currentAudio = new Audio(`/assets/sounds/${this.currentLanguage === 'english' ? 'eng' : 'spa'}Examples/${sound}.mp3`);
      this.currentAudio.play();

      this.trackSoundProgress(sound);
  }

  playPair(sound: string): void {
    if (this.currentAudio) {
      this.currentAudio.pause(); // Pause the currently playing audio
      this.currentAudio.currentTime = 0; // Reset to the beginning
    }
    console.log(sound);
    this.currentAudio = new Audio(`/assets/sounds/${this.currentLanguage === 'english' ? 'eng' : 'spa'}Pairs/${sound}.mp3`);
    this.currentAudio.play();

    this.trackSoundProgress(sound);
  }

  toggleExamples(show: boolean): void {
    this.showExamples = show;
  }

  togglePairs(show: boolean): void {
    this.showPairs = show;
  }

  getExamplesForCurrentSound(): string[] {
    return this.language.soundboard.examples[this.currentSound as keyof typeof this.language.soundboard.examples] || [];
  }
  
  getPairsForCurrentSound(): string[] {
    return this.language.soundboard.pairs[this.currentSound as keyof typeof this.language.soundboard.pairs] || [];
  }

  getTotalSounds(): number {
    return Object.values(this.categories).reduce((acc, sounds) => acc + sounds.length, 0);
  }

  trackSoundProgress(sound: string): void {
    let playedSounds: string[] = JSON.parse(sessionStorage.getItem('playedSounds') || '[]');

    if (!playedSounds.includes(sound)) {
        playedSounds.push(sound);
        sessionStorage.setItem('playedSounds', JSON.stringify(playedSounds));

        // Calculate progress
        const totalSounds = this.getTotalSounds();
        const progress = Math.min((playedSounds.length / totalSounds) * 100, 100);
        sessionStorage.setItem('soundboardProgress', progress.toFixed(0));
    }
  }
  
}
