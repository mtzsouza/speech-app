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

  cards: { id: number; type: 'letter' | 'sound'; value: string; flipped: boolean; matched: boolean; backImage: string }[] = [];
  flippedCards: { id: number; type: 'letter' | 'sound'; value: string; flipped: boolean; matched: boolean }[] = [];
  isGameActive: boolean = false;

  level: number = 1;
  maxLevel: number = 20;
  maxCards: number = 50; 
  levelComplete: boolean = false;
  gameOver: boolean = false;
  lives: number = 0; 

  ngOnInit() {
    this.languageService.getLanguage().then(lang => {
      this.language = lang;
      this.initializeGame();
    });
  }
  currentLanguage: string = '';

  initializeGame(): void {
    if(this.language.dashboard.title === 'Dashboard')
      this.currentLanguage = 'english';
    else
      this.currentLanguage = 'spanish';

    this.isGameActive = true;
    this.levelComplete = false;
    this.gameOver = false;

    this.cards = this.createCardDeck();
    this.shuffleCards();

    // Calculate lives: 1 life per 2 cards
    this.lives = Math.floor(this.cards.length / 2)+Math.floor(this.cards.length / 4);
  }

  createCardDeck(): { id: number; type: 'letter' | 'sound'; value: string; flipped: boolean; matched: boolean; backImage: string }[] {
    const sounds = this.language.soundboard.examples;
    const letters = Object.keys(sounds);
  
    const numberOfCards = Math.min(4 + (this.level - 1) * 2, this.maxCards);
    const selectedLetters = letters.slice(0, numberOfCards / 2);
  
    let id = 0;
    const deck = selectedLetters.flatMap((letter) => [
      { id: id++, type: 'letter' as const, value: letter, flipped: false, matched: false, backImage: `assets/games/game1/card${Math.floor(Math.random() * 16) + 1}.png` },
      { id: id++, type: 'sound' as const, value: letter, flipped: false, matched: false, backImage: `assets/games/game1/card${Math.floor(Math.random() * 16) + 1}.png` },
    ]);
  
    return deck;
  }
  
  

  shuffleCards(): void {
    this.cards = this.cards.sort(() => Math.random() - 0.5);
  }

  flipCard(card: { id: number; type: 'letter' | 'sound'; value: string; flipped: boolean; matched: boolean }): void {
    if (card.matched) {
      this.playSound(card.value);
      return;
    }
  
    if (this.gameOver || card.flipped || this.flippedCards.length >= 2) {
      return;
    }
  
    card.flipped = true;
    this.flippedCards.push(card);
  
    if (this.flippedCards.length === 2) {
      setTimeout(() => this.checkMatch(), 1000);
    }
  
    if (card.type === 'sound') {
      this.playSound(card.value);
    }
  }
  
  
  

  checkMatch(): void {
    const [card1, card2] = this.flippedCards;
  
    if (card1.value === card2.value && card1.type !== card2.type) {
      card1.matched = true;
      card2.matched = true;
  
      if (this.cards.every((card) => card.matched)) {
        this.completeLevel();
      }
  
      this.flippedCards = []; // Clear immediately if it's a match
    } else {
      this.lives--;
  
      setTimeout(() => {
        card1.flipped = false;
        card2.flipped = false;
        this.flippedCards = []; // Only clear after flipping back
      }, 500);
  
      if (this.lives <= 0) {
        this.endGame();
      }
    }
  }

  completeLevel(): void {
    this.isGameActive = false;
    this.levelComplete = true;

    if (this.level < this.maxLevel) {
      setTimeout(() => {
        this.level++;
        this.initializeGame();
      }, 2000);
    } else {
      console.log('Congratulations! You completed all levels!');
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
