import { Component, inject } from '@angular/core'; 
import { NavbarComponent } from '../../navbar/navbar.component';
import { LanguageService } from '../../../services/language.service';
import { SpeechService } from '../../../services/speech.service';
import * as english from '../../../utils/english.json'
import pairs from './assets/pairs.json';

interface Question {
  word: string;
  correctSound: string;
  wrongSound: string;
}

@Component({
  selector: 'app-tune',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './tune.component.html',
  styleUrl: './tune.component.sass'
})
export class TuneComponent {
  languageService = inject(LanguageService);
  speechService = inject(SpeechService);
  
  pairs = pairs;
  userLanguage = english;

  async ngOnInit(): Promise<void> {
    this.userLanguage = await this.languageService.getLanguage();
  }

  isEnglish() {
    return JSON.stringify(this.userLanguage) === JSON.stringify(english);
  }

  // Screen data
  menuActive = true;
  gameActive = false;
  summaryActive = false;

  // Game data
  questionsPerGame = 10;
  questions: Question[] = [];
  currentQuestion: Question = {
    word: "",
    correctSound: "",
    wrongSound: ""
  };

  generateQuestion(pair: any): Question | null {
    if (!pair.choices || pair.choices.length < 2) {
      return null;
    }
  
    const isFirstCorrect = Math.random() < 0.5;
    const correctChoice = isFirstCorrect ? pair.choices[0] : pair.choices[1];
    const wrongChoice = isFirstCorrect ? pair.choices[1] : pair.choices[0];
    let word = "";
  
    if (this.isEnglish()) {
      word = correctChoice.english_words[Math.floor(Math.random() * correctChoice.english_words.length)];
    } else {
      word = correctChoice.spanish_words[Math.floor(Math.random() * correctChoice.spanish_words.length)];
    }
  
    return {
      word,
      correctSound: correctChoice.sound,
      wrongSound: wrongChoice.sound
    };
  }

  startGame(pair: any) {
    this.menuActive = false;
    this.gameActive = true;
  
    // Generate questions
    this.questions = [];
    const usedWords = new Set<string>();
    while (this.questions.length < this.questionsPerGame) {
      const question = this.generateQuestion(pair);
      
      if (question && !usedWords.has(question.word)) {
        this.questions.push(question);
        usedWords.add(question.word);
      }
    }
  
    this.loadNextQuestion();
    console.log(this.currentQuestion);
  }

  async loadNextQuestion() {
    // If no questions left, finish game and open summary
    if (this.questions.length === 0) {
      this.gameActive = false;
      this.summaryActive = true;
      return;
    }

    // Load next question and delete previous question
    this.currentQuestion = this.questions[0];
    this.questions = this.questions.slice(1);

    // Play sound
    // this.speechService.start(this.currentQuestion.word);
  }
}