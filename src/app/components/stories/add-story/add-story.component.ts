import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { StoryService } from '../../../services/story.service';
import { StoryInterface } from '../../../utils/story.interface';
import { SpeechService } from '../../../services/speech.service';

@Component({
  selector: 'app-add-story',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-story.component.html',
  styleUrl: './add-story.component.sass'
})
export class AddStoryComponent {
  router = inject(Router);
  auth = inject(AuthService);
  storyService = inject(StoryService);
  speechService = inject(SpeechService);

  formData: StoryInterface = {
    "author": "",
    "title_english": "",
    "title_spanish": "",
    "sound": "",
    "summary_english": "",
    "summary_spanish": "",
    "text_english": "",
    "text_spanish": "",
    "audio_id": ""
  };

  isGenerating = false;

  ngOnInit() {
    this.auth.firebaseAuth.onAuthStateChanged((user) => {
      if (user) {
        this.formData.author = user.email;
      }
    });
  }

  async onSubmit() {
    this.formData.audio_id = this.formData.title_english
      .replace(/\s+/g, '_')
      .toLowerCase()
      .slice(0, 10);

    this.isGenerating = true;

    try {
      await Promise.all([
        this.speechService.generateAudio(this.formData.text_english, "english", this.formData.audio_id),
        this.speechService.generateAudio(this.formData.text_spanish, "spanish", this.formData.audio_id)
      ]);

      await this.storyService.addStory(this.formData);

      alert("Story added successfully.");
      this.router.navigate(['/stories']);
    } catch (error) {
      console.error("Error generating audio or saving story:", error);
    } finally {
      this.isGenerating = false;
    }
  }
}