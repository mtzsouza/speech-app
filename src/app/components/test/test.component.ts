import { Component, inject } from '@angular/core';
import { SpeechService, SpeechRecognitionResult } from '../../services/speech.service';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [],
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.sass']
})
export class TestComponent {
  speechService = inject(SpeechService);

  result: SpeechRecognitionResult | null = null;

  async startRecording(): Promise<void> {
    try {
      this.result = await this.speechService.detectSpeech(2);
      console.log('Recording result:', this.result);
    } catch (error) {
      console.error('Failed to record speech:', error);
    }
  }
}