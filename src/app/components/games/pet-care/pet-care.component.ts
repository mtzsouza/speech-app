import { Component, inject, OnInit } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { SpeechService } from '../../../services/speech.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { LanguageService } from '../../../services/language.service';
import * as english from '../../../utils/english.json'

interface Position {
  x: number;
  y: number;
}

type ObjectKey = 'food' | 'water' | 'toy' | 'bed';

interface DogCommand {
  action: string;
  messageKey: string;
  target?: ObjectKey;
  animation?: string;
}

interface Translations {
  [key: string]: any;
}

@Component({
  selector: 'app-pet-care',
  standalone: true,
  imports: [NavbarComponent, CommonModule],
  templateUrl: './pet-care.component.html',
  styleUrl: './pet-care.component.sass'
})
export class PetCareComponent implements OnInit {
  private http = inject(HttpClient);
  speechService = inject(SpeechService);
  languageService = inject(LanguageService);

  language: 'en' | 'es' = 'en';
  translations: Translations = {};

  isRecording = false;
  feedbackMessage = '';
  dogAction = '';
  dogMood = 'happy';
  stars = 0;
  currentPrompt = '';
  consecutiveMisses = 0;
  showCongratulations = false;

  roomWidth = 900;
  roomHeight = 600;

  dogPosition: Position = { x: 50, y: 50 };
  isMoving = false;

  objectPositions: Record<ObjectKey, Position> = {
    food: { x: 20, y: 70 },
    water: { x: 80, y: 70 },
    toy: { x: 50, y: 30 },
    bed: { x: 20, y: 30 }
  };

  commands: Record<string, DogCommand> = {
    'drink water': { 
      action: 'move', 
      target: 'water',
      messageKey: 'drinkWater',
      animation: 'drink'
    },
    'eat food': { 
      action: 'move', 
      target: 'food',
      messageKey: 'eatFood',
      animation: 'eat'
    },
    'play fetch': { 
      action: 'move', 
      target: 'toy',
      messageKey: 'playFetch',
      animation: 'play'
    },
    'go sleep': { 
      action: 'move', 
      target: 'bed',
      messageKey: 'goSleep',
      animation: 'sleep'
    },
    'jump high': { 
      action: 'jump', 
      messageKey: 'jumpHigh',
      animation: 'jump'
    },
    'spin around': { 
      action: 'spin', 
      messageKey: 'spinAround',
      animation: 'spin'
    },
    'lie down': { 
      action: 'lie', 
      messageKey: 'lieDown',
      animation: 'lie'
    },
    'shake hand': { 
      action: 'shake', 
      messageKey: 'shakeHand',
      animation: 'shake'
    },
    'roll over': { 
      action: 'roll', 
      messageKey: 'rollOver',
      animation: 'roll'
    },
    'bark loud': { 
      action: 'bark', 
      messageKey: 'barkLoud',
      animation: 'bark'
    }
  };  

  spanishCommandMap: Record<string, string> = {
    'beber agua': 'drink water',
    'comer comida': 'eat food',
    'jugar a buscar': 'play fetch',
    'ir a dormir': 'go sleep',
    'saltar alto': 'jump high',
    'girar en circulos': 'spin around',
    'echarse': 'lie down',
    'dar la pata': 'shake hand',
    'darse la vuelta': 'roll over',
    'ladrar fuerte': 'bark loud'
  };

  async ngOnInit(): Promise<void> {
    const userLanguage = await this.languageService.getLanguage();
    if (JSON.stringify(userLanguage) !== JSON.stringify(english)) {
      this.language = 'es';
    }

    this.loadTranslations().subscribe(() => {
      this.generateNewPrompt();
    });
  }

  loadTranslations() {
    return this.http.get('assets/pet-care.json').pipe(
      map((translations: any) => {
        this.translations = translations;
        return translations;
      })
    );
  }

