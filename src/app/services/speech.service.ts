import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpeechService {
  private synth = window.speechSynthesis;
  public voices: SpeechSynthesisVoice[] = [];
  private utteranceQueue: SpeechSynthesisUtterance[] = [];
  private isSpeaking = false;

  constructor() {
    this.loadVoices();
  }

  private loadVoices() {
    this.voices = this.synth.getVoices();

    if (this.voices.length === 0) {
      this.synth.onvoiceschanged = () => {
        this.voices = this.synth.getVoices();
        console.log("Available Voices:", this.voices);
      };
    }
  }

  speak(text: string, voiceName?: string) {
    if (this.isSpeaking) {
      console.warn("Speech is already in progress...");
      return;
    }

    if (text) {
      const chunks = this.splitTextIntoChunks(text, 120); // Reduce max length
      this.utteranceQueue = chunks.map(chunk => this.createUtterance(chunk, voiceName));
      this.isSpeaking = true;
      this.playQueue();
    }
  }

  private createUtterance(chunk: string, voiceName?: string): SpeechSynthesisUtterance {
    const utterance = new SpeechSynthesisUtterance(chunk);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    utterance.pitch = 1;

    if (voiceName) {
      const selectedVoice = this.voices.find(v => v.name === voiceName);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }

    return utterance;
  }

  private playQueue() {
    if (this.utteranceQueue.length === 0) {
      this.isSpeaking = false;
      return;
    }

    const utterance = this.utteranceQueue.shift();
    if (utterance) {
      utterance.onend = () => {
        setTimeout(() => this.playQueue(), 200); // Delay to prevent cut-off
      };
      utterance.onerror = (event) => {
        console.error("Speech error:", event);
        this.isSpeaking = false;
      };

      this.synth.speak(utterance);
    }
  }

  private splitTextIntoChunks(text: string, maxLength: number): string[] {
    const sentences = text.match(/[^.!?]+[.!?]*/g) || [text]; // Split into sentences
    const chunks: string[] = [];
    let chunk = '';

    for (const sentence of sentences) {
      if ((chunk + sentence).length > maxLength) {
        chunks.push(chunk.trim());
        chunk = sentence;
      } else {
        chunk += ' ' + sentence;
      }
    }

    if (chunk) {
      chunks.push(chunk.trim());
    }

    return chunks;
  }

  stop() {
    if (this.synth.speaking) {
      this.synth.cancel();
    }
    this.utteranceQueue = [];
    this.isSpeaking = false;
  }
} 