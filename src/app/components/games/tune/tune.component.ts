import { Component, inject, ViewChild, ElementRef } from '@angular/core'; 
import { NavbarComponent } from '../../navbar/navbar.component';
import { LanguageService } from '../../../services/language.service';
import { SpeechService } from '../../../services/speech.service';
import { DatabaseService } from '../../../services/database.service';
import { AuthService } from '../../../services/auth.service';
import * as english from '../../../utils/english.json'
import pairs from './game-assets/pairs.json';
import { CommonModule } from '@angular/common';

interface Question {
  word: string;
  correctSound: string;
  wrongSound: string;
}

@Component({
  selector: 'app-tune',
  standalone: true,
  imports: [NavbarComponent, CommonModule],
  templateUrl: './tune.component.html',
  styleUrl: './tune.component.sass'
})
export class TuneComponent {
  languageService = inject(LanguageService);
  speechService = inject(SpeechService);
  databaseService = inject(DatabaseService);
  authService = inject(AuthService);
  
  pairs = pairs;
  userLanguage = english;
  isAdmin = false;
  generationStatus = "";
  feedback = "";

  async ngOnInit(): Promise<void> {
    this.userLanguage = await this.languageService.getLanguage();
    this.isAdmin = await this.authService.isAdmin();
  }

  isEnglish() {
    return JSON.stringify(this.userLanguage) === JSON.stringify(english);
  }

  // Screen data
  menuActive = true;
  gameActive = false;
  summaryActive = false;

  // Game data
  pointsEarned = 0;
  questionsPerGame = 5;
  questions: Question[] = [];
  currentQuestion: Question = {
    word: "",
    correctSound: "",
    wrongSound: ""
  };
  questionTime = 5;
  displayedTime = 5;
  responded = false;
  randomizer = Math.random();
  firstChoiceCorrect = this.randomizer > 0.5;
  selected = false;

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

  async startGame(pair: any) {
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
  
    while(this.questionsPerGame > 0) {
      await this.loadNextQuestion();
      this.questionsPerGame = this.questionsPerGame - 1;
    }

    this.pointsEarned = Math.round(this.pointsEarned);
    this.gameActive = false;
    this.summaryActive = true;
  }

  async loadNextQuestion() {
    // Load question and reset config
    this.currentQuestion = this.questions[0];
    this.responded = false;
    this.randomizer = Math.random();
    this.firstChoiceCorrect = this.randomizer > 0.5;

    // Play audio
    if (this.isEnglish()) {
      await this.playWord("english", this.currentQuestion.word);
    } else {
      await this.playWord("spanish", this.currentQuestion.word);
    }

    // Timer
    while (this.questionTime > 0) {
      await this.wait(0.1);
      this.questionTime -= 0.1;
      this.displayedTime = Math.ceil(Math.min(this.questionTime, this.displayedTime));
    }

    // Remove question and reset time
    this.questionTime = 7.0;
    this.displayedTime = 5.0;
    this.questions = this.questions.slice(1);
  }

  processResponse(choice: string) {
    if (!this.responded && choice == 'correct') {
      const timeMultiplier = Math.min(5.0, this.questionTime);
      this.pointsEarned += (timeMultiplier * 100);
      this.feedback = 'Great job! 🌟';
    } else {
      this.feedback = 'Try again! 💪';
    }
    this.responded = true;
  }

  async generateAudios() {
    this.generationStatus = "Starting...";
    for (let pair of pairs) {
      for (let sound of pair.choices) {
        // Generate english words
        for (let word of sound.english_words) {
          const path = `audios/english/games/tune/${word}.mp3`;
          let audioGenerated = await this.databaseService.fileExists(path);
          if (false) {
            this.generationStatus = word + ".mp3 already exists.";
          } else {
            this.generationStatus = "Generating " + word + ".mp3";
            await this.speechService.generateAudio(word, "english", `/games/tune/${word}`);
          }
        }

        // Generate spanish words
        for (let word of sound.spanish_words) {
          const path = `audios/spanish/games/tune/${word}.mp3`;
          let audioGenerated = await this.databaseService.fileExists(path);
          if (false) {
            this.generationStatus = word + ".mp3 already exists.";
          } else {
            this.generationStatus = "Generating " + word + ".mp3";
            await this.speechService.generateAudio(word, "spanish", `/games/tune/${word}`);
          }
        }
      }
    }
    this.generationStatus = "Finished.";
  }

  async playWord(language: string, word: string) {
    await this.speechService.start(language, `games/tune/${word}`);
  }

  wait(seconds: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
  }
}