import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { DatabaseService } from './database.service';

export interface SpeechRecognitionResult {
  text: string;
  language_code: string;
  words: string[];
}

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
  private audioContext = new AudioContext();

  constructor(private databaseService: DatabaseService) {}

  async generateAudio(text: string, language: string, id: string): Promise<string> {
    const voiceId = VOICE_MAP[language] || VOICE_MAP['english'];
    const paddedText = text;
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
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio.src = '';
      this.audio.load();
      this.audio = null;
      this.isPaused = false;
    }

    const path = `audios/${language}/${id}.mp3`;

    try {
      const audioUrl = await this.databaseService.fetchFile(path);
      const newAudio = new Audio(audioUrl);

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

  async detectSpeech(seconds: number): Promise<SpeechRecognitionResult> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];
  
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };
  
      return new Promise<SpeechRecognitionResult>((resolve, reject) => {
        mediaRecorder.onstop = async () => {
          try {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
  
            const formData = new FormData();
            formData.append('file', audioBlob, 'recording.webm');
            formData.append('model_id', 'scribe_v1');
  
            const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
              method: 'POST',
              headers: {
                'xi-api-key': this.apiKey
              },
              body: formData
            });
  
            if (!response.ok) {
              const errorText = await response.text();
              throw new Error(`STT request failed: ${errorText}`);
            }
  
            const data = await response.json();
  
            const result: SpeechRecognitionResult = {
              text: data.text || '',
              language_code: data.language_code || 'und',
              words: Array.isArray(data.words)
                ? data.words
                    .filter((w: any) => w.type === 'word' && typeof w.text === 'string')
                    .map((w: any) => w.text)
                : []
            };
  
            resolve(result);
          } catch (error) {
            console.error('Transcription error:', error);
            reject(error);
          } finally {
            stream.getTracks().forEach((track) => track.stop());
          }
        };
  
        mediaRecorder.start();
        console.log('Started recording...');
        setTimeout(() => {
          mediaRecorder.stop();
          console.log('Stopped recording.');
        }, seconds * 1000);
      });
    } catch (error) {
      console.error('Microphone access or recording error:', error);
      throw error;
    }
  }  
}