  getTranslation(key: string, params?: Record<string, any>): string {
    const keys = key.split('.');
    let current = this.translations[this.language];

    for (const k of keys) {
      current = current?.[k];
      if (current === undefined) return key;
    }

    if (params && typeof current === 'string') {
      for (const [param, value] of Object.entries(params)) {
        current = current.replace(`{{${param}}}`, value.toString());
      }
    }

    return current || key;
  }

  async startRecording(): Promise<void> {
    if (this.isRecording || this.isMoving) return;

    this.isRecording = true;
    this.feedbackMessage = this.getTranslation('listening');

    try {
      const result = await this.speechService.detectSpeech(2);
      this.processCommand(result.text, result.words);
    } catch (error) {
      console.error('Speech recognition failed:', error);
      this.feedbackMessage = this.getTranslation('notUnderstood', {
        text: '',
        prompt: this.currentPrompt
      });
    } finally {
      this.isRecording = false;
    }
  }

  processCommand(text: string, words: string[]): void {
    text = text.toLowerCase().trim().replace(/[.,!?;:]+$/, '');

    // Translate Spanish phrase to English if it exists
    const translated = this.spanishCommandMap[text] || text;

    let commandFound = false;

    for (const [phrase, response] of Object.entries(this.commands)) {
      if (translated === phrase) {
        this.executeAction(response);
        commandFound = true;
        this.handleCorrectCommand();
        break;
      }
    }

    if (!commandFound) {
      this.feedbackMessage = this.getTranslation('notUnderstood', {
        text: text,
        prompt: this.currentPrompt
      });
      this.handleIncorrectCommand();
    }
  }

  async executeAction(response: DogCommand): Promise<void> {
    this.feedbackMessage = this.getTranslation(`dogMessages.${response.messageKey}`);

    if (response.action === 'move' && response.target) {
      await this.moveDogToObject(response.target, response.animation);
    } else {
      this.dogAction = response.animation || response.action;
      setTimeout(() => this.dogAction = '', 2000);
    }
  }

  async moveDogToObject(target: ObjectKey, animation?: string): Promise<void> {
    this.isMoving = true;
    const targetPos = this.objectPositions[target];
    const steps = 30;
    const dx = (targetPos.x - this.dogPosition.x) / steps;
    const dy = (targetPos.y - this.dogPosition.y) / steps;

    for (let i = 0; i < steps; i++) {
      this.dogPosition.x += dx;
      this.dogPosition.y += dy;
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    if (animation) {
      this.dogAction = animation;
      await new Promise(resolve => setTimeout(resolve, 2000));
      this.dogAction = '';
    }

    this.isMoving = false;
  }

  generateNewPrompt(): void {
    const commandList = Object.keys(this.commands);
    const randomIndex = Math.floor(Math.random() * commandList.length);
    const messageKey = this.commands[commandList[randomIndex]].messageKey;
    this.currentPrompt = this.getTranslation(`commands.${messageKey}`);
    this.feedbackMessage = this.currentPrompt;
  }

  handleCorrectCommand(): void {
    this.stars++;
    this.consecutiveMisses = 0;

    if (this.stars >= 5) {
      this.showCongratulations = true;
    } else {
      setTimeout(() => this.generateNewPrompt(), 2000);
    }
  }

  handleIncorrectCommand(): void {
    this.consecutiveMisses++;
    if (this.consecutiveMisses >= 2) {
      setTimeout(() => {
        this.generateNewPrompt();
        this.consecutiveMisses = 0;
      }, 2000);
    }
  }

  restartGame(): void {
    this.stars = 0;
    this.consecutiveMisses = 0;
    this.showCongratulations = false;
    this.generateNewPrompt();
    this.dogPosition = { x: 50, y: 50 };
    this.dogAction = '';
  }

  setLanguage(lang: 'en' | 'es'): void {
    this.language = lang;
    this.generateNewPrompt();
  }
}