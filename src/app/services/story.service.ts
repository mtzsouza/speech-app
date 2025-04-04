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
          console.log("Story added.")
        }).catch(error => {
          console.log("Error adding story.")
          console.error(error);
        })
    }

    fetchStories() {
      return this.database.fetchCollection('stories').then(data => {
        return data;
      })
    }

    fetchStoryByEnglishTitle(title_english: string) {
      return this.database.fetchCollection('stories').then(data => {
        for (let story of data) {
          if (story.title_english == title_english) {
            return story;
          }
        }
        return null;
      })
    }
}