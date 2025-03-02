import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { StoryService } from '../../../services/story.service';
import { StoryInterface } from '../../../utils/story.interface';

@Component({
  selector: 'app-add-story',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-story.component.html',
  styleUrl: './add-story.component.sass'
})
export class AddStoryComponent {
    router = inject(Router)
    auth = inject(AuthService)
    storyService = inject(StoryService)

    // Initialize data
    formData: StoryInterface = {
      "author": "",
      "title_english": "",
      "title_spanish": "",
      "sound": "",
      "summary_english": "",
      "summary_spanish": "",
      "text_english": "",
      "text_spanish": "",
    }

    ngOnInit() {
      this.auth.firebaseAuth.onAuthStateChanged((user) => {
        if (user) {
          this.formData.author = user.email
        }
      })
    }

    onSubmit() {
      this.storyService.addStory(this.formData);
    }
}
