import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpeechService {
  private synth = window.speechSynthesis;
  public voices: SpeechSynthesisVoice[] = [];

  constructor() {
    this.loadVoices();
  }

  private loadVoices() {
    this.voices = this.synth.getVoices();

    if (this.voices.length === 0) {
      // Sometimes voices are not loaded immediately
      this.synth.onvoiceschanged = () => {
        this.voices = this.synth.getVoices();
        console.log("Available Voices:", this.voices);
      };
    }
  }

  speak(text: string, voiceName?: string) {
    if (this.synth.speaking) {
      console.warn("Speech is already in progress...");
      return;
    }

    if (text) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US'; // Default language
      utterance.rate = 0.7; // Speed (1 = normal)
      utterance.pitch = 1; // Pitch (1 = normal)

      // Select a specific voice
      if (voiceName) {
        const selectedVoice = this.voices.find(v => v.name === voiceName);
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
      }

      this.synth.speak(utterance);
    }
  }

  stop() {
    if (this.synth.speaking) {
      this.synth.cancel();
    }
  }
}