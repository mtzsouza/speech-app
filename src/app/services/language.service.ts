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

    getLanguage(): Promise<any> {
        return this.auth.firebaseAuth.authStateReady().then(user => {
            return this.database.fetchDocumentById('users', this.auth.getEmail()!).then(userData => {
              if (userData.language == 'spanish') {
                return spanish;
              } else {
                return english;
              }
            })
        });
    }
}
