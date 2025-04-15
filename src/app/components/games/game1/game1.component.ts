import { Component, inject, OnInit } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../services/language.service';
import * as english from '../../../utils/english.json';

@Component({
  selector: 'app-game1',
  standalone: true,
  imports: [NavbarComponent, RouterModule, CommonModule],
  templateUrl: './game1.component.html',
  styleUrls: ['./game1.component.sass']
})
export class Game1Component implements OnInit {
  languageService = inject(LanguageService);
  language = english;

  ngOnInit() {
    this.languageService.getLanguage().then(lang => {
      this.language = lang;
      this.loadData();
    });
  }

  cards: { id: number; type: 'letter' | 'sound'; value: string; ipaValue: string; flipped: boolean; matched: boolean; backImage: string }[] = [];
  flippedCards: { id: number; type: 'letter' | 'sound'; value: string; ipaValue: string; flipped: boolean; matched: boolean }[] = [];
  isGameActive: boolean = false;

  level: number = 1;
  highestLevel: number = 1;
  maxLevel: number = 1;
  levelComplete: boolean = false;
  gameOver: boolean = false;
  wonGame: boolean = false;
  lives: number = 0; 
  showInstructions: boolean | null = null;

  loadData(): void {
    const storedLevel = localStorage.getItem('highestLevel');
    this.highestLevel = storedLevel ? parseInt(storedLevel, 10) : 1;

    const dontShowInstructions = localStorage.getItem('dontShowInstructionsMM');
    this.showInstructions = dontShowInstructions !== 'true';

    this.initializeGame();
  }

  saveHighestLevel(): void {
    if (this.level > this.highestLevel) {
      this.highestLevel = this.level;
      localStorage.setItem('highestLevel', String(this.highestLevel));
    }
  }

  hideInstructions(dontShowAgain: boolean): void {
    this.showInstructions = false;
    if (dontShowAgain) {
      localStorage.setItem('dontShowInstructionsMM', 'true');
    }
  }

  currentLanguage: string = '';

  initializeGame(): void {
    if(this.language.dashboard.title === 'Dashboard')
      this.currentLanguage = 'english';
    else
      this.currentLanguage = 'spanish';

    const sounds = this.language.soundboard.examples;
    const totalPairs = Object.keys(sounds).length;
  
    this.maxLevel = totalPairs-1;

    this.isGameActive = true;
    this.levelComplete = false;
    this.gameOver = false;
    this.wonGame = false;

    this.cards = this.createCardDeck();
    this.shuffleCards();

    if (this.level > this.highestLevel) {
      this.highestLevel = this.level;
      localStorage.setItem('highestLevel', String(this.highestLevel));
    }

    this.lives = Math.floor(this.cards.length / 2)+Math.floor(this.cards.length / 4);
  }

  createCardDeck(): { 
    id: number;
    type: 'letter' | 'sound';
    value: string;
    ipaValue: string;
    flipped: boolean;
    matched: boolean;
    backImage: string;
  }[] {
    const sounds = this.language.soundboard.examples;
    const ipaSymbols = Object.keys(sounds);
  
    const phoneticMap: Record<string, string> = {
      '/eɪ/': 'a (long)', '/æ/': 'a (short)',
      '/i/': 'e (long)', '/ɛ/': 'e (short)',
      '/aɪ/': 'i (long)', '/ɪ/': 'i (short)',
      '/oʊ/': 'o (long)', '/ɑ/': 'o (short)',
      '/ju/': 'u (long)', '/ʌ/': 'u (short)', '/ʊ/': 'u (short)'
    };
  
    const numberOfCards = 4 + (this.level - 1) * 2
    const selectedIpaSymbols = ipaSymbols.slice(0, numberOfCards / 2);
  
    let id = 0;
    return selectedIpaSymbols.flatMap((ipa) => {
      const displayValue = phoneticMap[ipa] || ipa;
      
      const letterBack = `assets/games/game1/card${Math.floor(Math.random() * 16) + 1}.png`;
      const soundBack = `assets/games/game1/card${Math.floor(Math.random() * 16) + 1}.png`;
  
      return [
        { id: id++, type: 'letter', value: displayValue, ipaValue: ipa, flipped: false, matched: false, backImage: letterBack },
        { id: id++, type: 'sound', value: ipa, ipaValue: ipa, flipped: false, matched: false, backImage: soundBack }
      ];
    });
  }

  shuffleCards(): void {
    this.cards = this.cards.sort(() => Math.random() - 0.5);
  }

  flipCard(card: { id: number; type: 'letter' | 'sound'; value: string; ipaValue: string; flipped: boolean; matched: boolean }): void {
    console.log(`Flipped: ${card.value} (IPA: ${card.ipaValue})`);
  
    if (card.matched) {
      this.playSound(card.ipaValue);
      return;
    }

    if (card.type === 'sound') {
      this.playSound(card.ipaValue);
    }

    if (card.flipped || this.gameOver || this.flippedCards.length >= 2) {
      return;
    }
  
    card.flipped = true;
    this.flippedCards.push(card);
  
    if (this.flippedCards.length === 2) {
      setTimeout(() => this.checkMatch(), 1000);
    }
  }

  checkMatch(): void {
    const [card1, card2] = this.flippedCards;
  
    if (card1.ipaValue === card2.ipaValue && card1.type !== card2.type) {
      card1.matched = true;
      card2.matched = true;
  
      if (this.cards.every((card) => card.matched)) {
        this.completeLevel();
      }
    } else {
      this.lives--;
  
      setTimeout(() => {
        card1.flipped = false;
        card2.flipped = false;
      }, 500);
    }
  
    this.flippedCards = [];
  
    if (this.lives <= 0) {
      this.endGame();
    }
  }

  //Hector added
  private updateMemoryMatchProgress(): void {
    const current = Number(localStorage.getItem('memoryMatchProgress')) || 0;
    const updated = Math.min(current + 10, 100);
    localStorage.setItem('memoryMatchProgress', String(updated));
    console.log(`Memory Match Progress: ${updated}%`);
  }

  completeLevel(): void {
    this.isGameActive = false;
    
    if (this.level < this.maxLevel) {
      this.levelComplete = true;
      this.updateMemoryMatchProgress();
      setTimeout(() => {
        this.level++;
        this.initializeGame();
      }, 2000);
    } else {
      this.wonGame = true;
    }
  }

  endGame(): void {
    this.isGameActive = false;
    this.gameOver = true;
  }

  playSound(sound: string): void {
    const audio = new Audio(
      `/assets/sounds/${this.currentLanguage === 'english' ? 'eng' : 'spa'}Pronunciations/${sound.replace(/\//g, '')}.mp3`
    );
    audio.play();
  }

  restartGame(): void {
    this.level = 1;
    this.initializeGame();
  }
}
