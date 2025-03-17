import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
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
  timer: number = 0;
  gameInterval: any;
  timerInterval: any;
  missiles: { id: number; position: number }[] = [];
  missileIdCounter: number = 0;
  explosion: { x: number, y: number, size: number } | null = null;
  showEarth: boolean = true;
  showMeteor: boolean = true;
  meteorPosition: number = 0;

  constructor(private cdr: ChangeDetectorRef) {}

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
    this.missiles = [];
    this.explosion = null;
    this.showEarth = true;
    this.showMeteor = true;
    this.meteorPosition = 0;
    this.selectNewWord();
    this.startGameLoop();
  }

  startGameLoop(): void {
    this.gameOver = false;
    this.isDisabled = false;
    clearInterval(this.gameInterval);
    clearInterval(this.timerInterval);

    const screenHeight = window.innerHeight;
    const meteorSpeed = screenHeight * 0.00018;

    this.timer = 0;
    this.timerInterval = setInterval(() => {
      if (!this.gameOver) {
        this.timer++;
      }
    }, 1000);

    this.gameInterval = setInterval(() => {
      if (this.gameOver) {
          clearInterval(this.gameInterval);
          return;
      }
  
      this.meteorPosition += meteorSpeed;
  
      const meteorBottom = this.meteorPosition + (210 / window.innerHeight) * 100;
      const earthTop = 85;
  
      if (meteorBottom >= earthTop) {
          console.log("earth-meteor collision");
  
          this.triggerExplosion(50, earthTop, true);
  
          this.showEarth = false;
          this.showMeteor = false;
          this.endGame();
      }
  }, 30);
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

    if (sound === this.correctSound) {
      this.fireMissile();
      this.selectNewWord();
    } else {
      this.isDisabled = true;
      setTimeout(() => this.isDisabled = false, 5000);
    }
  }

  fireMissile(): void {
    if (this.gameOver) return;

    const earthElement = document.querySelector('.earth') as HTMLElement | null;
    if (!earthElement) {
        console.error("earth DNE");
        return;
    }

    const earthRect = earthElement.getBoundingClientRect();
    const screenHeight = window.innerHeight;

    console.log(earthRect.top);

    const earthTopPercent = (earthRect.top / screenHeight) * 100;

    const missileStartPosition = 18;


    const missile = { id: this.missileIdCounter++, position: missileStartPosition };
    this.missiles.push(missile);

    this.cdr.detectChanges();

    setTimeout(() => {
        const missileElement = document.querySelector(`.missile:last-child`) as HTMLElement | null;

        if (!missileElement) {
            console.error("missile DNE");
            return;
        }

        let missileY = missile.position;

        const missileInterval = setInterval(() => {
            if (this.gameOver) {
                clearInterval(missileInterval);
                return;
            }

            missileY += 2;
            missile.position = missileY;
            missileElement.style.bottom = `${missile.position}%`;

            const meteorElement = document.querySelector('.meteor img') as HTMLElement | null;
            if (!meteorElement) return;

            const missileRect = missileElement.getBoundingClientRect();
            const meteorRect = meteorElement.getBoundingClientRect();

            if (
                missileRect.top < meteorRect.bottom &&
                missileRect.bottom > meteorRect.top &&
                missileRect.left < meteorRect.right &&
                missileRect.right > meteorRect.left
            ) {
                console.log("missile-meteor collision");

                this.triggerExplosion(50, meteorRect.bottom, false);
                this.missiles = this.missiles.filter(m => m.id !== missile.id);
                clearInterval(missileInterval);
                this.meteorPosition = Math.max(0, this.meteorPosition - 25);
            }

            if (missileY >= 100) {
                console.log("missile out of bounds");
                this.missiles = this.missiles.filter(m => m.id !== missile.id);
                clearInterval(missileInterval);
            }
        }, 30);
    }, 0);
}

triggerExplosion(x: number, y: number, isEarthCollision: boolean = false): void {
  const explosionSize = isEarthCollision ? 500 : 80;

  this.explosion = { x, y, size: explosionSize };

  setTimeout(() => this.explosion = null, 2000);
}

  endGame(): void {
    clearInterval(this.gameInterval);
    clearInterval(this.timerInterval);
    this.gameOver = true;
    this.isDisabled = true;
    this.missiles = [];
  }

  restartGame(): void {
    this.initializeGame();
  }
}
