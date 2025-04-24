//homophone map
import { Component, inject, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../../services/language.service';
import { SpeechService, SpeechRecognitionResult } from '../../../services/speech.service';

@Component({
  selector: 'app-fishing',
  standalone: true,
  imports: [NavbarComponent, RouterModule, CommonModule],
  templateUrl: './fishing.component.html',
  styleUrl: './fishing.component.sass',
})
export class FishingComponent implements OnInit {
  languageService = inject(LanguageService);
  speechService = inject(SpeechService);
  language: any;
  showInstructions: boolean | null = null;
  showDurationMenu = true;
  selectedDuration = 100;

  @ViewChild('lakePanel') lakePanelRef!: ElementRef;
  @ViewChild('bobber') bobberRef!: ElementRef;
  @ViewChild('fishShadow') fishRef!: ElementRef;

  timeLeft: number = 100;
  gameTimer: any;
  isFishApproaching = false;
  bobberPos: { x: number; y: number } | null = null;
  bobberSize: number = 30;
  bobberCollided = false;
  fishVisible = false;
  fishScale = 1;
  fishDirection: 'up' | 'down' | 'left' | 'right' = 'right';
  fishApproachInterval: any;
  fishPos: { x: number; y: number } | null = null;

  showPhoneticPrompt = false;
  phoneticOptions: string[] = [];
  correctPhonetic: string = '';
  correctWord: string = '';
  result: SpeechRecognitionResult | null = null;
  isListening = false;

  showFishingMenu = false;
  gameOver = false;
  catchPercent = 0;
  barPosition = 50;
  fishIconPosition = 60;
  barInterval: any;
  fishMoveInterval: any;
  fishMovePattern: number = Math.floor(Math.random() * 4);


  caughtFishId: number | null = null;
  caughtFishSize: number = 100;
  caughtFishPos: { x: number; y: number } | null = null;
  showSplash = false;
  splashPos: { x: number; y: number } | null = null;
  fishCaught = 0;
  bestFishCaught = 0;
  isCatching = false;
  isHolding = false;
  holdInterval: any;
  dropInterval: any;

  awaitingSpeech = false;
  preSpeechMessage = '';

  matchPart: string = '';
  wordParts: { before: string; highlight: string; after: string } = {
    before: '',
    highlight: '',
    after: '',
  };

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
    "/ɪ/": { "Into": "I", "Gift": "i" },
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
    "sh": { "Shape": "Sh", "Fish": "sh" },
    "t": { "Take": "T", "Stop": "t", "Lost": "t" },
    "th": { "Thank": "Th", "Healthy": "th", "Bath": "th" },
    "v": { "View": "V", "Even": "v", "Save": "v" },
    "w": { "Won": "W", "Swim": "w", "Away": "w" },
    "y": { "Year": "Y", "Yet": "Y", "Yellow": "Y" },
    "z": { "Zoo": "Z", "Busy": "s", "His": "s" },
    "zh": { "Measure": "su", "Vision": "si", "Massage": "ge" },

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

  homophones: Record<string, string[]> = {
    "seem": ["seam"],
    "eye": ["i", "aye"],
    "sky": ["skye"],
    "i": ["eye", "aye"],
    "not": ["knot"],
    "you": ["u"],
    "our": ["hour"],
    "are": ["r"],
    "berry": ["barry"],
    "hand": ["hande"],
    "how": ["hau", "hau", "howe"],
    "cat": ["kat", "catt", "katt", "catte"],
    "luck": ["luk", "lucke"],
    "feel": ["feil", "fiel", "foell"],
    "rain": ["rein", "raign", "reine", "reign"],
    "single": ["cingle", "singel"],
    "page": ["paige"],
    "raise": ["rays", "raze", "rayes"],
    "copy": ["kopy", "coppi", "copie", "coppie"],
    "nice": ["nyce", "neice", "gneiss", "niess"],
    "fish": ["fisch", "phish"],
    "won": ["one", "wonne"],
    "vision": ["visione"],
  };

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.languageService.getLanguage().then((lang) => {
      this.language = lang;
    });
    const hide = localStorage.getItem('hideInstructions');
    this.showInstructions = !(hide === 'true');
  }

  hideInstructions(dontShow: boolean): void {
    if (dontShow) {
      localStorage.setItem('hideInstructions', 'true');
    }
    this.showInstructions = false;
  }
  
  startGameWithDuration(seconds: number): void {
    this.selectedDuration = seconds;
    this.timeLeft = seconds;
    this.showDurationMenu = false;
  
    const saved = localStorage.getItem(`bestFishCaught_${this.selectedDuration}`);
    this.bestFishCaught = parseInt(saved || '0');

    if (!this.showInstructions) {
      this.startGameTimer();
    }
  }

  startGameTimer(): void {
    this.gameTimer = setInterval(() => {
      this.timeLeft--;
  
      if (this.timeLeft <= 0) {
        this.gameOver = true;
      }
    }, 1000);
  }
  

  onLakeClick(event: MouseEvent): void {
    if (this.showPhoneticPrompt || this.showFishingMenu || this.isFishApproaching) return;
  
    const lakeRect = this.lakePanelRef.nativeElement.getBoundingClientRect();
    this.bobberSize = lakeRect.width * 0.04;
    this.caughtFishSize = lakeRect.width * 0.08;

    this.bobberPos = {
      x: event.clientX,
      y: event.clientY,
    };
  
    this.spawnFishShadow(event.clientX, event.clientY);
  }

  spawnFishShadow(x: number, y: number): void {
    if (!this.bobberPos) return;

    this.isFishApproaching = true;

    const lakeMaskEl = this.lakePanelRef.nativeElement;
    const lakeRect = lakeMaskEl.getBoundingClientRect();
  
    const bobberX = x;
    const bobberY = y;
  
    const lakeCenterX = lakeRect.left + lakeRect.width / 2;
    const lakeCenterY = lakeRect.top + lakeRect.height / 2;
  
    const offset = 0.3;
    let dir: 'up' | 'down' | 'left' | 'right';
  
    const dx = bobberX - lakeCenterX;
    const dy = bobberY - lakeCenterY;
  
    if (Math.abs(dx) > Math.abs(dy)) {
      dir = dx < 0 ? 'right' : 'left';
    } else {
      dir = dy < 0 ? 'down' : 'up';
    }

    this.fishDirection = dir;
    console.log("Bobber Position:", x, y);
    console.log(dir);

    let fishStartX = x;
    let fishStartY = y;
  
    switch (dir) {
      case 'up':
        fishStartY = fishStartY - lakeRect.height * offset;
        break;
      case 'down':
        fishStartY = fishStartY + lakeRect.height * offset;
        break;
      case 'left':
        fishStartX = fishStartX - lakeRect.width * offset;
        break;
      case 'right':
        fishStartX = fishStartX + lakeRect.width * offset;
        break;
    }

    
    this.fishPos = {
      x: fishStartX-15,
      y: fishStartY-15,
    };
      
    this.fishScale = 0.01;
    this.fishVisible = true;

    console.log("Fish Position:", this.fishPos);
  
    this.fishApproachInterval = setInterval(() => {
      const fishEl = this.fishRef?.nativeElement;
      const bobberEl = this.bobberRef?.nativeElement;
    
      if (!fishEl || !bobberEl) return;
    
      const fishRect = fishEl.getBoundingClientRect();
      const bobberRect = bobberEl.getBoundingClientRect();
    
      const collided =
        fishRect.left < bobberRect.right &&
        fishRect.right > bobberRect.left &&
        fishRect.top < bobberRect.bottom &&
        fishRect.bottom > bobberRect.top;
    
      if (collided) {
        clearInterval(this.fishApproachInterval);
        this.bobberCollided = true;
        this.isFishApproaching = false;
        this.promptPhonetic();
        return;
      }
    
      if (!this.fishPos || !this.bobberPos) return;
    
      const dx = this.bobberPos.x - this.fishPos.x;
      const dy = this.bobberPos.y - this.fishPos.y;
    
      const lakeRect = this.lakePanelRef.nativeElement.getBoundingClientRect();
      const stepRatio = 0.004;
    
      const step = (this.fishDirection === 'up' || this.fishDirection === 'down')
        ? lakeRect.height * stepRatio
        : lakeRect.width * stepRatio;
    
      if (this.fishDirection === 'up' || this.fishDirection === 'down') {
        this.fishPos.y += Math.sign(dy) * step;
      } else {
        this.fishPos.x += Math.sign(dx) * step;
      }
    
      this.fishScale += 0.015;
    }, 30);
    
  }

getFishRotation(): string {
  switch (this.fishDirection) {
    case 'down': return 'rotate(-90deg)';
    case 'up': return 'rotate(90deg)';
    case 'right': return 'rotate(180deg)';
    case 'left': return 'rotate(0deg)';
  }
}


  promptPhonetic(): void {
    const sounds = this.language.soundboard.examples;
    const keys = Object.keys(sounds);
    this.correctPhonetic = keys[Math.floor(Math.random() * keys.length)];
    const exampleWords = sounds[this.correctPhonetic];
    this.correctWord = exampleWords[Math.floor(Math.random() * exampleWords.length)];
    this.matchPart = this.phonemeMatchMap[this.correctPhonetic]?.[this.correctWord] || '';
    this.updateFormattedWord();

    const options = [this.correctPhonetic];
    while (options.length < 4) {
      const random = keys[Math.floor(Math.random() * keys.length)];
      if (!options.includes(random)) options.push(random);
    }
    this.phoneticOptions = options.sort(() => Math.random() - 0.5);
    this.showPhoneticPrompt = true;
  }

  getDisplayOption(opt: string): string {
    return this.phoneticMap[opt] || opt;
  }

  updateFormattedWord(): void {
    const word = this.correctWord;
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

  async selectOption(option: string): Promise<void> {
    if (option !== this.correctPhonetic) return this.fishGotAway();
  
    this.awaitingSpeech = true;
    this.preSpeechMessage = `Correct! When you're ready, click the microphone and say "${this.correctWord}"`;
  }
  
  async startSpeechRecognition(): Promise<void> {
    if (this.isListening) return;

    this.isListening = true;
    try {
      this.result = await this.speechService.detectSpeech(2);
      const spokenWords = this.result?.words?.map(w => w.toLowerCase()) || [];
  
      const allCorrectWords = [this.correctWord.toLowerCase(), ...this.getHomophones(this.correctWord)];

      if (spokenWords.some(word => allCorrectWords.includes(word))) {
        this.startFishingMenu();
      } else {
        this.fishGotAway();
      }
    } catch {
      this.fishGotAway();
    } finally {
      this.awaitingSpeech = false;
      this.preSpeechMessage = '';
      this.isListening = false;
    }
  }

  fishGotAway(): void {
    this.resetState();
  }

  getHomophones(word: string): string[] {
    const matches = Object.entries(this.homophones)
      .filter(([key, list]) => key === word || list.includes(word))
      .flatMap(([key, list]) => [key, ...list]);
  
    return Array.from(new Set(matches.map(w => w.toLowerCase())));
  }

  startFishingMenu(): void {
    this.showPhoneticPrompt = false;
    this.showFishingMenu = true;
    this.catchPercent = 20;
    this.barPosition = 50;
    this.fishIconPosition = 60;
    this.caughtFishId = null;
    this.startCatchLoop();
  }

  startCatchLoop(): void {
    this.isCatching = true;
  
    this.fishMovePattern = Math.floor(Math.random() * 4);
    console.log(this.fishMovePattern);
  
    this.barInterval = setInterval(() => {
      if (!this.isHolding) this.barPosition += 1;
      else this.barPosition -= 1;
    
      const barHeightPercent = 20; 
      this.barPosition = Math.max(0, Math.min(100 - barHeightPercent, this.barPosition));
    
      const barEl = document.querySelector('.bar') as HTMLElement;
      const targetEl = document.querySelector('.target-fish') as HTMLElement;
    
      if(this.catchPercent <= 0)
        this.fishGotAway();
    
      if (barEl && targetEl) {
        const barRect = barEl.getBoundingClientRect();
        const targetRect = targetEl.getBoundingClientRect();
    
        const overlap =
          barRect.top < targetRect.bottom &&
          barRect.bottom > targetRect.top;
    
        if (overlap) {
          this.catchPercent += 1;
          if (this.catchPercent >= 100) this.catchFish();
        } else {
          this.catchPercent = Math.max(0, this.catchPercent - 2);
        }
      }
    }, 50);
    
  
    this.fishMoveInterval = setInterval(() => {
      let move = 0;
      const pattern = this.fishMovePattern;
      const rand = Math.random();
      
      const fastAmount = Math.random() * 3 + 2;
      const slowAmount = Math.random() * 1 + 0.5;
    
      switch (pattern) {
        case 0:
          if (rand < 0.55) {
            move = (Math.random() < 0.5 ? -1 : 1) * slowAmount;
          }
          break;
    
        case 1:
          move = (Math.random() < 0.5 ? -1 : 1) * slowAmount;
          break;
    
        case 2:
          if (rand < 0.65) {
            move = (Math.random() < 0.5 ? -1 : 1) * fastAmount;
          }
          break;
    
        case 3:
          move = (Math.random() < 0.5 ? -1 : 1) * fastAmount;
          break;
      }
    
      this.fishIconPosition = Math.max(0, Math.min(100, this.fishIconPosition + move));
    }, 50);
  }
  
  

  catchFish(): void {
    clearInterval(this.barInterval);
    clearInterval(this.fishMoveInterval);
    this.showFishingMenu = false;
    this.fishVisible = false;
    this.showSplash = true;
  
    if (this.bobberPos) {
      this.splashPos = { ...this.bobberPos };
      this.caughtFishPos = { ...this.bobberPos };
    }
    this.bobberPos = null;
    
    this.isFishApproaching = true;

    setTimeout(() => {
      this.showSplash = false;
      this.caughtFishId = Math.floor(Math.random() * 5) + 1;
      this.fishCaught++;

      const currentProgress = Number(localStorage.getItem('fishingGameProgress')) || 0;
      localStorage.setItem('fishingGameProgress', String(currentProgress + 1));
      const bestKey = `bestFishCaught_${this.selectedDuration}`;
      if (this.fishCaught > this.bestFishCaught) {
        this.bestFishCaught = this.fishCaught;
        localStorage.setItem(bestKey, String(this.fishCaught));
      }
      
      setTimeout(() => {
        this.caughtFishId = null;
        this.isFishApproaching = false;
      }, 2000);
      this.resetState(true);
    }, 1000);
  }
  

  onHoldStart(): void {
    this.isHolding = true;
  }

  onHoldEnd(): void {
    this.isHolding = false;
  }

  resetState(preserveFishCount = true): void {
    clearInterval(this.fishApproachInterval);
    clearInterval(this.barInterval);
    clearInterval(this.fishMoveInterval);
    this.bobberPos = null;
    this.bobberCollided = false;
    this.fishVisible = false;
    this.showPhoneticPrompt = false;
    this.showFishingMenu = false;
    this.catchPercent = 0;
    this.barPosition = 50;
    this.fishIconPosition = 60;
    this.result = null;
    if (!preserveFishCount) this.fishCaught = 0;
    if (!preserveFishCount) this.timeLeft = 100;
  }

  restartGame(): void {
    clearInterval(this.gameTimer);
    this.gameOver = false;
    this.timeLeft = this.selectedDuration;
    this.resetState(false);
    this.startGameTimer();
  }
}
