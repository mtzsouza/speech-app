//TODO
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
  launchSound = new Audio('/assets/games/earth-defender/launch.mp3');
  explosionSound = new Audio('/assets/games/earth-defender/explosion.mp3');
  matchPart: string = '';
  wordParts: { before: string; highlight: string; after: string } = {
    before: '',
    highlight: '',
    after: ''
  };
  score: number = 0;
  streak: number = 0;
  longestStreak: number = 0;
  bestStreak: number = 0;
  bestTime: number = 0;
  bestScore: number = 0;
  temp: string | null = '';


  phoneticMap: Record<string, string> = {
    '/eɪ/': 'a (long)', '/æ/': 'a (short)',
    '/i/': 'e (long)', '/ɛ/': 'e (short)',
    '/aɪ/': 'i (long)', '/ɪ/': 'i (short)',
    '/oʊ/': 'o (long)', '/ɑ/': 'o (short)',
    '/ju/': 'u (long)', '/ʌ/': 'u (short)', '/ʊ/': 'u (short)'
  };
  
  phonemeMatchMap: Record<string, Record<string, string>> = {
    "/eɪ/": { "Age": "A", "Cake": "a", "Display": "ay" },
    "/æ/": { "Act": "A", "After": "A", "Chance": "a" },
    "/i/": { "East": "E", "Seem": "ee", "Agree": "ee", "Ir": "i", "Idioma": "i", "Chica": "i" },
    "/ɛ/": { "End": "E", "Enter": "E", "Friend": "ie" },
    "/aɪ/": { "Eye": "Ey", "Kind": "i", "Sky": "y" },
    "/ɪ/": { "Into": "I", "Issue": "I", "Gift": "i" },
    "/oʊ/": { "Old": "O", "Both": "o", "Snow": "ow" },
    "/ɑ/": { "Odd": "O", "Box": "o", "Not": "o" },
    "/ju/": { "You": "You", "Cute": "u", "View": "ew" },
    "/ʌ/": { "Up": "U", "From": "o", "None": "o" },
    "/ʊ/": { "Book": "oo", "Push": "u", "Put": "u" },
    "oo": { "Food": "oo", "Move": "o", "Clue": "ue" },
    "aw": { "Off": "o", "Boss": "o", "Raw": "aw" },
    "ow": { "Our": "ou", "Brown": "ow", "Now": "ow" },
    "oi": { "Oil": "oi", "Join": "oi", "Toy": "oy" },
    "er": { "Earth": "Ear", "Burn": "ur", "Stir": "ir" },
    "ar": { "Are": "Are", "Charge": "ar", "Far": "ar" },
    "or": { "Or": "Or", "Force": "or", "Floor": "oor" },
    "air": { "Air": "Air", "Berry": "err", "Scare": "are" },
    "b": { "Back": "B", "Number": "b", "Job": "b" },
    "ch": { "Charge": "Ch", "Kitchen": "ch", "Inch": "ch" },
    "d": { "Dance": "D", "Middle": "dd", "End": "d" },
    "f": { "Face": "F", "Left": "f", "Half": "f" },
    "g": { "Glad": "G", "Ago": "g", "Beg": "g" },
    "h": { "Hand": "H", "How": "H", "Behind": "h" },
    "j": { "Job": "J", "Agent": "g", "Strange": "g" },
    "k": { "Cat": "C", "Act": "c", "Luck": "ck" },
    "l": { "Last": "L", "Glass": "l", "Feel": "l" },
    "m": { "Month": "M", "Almost": "m", "Dream": "m" },
    "n": { "Name": "N", "Once": "n", "Rain": "n" },
    "ng": { "Hungry": "ng", "Single": "ng", "King": "ng" },
    "p": { "Page": "P", "Copy": "p", "Drop": "p" },
    "r": { "Raise": "R", "Bring": "r", "Ear": "r" },
    "s": { "Small": "S", "Best": "s", "Nice": "c" },
    "sh": { "Shape": "Sh", "Issue": "ss", "Fish": "sh" },
    "t": { "Take": "T", "Stop": "t", "Lost": "t" },
    "th": { "Thank": "Th", "Healthy": "th", "Bath": "th" },
    "v": { "View": "V", "Even": "v", "Save": "v" },
    "w": { "Won": "W", "Swim": "w", "Away": "w" },
    "y": { "Year": "Y", "Yet": "Y", "Yellow": "Y" },
    "z": { "Zoo": "Z", "Busy": "s", "His": "s" },
    "zh": { "Measure": "su", "Vision": "si", "Massage": "s" },

    "/a/": { "Papa": "a", "Agua": "a", "Amigo": "a" },
    "/e/": { "Ella": "e", "Escuchar": "e", "Elefante": "e" },
    "/o/": { "Ojo": "o", "Obvio": "o", "Otro": "o" },
    "/u/": { "Usar": "u", "Unidad": "u", "Uniforme": "u" },
    "/b/": { "Bailar": "b", "Baño": "b", "Bueno": "b" },
    "/ca/": { "Cantar": "ca", "Casa": "ca", "Caliente": "ca" },
    "/ci/": { "Cinco": "ci", "Ciudad": "ci", "Civil": "ci" },
    "/co/": { "Comida": "co", "Comer": "co", "Como": "co" },
    "/cc/": { "Acceder": "cc", "Accesorio": "cc", "Accidente": "cc" },
    "/cu/": { "Cura": "cu", "Cuero": "cu", "Cuando": "cu" },
    "/ch/": { "Chico": "ch", "Chorizo": "ch", "Chiste": "ch" },
    "/d/": { "Dios": "d", "Deseo": "d", "Dedicado": "d" },
    "/f/": { "Fuego": "f", "Familia": "f", "Frío": "f" },
    "/g/": { "Gato": "g", "Grande": "g", "Generoso": "g" },
    "/gue/": { "Guerra": "gue", "Gueto": "gue", "Guerrero": "gue" },
    "/gui/": { "Seguir": "gui", "Conseguir": "gui", "Distinguido": "gui" },
    "/güe/": { "Güero": "güe", "Güey": "güe", "Vergüenza": "güe" },
    "/güi/": { "Güira": "güi", "Pingüino": "güi", "Lingüista": "güi" },
    "/j/": { "Juego": "j", "Bajo": "j", "Mejor": "j" },
    "/k/": { "Kilómetro": "k", "Kiwi": "k", "Chakal": "k" },
    "/l/": { "Luz": "l", "Alma": "l", "Sol": "l" },
    "/ll/": { "Llanto": "ll", "Caballo": "ll", "Bello": "ll" },
    "/m/": { "Mano": "m", "Hambre": "m", "Mundo": "m" },
    "/n/": { "Nombre": "n", "Camino": "n", "Pan": "n" },
    "/ñ/": { "Niño": "ñ", "Señor": "ñ", "Piñata": "ñ" },
    "/p/": { "Padre": "p", "Compañero": "p", "Pero": "p" },
    "/que/": { "Queso": "que", "Quema": "que", "Querer": "que" },
    "/qui/": { "Quieto": "qui", "Quitar": "qui", "Tranquilo": "qui" },
    "/r/": { "Carne": "r", "Caro": "r", "Puerta": "r" },
    "/rr/": { "Carro": "rr", "Perro": "rr", "Herrero": "rr" },
    "/s/": { "Sopa": "s", "Fresa": "s", "Mes": "s" },
    "/t/": { "Taco": "t", "Pato": "t", "Triste": "t" },
    "/y/": { "Yo": "y", "Rayos": "y", "Rey": "y" }
  };
  

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.temp = localStorage.getItem('earthDefenderBestScore');
    this.bestScore = this.temp ? parseInt(this.temp) : 0;
    this.temp = localStorage.getItem('earthDefenderBestStreak');
    this.bestStreak = this.temp ? parseInt(this.temp) : 0;
    this.temp = localStorage.getItem('earthDefenderBestTime');
    this.bestTime = this.temp ? parseInt(this.temp) : 0;

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
  
    if (!this.showInstructions) {
      this.initializeGame();
    }
  }

  hideInstructions(dontShowAgain: boolean): void {
    this.showInstructions = false;
    if (dontShowAgain) {
      localStorage.setItem('dontShowInstructionsED', 'true');
    }

    this.initializeGame();
  }

  initializeGame(): void {
    this.gameOver = false;
    this.timer = 0;
    this.missiles = [];
    this.explosion = null;
    this.showEarth = true;
    this.showMeteor = true;
    this.meteorPosition = 0;
    this.score = 0;
    this.streak = 0;
    this.longestStreak = 0;
    this.selectNewWord();
    this.generateOptions();
    this.startGameLoop();
  }

  startGameLoop(): void {
    this.gameOver = false;
    this.isDisabled = false;
    clearInterval(this.gameInterval);
    clearInterval(this.timerInterval);

    let modifier = 0.00021;

    const screenHeight = window.innerHeight;

    this.timer = 0;
    this.timerInterval = setInterval(() => {
      if (!this.gameOver) {
        this.timer++;
      }
    }, 1000);

    const modifierInterval = setInterval(() => {
      if (this.gameOver) {
        clearInterval(modifierInterval);
        return;
      }
      modifier += 0.00002;
    }, 5000);

    this.gameInterval = setInterval(() => {
      if (this.gameOver) {
          clearInterval(this.gameInterval);
          return;
      }
  
      this.meteorPosition += screenHeight * modifier;
  
      const meteorImg = document.querySelector('.meteor img') as HTMLElement;
      const earthImg = document.querySelector('.earth img') as HTMLElement;

      if (!meteorImg || !earthImg) return;

      const meteorRect = meteorImg.getBoundingClientRect();
      const earthRect = earthImg.getBoundingClientRect();

      if (
        meteorRect.bottom >= earthRect.top &&
        meteorRect.top < earthRect.bottom &&
        meteorRect.right > earthRect.left &&
        meteorRect.left < earthRect.right
      ) {
        console.log("earth-meteor collision");
        this.triggerExplosion(50, meteorRect.bottom, true);
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
  
    this.correctSound = sound;
    this.word = examples[Math.floor(Math.random() * examples.length)];
    this.matchPart = this.phonemeMatchMap[sound]?.[this.word] || '';
  
    this.updateFormattedWord();
  }
  

  updateFormattedWord(): void {
    const word = this.word;
    const match = this.matchPart;
  
    const index = word.toLowerCase().indexOf(match.toLowerCase());
  
    if (!match || index === -1) {
      this.wordParts = { before: word, highlight: '', after: '' };
      return;
    }
  
    this.wordParts = {
      before: word.slice(0, index),
      highlight: word.slice(index, index + match.length),
      after: word.slice(index + match.length)
    };
  }
  

  generateOptions(): void {
    if (!this.language.soundboard || !this.language.soundboard.examples) return;
  
    const allSounds = Object.keys(this.language.soundboard.examples);
    const incorrectOptions = allSounds.filter(s => s !== this.correctSound);
  
    const rawOptions = [
      this.correctSound,
      ...incorrectOptions.sort(() => 0.5 - Math.random()).slice(0, 3)
    ].sort(() => 0.5 - Math.random());
  
    this.options = rawOptions.map(opt => this.phoneticMap[opt] || opt);
  }
  

  selectAnswer(displayedSound: string): void {
    if (this.isDisabled || this.gameOver) return;
  
    const ipaSound = Object.keys(this.phoneticMap).find(
      key => this.phoneticMap[key] === displayedSound
    ) || displayedSound;
  
    if (ipaSound === this.correctSound) {
      this.score++;
      this.streak++;
      this.longestStreak = Math.max(this.longestStreak, this.streak);
      this.fireMissile();
      this.selectNewWord();
      this.generateOptions();
    } else {
      this.streak = 0;
      this.isDisabled = true;
      setTimeout(() => this.isDisabled = false, 1500);
    }
  }
  

  fireMissile(): void {
    if (this.gameOver) return;
  
    const earthElement = document.querySelector('.earth') as HTMLElement | null;
    const gameContainer = document.querySelector('.game-container') as HTMLElement | null;
    if (!earthElement || !gameContainer) {
      console.error("earth DNE");
      return;
    }
  
    const earthRect = earthElement.getBoundingClientRect();
    const containerRect = gameContainer.getBoundingClientRect();

    const screenHeight = window.innerHeight;
  
    const missileStartBottomPx = containerRect.height - (earthRect.top - containerRect.top);
    const missile = { id: this.missileIdCounter++, position: missileStartBottomPx };
    this.missiles.push(missile);
  
    this.launchSound.currentTime = 0;
    this.launchSound.play();
  
    this.cdr.detectChanges();
  
    setTimeout(() => {
      const missileElement = document.querySelector(`.missile:last-child`) as HTMLElement | null;
      if (!missileElement) {
        console.error("missile DNE");
        return;
      }
    
      const missileInterval = setInterval(() => {
        if (this.gameOver) {
          clearInterval(missileInterval);
          return;
        }
  
        missile.position += window.innerHeight * 0.04;
        missileElement.style.bottom = `${missile.position}px`;
  
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
  
          this.triggerExplosion(50, meteorRect.bottom - containerRect.top, false);
          this.missiles = this.missiles.filter(m => m.id !== missile.id);
          clearInterval(missileInterval);
  
          const pushback = screenHeight * 0.02;
          this.meteorPosition = Math.max(0, this.meteorPosition - pushback);
        }
      }, 30);
    }, 0);
  }
  

triggerExplosion(x: number, y: number, isEarthCollision: boolean = false): void {
  const explosionSize = isEarthCollision ? 500 : 80;

  this.explosion = { x, y, size: explosionSize };

  this.explosionSound.currentTime = 0;
  this.explosionSound.play();

  setTimeout(() => this.explosion = null, 2000);
}

endGame(): void {
  clearInterval(this.gameInterval);
  clearInterval(this.timerInterval);
  this.gameOver = true;
  this.isDisabled = true;
  this.missiles = [];

  if (this.score > this.bestScore) {
    this.bestScore = this.score;
    localStorage.setItem('earthDefenderBestScore', this.bestScore.toString());
  }

  if (this.longestStreak > this.bestStreak) {
    this.bestStreak = this.longestStreak;
    localStorage.setItem('earthDefenderBestStreak', this.bestStreak.toString());
  }

  if (this.timer > this.bestTime) {
    this.bestTime = this.timer;
    localStorage.setItem('earthDefenderBestTime', this.bestTime.toString());
  }
}

  restartGame(): void {
    this.initializeGame();
  }

  getSurvivedTime(): string {
    return this.language.earthDefender?.survivedTime?.replace('{{ timer }}', this.timer.toString());
  }
}
