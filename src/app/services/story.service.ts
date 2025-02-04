import { Injectable, inject} from "@angular/core";
import { DatabaseService } from "./database.service";
import { StoryInterface } from "../utils/story.interface";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class StoryService {
    database = inject(DatabaseService);
    router = inject(Router);

    addStory(story: StoryInterface) {
        this.database.addDocument("stories", story).then(() => {
          alert("Story added.");
          this.router.navigateByUrl("/stories")
        }).catch(error => {
          alert("Adding story failed. Check console for error description.");
          console.error(error);
        })
    }

    fetchStories() {
      return this.database.fetchCollection('stories').then(data => {
        return data;
      })
    }

    fetchStoryByTitle(title: string) {
      return this.database.fetchCollection('stories').then(data => {
        for (let story of data) {
          if (story.title == title) {
            return story;
          }
        }
        return null;
      })
    }
}