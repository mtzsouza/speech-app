import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-educational-articles',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './educational-articles.component.html',
  styleUrls: ['./educational-articles.component.sass'],
})
export class EducationalArticlesComponent {
  // List of articles
  articles = [
    { 
      title: 'Easy Speech Therapy Exercises Parents Can Use at Home', 
      description: 'This article offers simple and effective speech therapy exercises that parents can use to help their children improve their speech at home.',
      url: 'https://www.expressable.com/learning-center/tips-and-resources/15-speech-therapy-strategies-for-parents-to-use-at-home'
    },
    { 
      title: 'Phonetics: The Sounds of Language', 
      description: 'An introduction to phonetics, explaining how the sounds of language work and their role in speech therapy.',
      url: 'https://scholar.harvard.edu/files/adam/files/phonetics.ppt.pdf'
    },
    { 
      title: 'Speech Therapy for Non-Native Speaking Students', 
      description: 'This article discusses how speech therapy can help non-native speaking students improve their language skills.',
      url: 'https://www.speechandlanguagekids.com/speech-therapy-bilingual-children-dont-speak-language/'
    },
    { 
      title: 'How to Learn a Language – 8 Top Tips and Advice', 
      description: 'Offers useful strategies and tips for learning a new language effectively and quickly.',
      url: 'https://www.futurelearn.com/info/blog/how-to-learn-a-language'
    },
    { 
      title: 'Tips and Activities for Teaching Pronunciation', 
      description: 'Provides tips and activities to improve pronunciation, especially for language learners.',
      url: 'https://grade-university.com/blog/tips-and-activities-for-teaching-pronunciation'
    },
    { 
      title: 'Cognitive Speech Therapy', 
      description: 'Explores cognitive speech therapy and how it can be used to treat speech and language disorders.',
      url: 'https://www.betterspeech.com/lp/cognitive-speech-therapy'
    },
    { 
      title: 'Speech Language Pathologists: Roles and Responsibilities', 
      description: 'Covers the key roles of Speech-Language Pathologists in communication development, including their responsibilities, therapy techniques, and more.',
      url: 'https://www.parallellearning.com/post/speech-language-pathologists-roles-and-responsibilities'
    },
    { 
      title: 'Speech and Language Developmental Milestones', 
      description: 'Outlines key speech and language developmental milestones for children.',
      url: 'https://www.nidcd.nih.gov/health/speech-and-language'
    },
    { 
      title: 'Innovations in Speech Therapy', 
      description: 'Explores recent innovations and advancements in the field of speech therapy.',
      url: 'https://www.kidsfirstservices.com/first-insights/innovations-in-speech-therapy'
    },
    { 
      title: 'The Significance of Phonetics in Teaching English Language', 
      description: 'Explains the importance of phonetics in teaching English and its role in pronunciation.',
      url: 'https://www.teflcourse.in/The-Significance-Of-Phonetics-In-Teaching-English-Language.php'
    }
  ];

  // Search query to filter articles
  searchQuery = '';

  // Filtered articles
  filteredArticles = [...this.articles];

  // Filter articles based on search query
  filterArticles() {
    this.filteredArticles = this.articles.filter((article) =>
      article.title.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
}
