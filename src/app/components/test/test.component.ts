import { Component, inject } from '@angular/core';
import { SpeechService } from '../../services/speech.service';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [],
  templateUrl: './test.component.html',
  styleUrl: './test.component.sass'
})
export class TestComponent {
  speechService = inject(SpeechService);

  result = "No recording.";

  async startRecording() {
    this.result = await this.speechService.detectSpeech(2);
  }
}
