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

  @ViewChild('lakePanel') lakePanelRef!: ElementRef;

  bobberPos: { x: number; y: number } | null = null;
  fishVisible = false;
  fishScale = 0.1;
  fishApproachInterval: any;
  fishPos: { x: number; y: number } | null = null;

  showPhoneticPrompt = false;
  phoneticOptions: string[] = [];
  correctPhonetic: string = '';
  correctWord: string = '';
  result: SpeechRecognitionResult | null = null;

  showFishingMenu = false;
  catchPercent = 0;
  barPosition = 50;
  fishIconPosition = 60;
  barInterval: any;

  caughtFishId: number | null = null;
  showSplash = false;
  fishCaught = 0;
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

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.languageService.getLanguage().then((lang) => {
      this.language = lang;
    });
  }

  onLakeClick(event: MouseEvent): void {
    if (this.showPhoneticPrompt || this.showFishingMenu) return;

    this.bobberPos = {
      x: event.clientX-20,
      y: event.clientY-20,
    };
    this.spawnFishShadow(event.clientX, event.clientY);
  }

  spawnFishShadow(x: number, y: number): void {
    if (!this.bobberPos) return;
  
    this.fishScale = 0.01;
    this.fishVisible = true;
  
    const lakeRect = this.lakePanelRef.nativeElement.getBoundingClientRect();
    const bobberX = this.bobberPos.x;
    const bobberY = this.bobberPos.y;
  
    const distTop = bobberY;
    const distBottom = lakeRect.height - bobberY;
    const distLeft = bobberX;
    const distRight = lakeRect.width - bobberX;
  
    const minDist = Math.min(distTop, distBottom, distLeft, distRight);
    const offsetRatio = 0.15; // 15% of container size
    let dir: 'up' | 'down' | 'left' | 'right';
  
    if (minDist === distTop) dir = 'down';
    else if (minDist === distBottom) dir = 'up';
    else if (minDist === distLeft) dir = 'right';
    else dir = 'left';
  
    const offsetX = lakeRect.width * offsetRatio;
    const offsetY = lakeRect.height * offsetRatio;
  
    switch (dir) {
      case 'up':
        this.fishPos = { x, y: y - offsetY };
        break;
      case 'down':
        this.fishPos = { x, y: y + offsetY };
        break;
      case 'left':
        this.fishPos = { x: x - offsetX, y };
        break;
      case 'right':
        this.fishPos = { x: x + offsetX, y };
        break;
    }
  
    this.fishApproachInterval = setInterval(() => {
      if (!this.fishPos || !this.bobberPos) return;
    
      const speed = 2;
    
      if (this.fishPos.x !== this.bobberPos.x) {
        const dx = this.bobberPos.x - this.fishPos.x;
        if (Math.abs(dx) <= speed) {
          this.fishPos.x = this.bobberPos.x;
        } else {
          this.fishPos.x += Math.sign(dx) * speed;
        }
      } else if (this.fishPos.y !== this.bobberPos.y) {
        const dy = this.bobberPos.y - this.fishPos.y;
        if (Math.abs(dy) <= speed) {
          this.fishPos.y = this.bobberPos.y;
        } else {
          this.fishPos.y += Math.sign(dy) * speed;
        }
      }
    
      this.fishScale += 0.005;
      console.log(this.fishPos.x, this.fishPos.y);
    
      if (
        this.fishPos.x === this.bobberPos.x &&
        this.fishPos.y === this.bobberPos.y
      ) {
        clearInterval(this.fishApproachInterval);
        this.promptPhonetic();
      }
    }, 30);
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
    try {
      this.result = await this.speechService.detectSpeech(2);
      const spokenWords = this.result?.words?.map(w =>
        w.toLowerCase().replace(/[.,!?;:]/g, '')
      ) || [];
      console.log(spokenWords);
  
      //Make a map of homophones and make it correct of the spoken word matches the correct answer's homophone map

      if (spokenWords.includes(this.correctWord.toLowerCase())) {
        this.startFishingMenu();
      } else {
        this.fishGotAway();
      }
    } catch {
      this.fishGotAway();
    } finally {
      this.awaitingSpeech = false;
      this.preSpeechMessage = '';
    }
  }

  fishGotAway(): void {
    this.resetState();
  }

  startFishingMenu(): void {
    this.showPhoneticPrompt = false;
    this.showFishingMenu = true;
    this.catchPercent = 0;
    this.barPosition = 50;
    this.fishIconPosition = 60;
    this.caughtFishId = null;
    this.startCatchLoop();
  }

  startCatchLoop(): void {
    this.isCatching = true;
    this.barInterval = setInterval(() => {
      if (!this.isHolding) this.barPosition += 1;
      else this.barPosition -= 1;

      this.barPosition = Math.max(0, Math.min(100, this.barPosition));

      if (
        this.barPosition > this.fishIconPosition - 10 &&
        this.barPosition < this.fishIconPosition + 10
      ) {
        this.catchPercent += 1;
        if (this.catchPercent >= 100) this.catchFish();
      } else {
        this.catchPercent = Math.max(0, this.catchPercent - 1);
      }
    }, 50);
  }

  catchFish(): void {
    clearInterval(this.barInterval);
    this.showFishingMenu = false;
    this.showSplash = true;
  
    setTimeout(() => {
      this.showSplash = false;
      this.caughtFishId = Math.floor(Math.random() * 5) + 1;
      this.fishCaught++;
      setTimeout(() => {
        this.caughtFishId = null;
      }, 2000); // 🕒 hide caught fish after 2s
      this.resetState(true);
    }, 1000);
  }

  onHoldStart(): void {
    this.isHolding = true;
  }

  onHoldEnd(): void {
    this.isHolding = false;
  }

  resetState(preserveFishCount = false): void {
    clearInterval(this.fishApproachInterval);
    clearInterval(this.barInterval);
    this.bobberPos = null;
    this.fishVisible = false;
    this.showPhoneticPrompt = false;
    this.showFishingMenu = false;
    this.catchPercent = 0;
    this.barPosition = 50;
    this.fishIconPosition = 60;
    this.result = null;
    if (!preserveFishCount) this.fishCaught = 0;
  }
}
