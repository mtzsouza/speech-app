import { Component, inject, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NavbarComponent } from '../../navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SpeechService, SpeechRecognitionResult } from '../../../services/speech.service';

@Component({
  selector: 'app-speech-walk',
  standalone: true,
  imports: [NavbarComponent, RouterModule, CommonModule],
  templateUrl: './speech-walk.component.html',
  styleUrl: './speech-walk.component.sass',
})
export class SpeechWalkComponent implements OnInit {
  private speechService = inject(SpeechService);
  private sanitizer = inject(DomSanitizer);

  currentText: SafeHtml = '';
  isListening = false;
  isCheckpoint = false;
  currentIndex = 0;
  lives = 3;
  currentProgress = 0;
  characterState: 'standing' | 'running' = 'standing';
  feedbackClass = '';

  story: string[] = [
    "Tom hops into the car.",
    "'**Mom**, can I pick the **food** today?' he asks.",
    "**Mom** nods. '**Of course!**'",
    "They go to the **grocery** store.",
    "Tom holds a big shopping cart.",
    "'Let’s go to the fruit section!' he says.",
    "**Mom** picks **oranges**. '**Oranges** are so good!'",
    "Tom picks a **box** of plums. '**Plums** are sweet!'",
    "He looks for **potatoes**. 'I want to cook today!' Tom says.",
    "**Mom** smiles. '**Okay**, let’s get **onions** too.'",
    "Tom looks for **tomatoes**. '**Tomatoes** go in salad!'",
    "He spots a **box** of **cookies**. '**Mom**, can we?'",
    "**Mom** nods. '**One box!**'",
    "Tom grins. He pushes the cart to the cold **food** section.",
    "'Milk, yogurt, and some frozen **corn**!' he lists.",
    "**Mom** helps him pick. '**That’s all!**' she says.",
    "They go to the cashier.",
    "Tom puts **food** on the counter. '**Good job**, Tom!' says **Mom**.",
    "Tom helps pack the bags.",
    "On the way **home**, he smiles. '**Food shopping is fun!**'"
  ];

  ngOnInit(): void {
    this.updateText();
  }

  async handleNext(): Promise<void> {
    if (this.currentIndex >= this.story.length - 1 || this.lives <= 0) return;

    const text = this.story[this.currentIndex];
    const checkpointWord = this.extractCheckpointWord(text);

    if (checkpointWord) {
      this.isListening = true;
      const result: SpeechRecognitionResult | null = await this.speechService.detectSpeech(2).catch(() => null);
      this.isListening = false;

      const spoken = result?.text?.toLowerCase().trim() || '';
      const expected = checkpointWord.toLowerCase();

      if (spoken.includes(expected)) {
        this.feedbackClass = 'correct-flash';
        this.characterState = 'running';
        setTimeout(() => {
          this.feedbackClass = '';
          this.characterState = 'standing';
        }, 600);
        this.nextText();
      } else {
        this.feedbackClass = 'shake-error';
        setTimeout(() => this.feedbackClass = '', 600);
        this.lives--;
        alert(`❌ Try again! You said "${spoken}". Expected: "${expected}"`);
      }
    } else {
      this.nextText();
    }
  }

  nextText(): void {
    this.currentIndex++;
    this.currentProgress = (this.currentIndex / this.story.length) * 100;
    this.updateText();
  }

  updateText(): void {
    const current = this.story[this.currentIndex];
    const checkpointWord = this.extractCheckpointWord(current);
    let clean = this.cleanText(current);

    if (checkpointWord) {
      const safeRegex = new RegExp(`\\b(${checkpointWord})\\b`, 'i');
      clean = clean.replace(safeRegex, `<strong><u>$1</u></strong>`);
    }

    this.currentText = this.sanitizer.bypassSecurityTrustHtml(clean);
    this.isCheckpoint = !!checkpointWord;
  }

  cleanText(text: string): string {
    return text.replace(/\*\*(.*?)\*\*/g, '<span class="highlight">$1</span>');
  }

  extractCheckpointWord(text: string): string | null {
    const match = text.match(/\*\*(.*?)\*\*/);
    return match ? match[1] : null;
  }

  hasCheckpointWord(text: string): boolean {
    return /\*\*(.*?)\*\*/.test(text);
  }
}
