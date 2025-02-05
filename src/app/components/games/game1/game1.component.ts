import { Component, inject, OnInit } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../services/language.service';
import * as english from '../../../utils/english.json'

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

  cards: { id: number; type: 'letter' | 'sound'; value: string; flipped: boolean; matched: boolean }[] = [];
  flippedCards: { id: number; type: 'letter' | 'sound'; value: string; flipped: boolean; matched: boolean }[] = [];
  isGameActive: boolean = false;

  level: number = 1;
  maxLevel: number = 20;
  maxCards: number = 50; 
  levelComplete: boolean = false;

  ngOnInit() {
    this.languageService.getLanguage().then(lang => {
      this.language = lang;
      this.initializeGame();
    });
    this.initializeGame();
  }
  currentLanguage:string = '';

  initializeGame(): void {
    if(this.language.dashboard.title === 'Dashboard')
      this.currentLanguage = 'english';
    else
      this.currentLanguage = 'spanish';

    this.isGameActive = true;
    this.levelComplete = false;
    this.cards = this.createCardDeck();
    this.shuffleCards();
    console.log(this.cards);
  }
  

  createCardDeck(): { id: number; type: 'letter' | 'sound'; value: string; flipped: boolean; matched: boolean }[] {
    const sounds = this.language.soundboard.examples;
    const letters = Object.keys(sounds);
  
    //Number of cards for the current level
    const numberOfCards = Math.min(10 + (this.level - 1) * 2, this.maxCards);
  
    //Choose random sounds
    const selectedLetters = letters.slice(0, numberOfCards / 2);
  
    let id = 0;
    const deck = selectedLetters.flatMap((letter) => [
      { id: id++, type: 'letter' as const, value: letter, flipped: false, matched: false },
      { id: id++, type: 'sound' as const, value: letter, flipped: false, matched: false },
    ]);
  
    return deck;
  }
  

  shuffleCards(): void {
    this.cards = this.cards.sort(() => Math.random() - 0.5);
  }

  flipCard(card: { id: number; type: 'letter' | 'sound'; value: string; flipped: boolean; matched: boolean }): void {
    if (card.flipped || card.matched || this.flippedCards.length >= 2) {
      return;
    }
  
    card.flipped = true;
    this.flippedCards.push(card);
  
    if (this.flippedCards.length === 2) {
      this.checkMatch();
    }
  
    if (card.type === 'sound') {
      this.playSound(card.value);
    }
  }
  

  checkMatch(): void {
    const [card1, card2] = this.flippedCards;
  
    //Check for a match
    if (card1.value === card2.value && card1.type !== card2.type) {
      card1.matched = true;
      card2.matched = true;
  
      //Clear flipped cards
      this.flippedCards = [];
  
      //Check if game is won
      if (this.cards.every((card) => card.matched)) {
        this.completeLevel();
      }
    } else {
      //Flip cards back down if not matched
      setTimeout(() => {
        card1.flipped = false;
        card2.flipped = false;
        this.flippedCards = [];
      }, 1000);
    }
  }

  completeLevel(): void {
    this.isGameActive = false;
    this.levelComplete = true;

    //Progress to the next level
    if (this.level < this.maxLevel) {
      setTimeout(() => {
        this.level++;
        this.initializeGame();
      }, 2000);
    } else {
      console.log('Congratulations! You completed all levels!');
    }
  }

  playSound(sound: string): void {
    console.log(sound);
    console.log(`/assets/sounds/${this.currentLanguage === 'english' ? 'eng' : 'spa'}Pronunciations/${sound.replace(/\//g, '')}.mp3`);
    console.log(this.currentLanguage);
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
