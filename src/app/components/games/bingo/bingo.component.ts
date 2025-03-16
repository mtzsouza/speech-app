import { Component, inject, OnInit } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../services/language.service';
import { ChangeDetectorRef } from '@angular/core';
import * as english from '../../../utils/english.json';

@Component({
  selector: 'app-bingo',
  templateUrl: './bingo.component.html',
  styleUrl: './bingo.component.sass',
  standalone: true,
  imports: [NavbarComponent, RouterModule, CommonModule],
  
})

export class BingoComponent implements OnInit {
  language: any;
  sounds: string[] = [];
  board: { value: string; marked: boolean; missed?: boolean; animation?: string }[][] = [];
  calledSounds: string[] = [];
  currentSound: string | null = null;
  displayedSound: string | null = null;
  gameWon = false;

  phoneticMap: Record<string, string> = {
    '/eɪ/': 'a (long)', '/æ/': 'a (short)',
    '/i/': 'e (long)', '/ɛ/': 'e (short)',
    '/aɪ/': 'i (long)', '/ɪ/': 'i (short)',
    '/oʊ/': 'o (long)', '/ɑ/': 'o (short)',
    '/ju/': 'u (long)', '/ʌ/': 'u (short)', '/ʊ/': 'u (short)'
  };

  constructor(private languageService: LanguageService) {}

  ngOnInit(): void {
    this.languageService.getLanguage().then(lang => {
      this.language = lang;
      this.loadSounds();
    });
  }

  loadSounds(): void {
    this.sounds = Object.keys(this.language.soundboard.examples);
    this.generateBoard();
  }

  generateBoard(): void {
    if(this.language.dashboard.title === 'Dashboard')
      this.currentLanguage = 'english';
    else
      this.currentLanguage = 'spanish';

    const shuffledSounds = [...this.sounds].sort(() => Math.random() - 0.5).slice(0, 25);
    this.board = Array.from({ length: 5 }, (_, row) => 
      shuffledSounds.slice(row * 5, row * 5 + 5).map(value => ({ value, marked: false }))
    );
  }

  currentLanguage: string = '';

  playSound(): void {
    if (this.sounds.length === 0) return;

    if (this.currentSound) {
        this.board.forEach(row => {
            row.forEach(cell => {
                if (cell.value === this.currentSound && !cell.marked) {
                    cell.missed = true;
                    console.warn(`❌ Missed sound: ${this.currentSound} - This square is now locked!`);
                }
            });
        });

        this.board = [...this.board];
    }

    const remainingSounds = this.sounds.filter(s => !this.calledSounds.includes(s));
    if (remainingSounds.length === 0) return;

    this.currentSound = remainingSounds[Math.floor(Math.random() * remainingSounds.length)];
    this.calledSounds.push(this.currentSound);
    this.displayedSound = this.phoneticMap[this.currentSound] || this.currentSound;

    console.log("🔊 Playing sound:", this.currentSound);

    const soundPath = `/assets/sounds/${this.currentLanguage === 'english' ? 'eng' : 'spa'}Pronunciations/${this.currentSound.replace(/\//g, '')}.mp3`;

    const audio = new Audio(soundPath);
    audio.load();
    audio.play().catch(error => console.error("Error playing sound:", error));
}

  


markSquare(row: number, col: number): void {
  if (!this.currentSound || this.gameWon) return;

  const square = this.board[row][col];

  // Prevent interaction with missed cells
  if (square.missed) {
      console.warn(`🚫 Cannot select missed cell: ${square.value}`);
      return;
  }

  if (!square.marked && square.value === this.currentSound) {
      square.marked = true;
      square.animation = 'correct';
      console.log(`✅ Marked: ${square.value}`);

      setTimeout(() => {
          square.animation = '';
          this.board = [...this.board];
      }, 1500);

      this.board = [...this.board];
      this.checkWin();
  } else {
      square.animation = 'incorrect';
      console.warn(`❌ Incorrect selection: ${square.value}`);

      setTimeout(() => {
          square.animation = '';
          this.board = [...this.board];
      }, 600);
  }
}
  
  

  checkWin(): void {
    const isRowWin = this.board.some(row => row.every(cell => cell.marked));
    const isColWin = this.board[0].some((_, col) => this.board.every(row => row[col].marked));
    const isDiagonalWin = this.board.every((row, idx) => row[idx].marked) ||
                          this.board.every((row, idx) => row[4 - idx].marked);

    if (isRowWin || isColWin || isDiagonalWin) {
      this.gameWon = true;
      alert('🎉 BINGO! You won!');
    }
  }

  resetGame(): void {
    this.calledSounds = [];
    this.currentSound = null;
    this.displayedSound = null;
    this.gameWon = false;
    this.generateBoard();
  }
}
