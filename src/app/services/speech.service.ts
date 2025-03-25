import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { DatabaseService } from './database.service';

const VOICE_MAP: Record<string, string> = {
  'english': 'Qggl4b0xRMiqOwhPtVWT',
  'spanish': 'TxGEqnHWrfWFTfGW9XjX',
};

@Injectable({
  providedIn: 'root'
})
export class SpeechService {
  private audio: HTMLAudioElement | null = null;
  private isPaused = false;
  private apiKey = environment.elevenlabsConfig.apiKey;
  private onEndedCallback: (() => void) | null = null;

  constructor(private databaseService: DatabaseService) {}

  async generateAudio(text: string, language: string, id: string): Promise<string> {
    const voiceId = VOICE_MAP[language] || VOICE_MAP['english'];
    const paddedText = '... ' + text;
    const path = `audios/${language}/${id}.mp3`;

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'xi-api-key': this.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: paddedText,
          model_id: 'eleven_multilingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            speed: 0.77
          }
        })
      });

      const audioBlob = await response.blob();
      const downloadUrl = await this.databaseService.storeFile(path, audioBlob);
      return downloadUrl;
    } catch (error) {
      console.error('Error generating or storing audio:', error);
      throw error;
    }
  }

  async start(language: string, id: string): Promise<void> {
    this.stop();
    const path = `audios/${language}/${id}.mp3`;

    try {
      const audioUrl = await this.databaseService.fetchFile(path);
      this.audio = new Audio(audioUrl);
      this.setupAudioHandlers(this.audio);
      this.audio.load();
    } catch (error) {
      console.error('Error starting audio:', error);
    }
  }

  async restart(language: string, id: string): Promise<void> {
    // Ensure current audio is stopped before starting a new one
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio.src = ''; // Force reset
      this.audio.load();
      this.audio = null;
      this.isPaused = false;
    }
  
    const path = `audios/${language}/${id}.mp3`;
  
    try {
      const audioUrl = await this.databaseService.fetchFile(path);
      const newAudio = new Audio(audioUrl);
  
      // Apply handlers before assigning to this.audio
      newAudio.oncanplaythrough = () => {
        newAudio.play();
      };
  
      newAudio.onended = () => {
        this.audio = null;
        this.isPaused = false;
        if (this.onEndedCallback) {
          this.onEndedCallback();
        }
      };
  
      this.audio = newAudio;
      this.audio.load();
    } catch (error) {
      console.error('Error restarting audio:', error);
    }
  }  

  private setupAudioHandlers(audio: HTMLAudioElement) {
    audio.oncanplaythrough = () => {
      audio.play();
    };

    audio.onended = () => {
      this.audio = null;
      this.isPaused = false;
      if (this.onEndedCallback) {
        this.onEndedCallback();
      }
    };
  }

  pause() {
    if (this.audio && !this.audio.paused) {
      this.audio.pause();
      this.isPaused = true;
    }
  }

  resume() {
    if (this.audio && this.isPaused) {
      this.audio.play();
      this.isPaused = false;
    }
  }

  stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio = null;
      this.isPaused = false;
    }
  }

  onAudioEnd(callback: () => void) {
    this.onEndedCallback = callback;
  }
}