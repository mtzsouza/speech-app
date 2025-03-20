import { Injectable, inject} from "@angular/core";
import { AuthService } from "./auth.service"
import { DatabaseService } from "./database.service"
import * as spanish from '../utils/spanish.json'
import * as english from '../utils/english.json'

@Injectable({
    providedIn: 'root'
})
export class LanguageService {
  auth = inject(AuthService)
  database = inject(DatabaseService)

  private LANGUAGE_KEY = 'preferredLanguage';

  async getLanguage(): Promise<any> {
    const storedLanguage = localStorage.getItem(this.LANGUAGE_KEY);

    if (this.auth.firebaseAuth.currentUser) {
      // User is signed in, fetch language from Firebase
      const userData = await this.database.fetchDocumentById('users', this.auth.getEmail()!);

      if (userData?.language) {
        const firebaseLanguage = userData.language;
        // Save Firebase language to local storage for future sessions
        localStorage.setItem(this.LANGUAGE_KEY, firebaseLanguage);

        // Return the Firebase language preference
        return firebaseLanguage === 'spanish' ? spanish : english;
      }
    }

    // If no Firebase language is available or user is not signed in, fallback to local storage
    if (storedLanguage === 'spanish') {
      return spanish;
    } else if (storedLanguage === 'english') {
      return english;
    }
  }
}
