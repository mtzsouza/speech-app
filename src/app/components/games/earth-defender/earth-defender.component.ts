import { Component, inject, OnInit } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../services/language.service';

@Component({
  selector: 'app-earth-defender',
  standalone: true,
  imports: [NavbarComponent, RouterModule, CommonModule],
  templateUrl: './earth-defender.component.html',
  styleUrl: './earth-defender.component.sass'
})
export class EarthDefenderComponent implements OnInit {
  languageService = inject(LanguageService);
  language: any = {};

  showInstructions: boolean | null = null;
  gameOver: boolean = false;
  word: string = '';
  correctSound: string = '';
  options: string[] = [];
  isDisabled: boolean = false;
  meteorPosition: number = 0;
  timer: number = 0;
  gameInterval: any;
  timerInterval: any;
  missiles: { id: number; position: number }[] = [];
  missileIdCounter: number = 0;
  explosion: { x: number, y: number } | null = null;
  showEarth: boolean = true;
  showMeteor: boolean = true;

  ngOnInit() {
    this.languageService.getLanguage().then(lang => {
      this.language = lang;
      this.loadData();
    }).catch(() => {
      console.error('Failed to load language data');
      this.language = {};
    });
  }

  loadData(): void {
    const dontShowInstructions = localStorage.getItem('dontShowInstructionsED');
    this.showInstructions = dontShowInstructions !== 'true';
    this.initializeGame();
  }

  hideInstructions(dontShowAgain: boolean): void {
    this.showInstructions = false;
    if (dontShowAgain) {
      localStorage.setItem('dontShowInstructionsED', 'true');
    }
  }

  initializeGame(): void {
    this.gameOver = false;
    this.timer = 0;
    this.meteorPosition = 0;
    this.missiles = [];
    this.explosion = null;
    this.showEarth = true;
    this.showMeteor = true;
    this.selectNewWord();
    this.startGameLoop();
  }

    startGameLoop(): void {
      this.gameOver = false;
      this.isDisabled = false;
      clearInterval(this.gameInterval);
      clearInterval(this.timerInterval); // Ensure no duplicate timers

      let speed = 0.15; // Adjusted meteor speed
      const meteorHeight = 210; // Approximate height of the meteor in pixels

      // Timer now updates independently every second
      this.timer = 0;
      this.timerInterval = setInterval(() => {
          if (!this.gameOver) {
              this.timer++;
          }
      }, 1000);

      this.gameInterval = setInterval(() => {
          this.meteorPosition += speed;

          // Calculate actual bottom position of meteor for collision
          const meteorBottom = this.meteorPosition + (meteorHeight / window.innerHeight) * 100;
          const earthTop = 85; // Position where Earth starts

          if (meteorBottom >= earthTop) { // Collision check
              this.triggerExplosion(50, earthTop, true);
              this.showEarth = false;
              this.showMeteor = false;
              this.endGame();
          }
      }, 30); // Only controls meteor speed now
  }


  selectNewWord(): void {
    if (!this.language.soundboard || !this.language.soundboard.examples) return;

    const words: [string, string[]][] = Object.entries(this.language.soundboard.examples);
    const randomIndex = Math.floor(Math.random() * words.length);
    const [sound, examples] = words[randomIndex];

    if (examples.length === 0) return;

    this.word = examples[Math.floor(Math.random() * examples.length)];
    this.correctSound = sound;
    this.generateOptions();
  }

  generateOptions(): void {
    if (!this.language.soundboard || !this.language.soundboard.examples) return;

    const allSounds = Object.keys(this.language.soundboard.examples);
    const incorrectOptions = allSounds.filter(s => s !== this.correctSound);
    this.options = [
      this.correctSound,
      ...incorrectOptions.sort(() => 0.5 - Math.random()).slice(0, 3)
    ].sort(() => 0.5 - Math.random());
  }

  selectAnswer(sound: string): void {
    if (this.isDisabled || this.gameOver) return;

    this.fireMissile();

    if (sound === this.correctSound) {
      setTimeout(() => {
        this.meteorPosition = Math.max(this.meteorPosition - 20, 0);
        this.triggerExplosion(50, this.meteorPosition);
        this.selectNewWord();
      }, 1000);
    } else {
      this.isDisabled = true;
      setTimeout(() => this.isDisabled = false, 5000);
    }
  }

  fireMissile(): void {
    if (this.gameOver) return;

    const missile = { id: this.missileIdCounter++, position: 10 }; // Starts above Earth
    this.missiles.push(missile);

    const missileInterval = setInterval(() => {
      missile.position += 5;

      if (missile.position >= this.meteorPosition) {
        this.triggerExplosion(50, missile.position);
        this.missiles = this.missiles.filter(m => m.id !== missile.id);
        clearInterval(missileInterval);
      }
    }, 100);
  }

  triggerExplosion(x: number, y: number, isEarthCollision: boolean = false): void {
    this.explosion = { x, y };
    
    // Apply larger explosion for Earth collisions
    const explosionSize = isEarthCollision ? 150 : 80; // Earth collision is bigger

    // Update explosion element size dynamically
    const explosionElement = document.querySelector('.explosion img');
    if (explosionElement) {
        (explosionElement as HTMLImageElement).style.width = `${explosionSize}px`;
        (explosionElement as HTMLImageElement).style.height = `${explosionSize}px`;
    }

    setTimeout(() => this.explosion = null, 2000);
}

  endGame(): void {
    clearInterval(this.gameInterval);
    clearInterval(this.timerInterval); // Stop the survival timer
    this.gameOver = true;
    this.isDisabled = true;
    this.missiles = [];
  }

  restartGame(): void {
    this.initializeGame();
  }
}
