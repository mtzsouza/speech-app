import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StoryService } from '../../../services/story.service';
import { SpeechService } from '../../../services/speech.service';

@Component({
  selector: 'app-read-story',
  standalone: true,
  imports: [],
  templateUrl: './read-story.component.html',
  styleUrl: './read-story.component.sass'
})

export class ReadStoryComponent {
  router = inject(Router);
  storyService = inject(StoryService);
  speech = inject(SpeechService);

  title = "";
  story = "";

  ngOnInit() {
    this.loadStory()
  }

  async loadStory() {
    this.title = this.router.url.split("/")[2].replaceAll("_", " ");

    const buffer = await this.storyService.fetchStoryByTitle(this.title)
    this.story = buffer.story
  }

  speak() {
    this.speech.speak(this.story, "Google US English")
  }

  stop() {
    this.speech.stop()
  }
}
