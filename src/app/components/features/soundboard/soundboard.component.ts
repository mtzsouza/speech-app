import { Component } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

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

  // Example words for each sound
  examples: { [key: string]: string[] } = {
    '/eɪ/': ['Age', 'Cake', 'Display'],
    '/æ/': ['Act', 'After', 'Chance'],
    '/i/': ['East', 'Seem', 'Agree'],
    '/ɛ/': ['End', 'Enter', 'Friend'],
    '/aɪ/': ['Eye', 'Kind', 'Sky'],
    '/ɪ/': ['Into', 'Issue', 'Gift'],
    '/oʊ/': ['Old', 'Both', 'Snow'],
    '/ɑ/': ['Odd', 'Box', 'Not'],
    '/ju/': ['You', 'Cute', 'View'],
    '/ʌ/': ['Up', 'From', 'None'],
    '/ʊ/': ['Book', 'Push', 'Put'],
    'oo': ['Food', 'Move', 'Clue'],
    'aw': ['Off', 'Boss', 'Raw'],
    'ow': ['Our', 'Brown', 'Now'],
    'oi': ['Oil', 'Join', 'Toy'],
    'er': ['Earth', 'Burn', 'Stir'],
    'ar': ['Are', 'Charge', 'Far'],
    'or': ['Or', 'Force', 'Floor'],
    'air': ['Air', 'Berry', 'Scare'],
    'b': ['Back', 'Number', 'Job'],
    'ch': ['Change', 'Kitchen', 'Inch'],
    'd': ['Dance', 'Middle', 'End'],
    'f': ['Face', 'Left', 'Half'],
    'g': ['Glad', 'Ago', 'Beg'],
    'h': ['Hand', 'How', 'Behind'],
    'j': ['Job', 'Agent', 'Strange'],
    'k': ['Cat', 'Act', 'Luck'],
    'l': ['Last', 'Glass', 'Feel'],
    'm': ['Month', 'Almost', 'Dream'],
    'n': ['Name', 'Once', 'Rain'],
    'ng': ['Hungry', 'Single', 'King'],
    'p': ['Page', 'Copy', 'Drop'],
    'r': ['Raise', 'Bring', 'Ear'],
    's': ['Small', 'Best', 'Nice'],
    'sh': ['Shape', 'Issue', 'Fish'],
    't': ['Take', 'Stop', 'Lost'],
    'th': ['Thank', 'Healthy', 'Bath'],
    'v': ['View', 'Even', 'Save'],
    'w': ['Won', 'Swim', 'Away'],
    'y': ['Year', 'Yet', 'Yellow'],
    'z': ['Zoo', 'Busy', 'His'],
    'zh': ['Measure', 'Vision', 'Massage'],
  };

  pairs: { [key: string]: string[] } = {
    '/eɪ/': ['Wet Wait', 'Bed Bade', 'Beck Bake'],
    '/æ/': ['Had Head', 'Bag Beg', 'Pat Pet'],
    '/i/': ['East', 'Seem', 'Agree'],
    '/ɛ/': ['End', 'Enter', 'Friend'],
    '/aɪ/': ['Eye', 'Kind', 'Sky'],
    '/ɪ/': ['Into', 'Issue', 'Gift'],
    '/oʊ/': ['Old', 'Both', 'Snow'],
    '/ɑ/': ['Odd', 'Box', 'Not'],
    '/ju/': ['You', 'Cute', 'View'],
    '/ʌ/': ['Up', 'From', 'None'],
    '/ʊ/': ['Book', 'Push', 'Put'],
    'oo': ['Food', 'Move', 'Clue'],
    'aw': ['Off', 'Boss', 'Raw'],
    'ow': ['Our', 'Brown', 'Now'],
    'oi': ['Oil', 'Join', 'Toy'],
    'er': ['Earth', 'Burn', 'Stir'],
    'ar': ['Are', 'Charge', 'Far'],
    'or': ['Or', 'Force', 'Floor'],
    'air': ['Air', 'Berry', 'Scare'],
    'b': ['Back', 'Number', 'Job'],
    'ch': ['Change', 'Kitchen', 'Inch'],
    'd': ['Dance', 'Middle', 'End'],
    'f': ['Face', 'Left', 'Half'],
    'g': ['Glad', 'Ago', 'Beg'],
    'h': ['Hand', 'How', 'Behind'],
    'j': ['Job', 'Agent', 'Strange'],
    'k': ['Cat', 'Act', 'Luck'],
    'l': ['Last', 'Glass', 'Feel'],
    'm': ['Month', 'Almost', 'Dream'],
    'n': ['Name', 'Once', 'Rain'],
    'ng': ['Hungry', 'Single', 'King'],
    'p': ['Page', 'Copy', 'Drop'],
    'r': ['Raise', 'Bring', 'Ear'],
    's': ['Small', 'Best', 'Nice'],
    'sh': ['Shape', 'Issue', 'Fish'],
    't': ['Take', 'Stop', 'Lost'],
    'th': ['Thank', 'Healthy', 'Bath'],
    'v': ['View', 'Even', 'Save'],
    'w': ['Won', 'Swim', 'Away'],
    'y': ['Year', 'Yet', 'Yellow'],
    'z': ['Zoo', 'Busy', 'His'],
    'zh': ['Measure', 'Vision', 'Massage'],
  };


  
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
      this.currentAudio = new Audio(`/assets/sounds/engPronunciations/${sound}.mp3`);
      this.currentAudio.play();
  }
  
  playExample(sound: string): void {
      if (this.currentAudio) {
        this.currentAudio.pause(); // Pause the currently playing audio
        this.currentAudio.currentTime = 0; // Reset to the beginning
      }
      sound = sound.toLocaleLowerCase(); // Convert to lowercase
      this.currentAudio = new Audio(`/assets/sounds/engExamples/${sound}.mp3`);
      this.currentAudio.play();
  }

  playPair(sound: string): void {
    if (this.currentAudio) {
      this.currentAudio.pause(); // Pause the currently playing audio
      this.currentAudio.currentTime = 0; // Reset to the beginning
    }
    console.log(sound);
    this.currentAudio = new Audio(`/assets/sounds/engPairs/${sound}.mp3`);
    this.currentAudio.play();
  }

  toggleExamples(show: boolean): void {
    this.showExamples = show;
  }

  togglePairs(show: boolean): void {
    this.showPairs = show;
  }
}
