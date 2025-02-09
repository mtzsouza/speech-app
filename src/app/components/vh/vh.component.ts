import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-vh',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './vh.component.html',
  styleUrls: ['./vh.component.sass']
})
export class VHComponent {
  // Full video list
  allVideos = [
    { 
      "thumbnail": "https://img.youtube.com/vi/vIN0HzzPWJY/hqdefault.jpg",
      "title": "ENG_PK Learn to Read with Toddlers",
      "description": "A guide to help toddlers learn to read effectively.",
      "link": "https://www.youtube.com/watch?v=vIN0HzzPWJY&ab_channel=ToddlersCanRead"
    },
    { 
      "thumbnail": "https://img.youtube.com/vi/uJHs8FVGrmU/hqdefault.jpg",
      "title": "ENG_PK Bulba’s Educational Adventure",
      "description": "Explore fun and educational activities with Bulba!",
      "link": "https://www.youtube.com/watch?v=uJHs8FVGrmU&ab_channel=ToddlersCanRead"
    },
    { 
      "thumbnail": "https://img.youtube.com/vi/5FMPlqlFt9g/hqdefault.jpg",
      "title": "ENG_PK Learn English Through Stories",
      "description": "A video to help improve vocabulary through storytelling.",
      "link": "https://www.youtube.com/watch?v=5FMPlqlFt9g&list=PLD6B222E02447DC07&index=19&ab_channel=BBCLearningEnglish"
    },
    { 
      "thumbnail": "https://img.youtube.com/vi/AZRREr7DqqM/hqdefault.jpg",
      "title": "ENG_PK Difficult English Words",
      "description": "Master difficult English words in this lesson.",
      "link": "https://www.youtube.com/watch?v=AZRREr7DqqM&list=PLD6B222E02447DC07&index=20&ab_channel=BBCLearningEnglish"
    },
    { 
      "thumbnail": "https://img.youtube.com/vi/vC0h4S0YPJc/hqdefault.jpg",
      "title": "ENG_PK Practice Pronunciation with BBC",
      "description": "Learn proper pronunciation in this detailed guide.",
      "link": "https://www.youtube.com/watch?v=vC0h4S0YPJc&list=PLD6B222E02447DC07&index=21&ab_channel=BBCLearningEnglish"
    },
    { 
      "thumbnail": "https://img.youtube.com/vi/tu1t3Fn5Lw8/hqdefault.jpg",
      "title": "ENG_PK BBC Grammar Tips",
      "description": "Understand essential grammar rules with examples.",
      "link": "https://www.youtube.com/watch?v=tu1t3Fn5Lw8&list=PLD6B222E02447DC07&index=22&ab_channel=BBCLearningEnglish"
    },
    { 
      "thumbnail": "https://img.youtube.com/vi/9WDnVMQIaTs/hqdefault.jpg",
      "title": "ENG_PK Everyday English Conversations",
      "description": "Watch real-life conversations to improve speaking skills.",
      "link": "https://www.youtube.com/watch?v=9WDnVMQIaTs&list=PLD6B222E02447DC07&index=23&ab_channel=BBCLearningEnglish"
    },
    { 
      "thumbnail": "https://img.youtube.com/vi/0J7-5maJJIk/hqdefault.jpg",
      "title": "ENG_PK Learn with Dialogues",
      "description": "Practice English dialogues for better fluency.",
      "link": "https://www.youtube.com/watch?v=0J7-5maJJIk&list=PLD6B222E02447DC07&index=25&ab_channel=BBCLearningEnglish"
    },
    { 
      "thumbnail": "https://img.youtube.com/vi/nHSqluHrD-U/hqdefault.jpg",
      "title": "ENG_PK Master Pronunciation | Advanced Tips",
      "description": "Learn advanced pronunciation techniques.",
      "link": "https://www.youtube.com/watch?v=nHSqluHrD-U&list=PLD6B222E02447DC07&index=27&ab_channel=BBCLearningEnglish"
    },
    { 
      "thumbnail": "https://img.youtube.com/vi/PykxZ5kkrjs/hqdefault.jpg",
      "title": "ENG_PK Learn Prepositions in English",
      "description": "Understand the use of common prepositions.",
      "link": "https://www.youtube.com/watch?v=PykxZ5kkrjs&list=PLD6B222E02447DC07&index=31&ab_channel=BBCLearningEnglish"
    },
    { 
      "thumbnail": "https://img.youtube.com/vi/yP7aCKO6bTE/hqdefault.jpg",
      "title": "ENG_PK Learn to Describe Actions",
      "description": "Improve your vocabulary by learning action words.",
      "link": "https://www.youtube.com/watch?v=yP7aCKO6bTE&list=PLD6B222E02447DC07&index=31&ab_channel=BBCLearningEnglish"
    },
    { 
      "thumbnail": "https://img.youtube.com/vi/lFRrEI85IcM/hqdefault.jpg",
      "title": "ENG_PK Writing Skills for Beginners",
      "description": "Learn basic writing techniques in this video.",
      "link": "https://www.youtube.com/watch?v=lFRrEI85IcM&list=PLD6B222E02447DC07&index=32&ab_channel=BBCLearningEnglish"
    },
    { 
      "thumbnail": "https://img.youtube.com/vi/0IeQmGdo7gQ/hqdefault.jpg",
      "title": "ENG_PK English for Travel",
      "description": "Common English phrases used while traveling.",
      "link": "https://www.youtube.com/watch?v=0IeQmGdo7gQ&list=PLD6B222E02447DC07&index=33&ab_channel=BBCLearningEnglish"
    },
    { 
      "thumbnail": "https://img.youtube.com/vi/d1jyIpAmLe8/hqdefault.jpg",
      "title": "ENG_PK Improve Sentence Construction",
      "description": "Understand how to form proper sentences.",
      "link": "https://www.youtube.com/watch?v=d1jyIpAmLe8&list=PLD6B222E02447DC07&index=34&ab_channel=BBCLearningEnglish"
    },
    { 
      "thumbnail": "https://img.youtube.com/vi/rgWse3tloTw/hqdefault.jpg",
      "title": "ENG_PK Pronunciation Practice: /ʃ/ and /ʒ/",
      "description": "Learn how to pronounce /ʃ/ and /ʒ/ sounds.",
      "link": "https://www.youtube.com/watch?v=rgWse3tloTw&list=PLD6B222E02447DC07&index=35&ab_channel=BBCLearningEnglish"
    },
    { 
      "thumbnail": "https://img.youtube.com/vi/vE12RFyH-hY/hqdefault.jpg",
      "title": "ENG_PK Learn English with Examples",
      "description": "Understand grammar rules with examples.",
      "link": "https://www.youtube.com/watch?v=vE12RFyH-hY&list=PLD6B222E02447DC07&index=36&ab_channel=BBCLearningEnglish"
    },
    { 
      "thumbnail": "https://img.youtube.com/vi/bTxeAiBF61I/hqdefault.jpg",
      "title": "ENG_PK Learn Idioms and Phrases",
      "description": "Master common English idioms and phrases.",
      "link": "https://www.youtube.com/watch?v=bTxeAiBF61I&list=PLD6B222E02447DC07&index=37&ab_channel=BBCLearningEnglish"
    },
    {
      "thumbnail": "https://img.youtube.com/vi/c8QPGaExj4Y/hqdefault.jpg",
      "title": "SPA_PK Learn Spanish Phonics in 10 Minutes",
      "description": "A quick guide to Spanish phonics, covering vowels and consonants.",
      "link": "https://www.youtube.com/watch?v=c8QPGaExj4Y&ab_channel=Skillabration"
    },
    {
      "thumbnail": "https://img.youtube.com/vi/EOgMomen_vM/hqdefault.jpg",
      "title": "SPA_PK BASIC Spanish Pronunciation Rules",
      "description": "Learn fundamental pronunciation rules in Spanish, including stress and syllables.",
      "link": "https://youtu.be/EOgMomen_vM?si=iy-Z5bB1wUVrFhq7"
    },
    {
      "thumbnail": "https://img.youtube.com/vi/Sh7MLrbxH2E/hqdefault.jpg",
      "title": "SPA_PK Learn Spanish Pronunciation in 12 Minutes",
      "description": "A quick yet comprehensive guide to mastering Spanish pronunciation.",
      "link": "https://www.youtube.com/watch?v=Sh7MLrbxH2E&ab_channel=LearnSpanishwithSpanishPod101.com"
    },
    {
      "thumbnail": "https://img.youtube.com/vi/gPZmcsJxhNk/hqdefault.jpg",
      "title": "SPA_PK Spanish Pronunciation: The Ultimate Guide",
      "description": "An in-depth tutorial series on Spanish phonetics and pronunciation.",
      "link": "https://www.youtube.com/watch?v=gPZmcsJxhNk&list=PLFgHLDffyiwe4oYFeiun05JSJYXMtbfYB&index=10&ab_channel=StoryLearningSpanish"
    },
    {
      "thumbnail": "https://img.youtube.com/vi/lrZyONySKIo/hqdefault.jpg",
      "title": "SPA_PK How to Have PERFECT Spanish Pronunciation",
      "description": "A practical guide to achieving a native-like Spanish accent.",
      "link": "https://www.youtube.com/watch?v=lrZyONySKIo&ab_channel=TheLingOtter"
    },
    {
      "thumbnail": "https://img.youtube.com/vi/mNSB-E8aEtU/hqdefault.jpg",
      "title": "SPA_PK Cómo Pronunciar en Español",
      "description": "Learn the correct way to pronounce Spanish words and phrases.",
      "link": "https://www.youtube.com/watch?v=mNSB-E8aEtU&ab_channel=EspañolconAli"
    }
  ];

  //This is a basic filter

  englishVideos = this.allVideos.filter(video => video.title.includes('ENG_PK'));
  spanishVideos = this.allVideos.filter(video => video.title.includes('SPA_PK'));

  // Displayed videos (filtered list)
  videos = [...this.allVideos];

  // Method to filter videos based on search term
  onSearch(term: string): void {
    const lowerTerm = term.toLowerCase();
  
    // Filter both English and Spanish videos
    this.englishVideos = this.allVideos
      .filter(video => video.title.includes('ENG_PK'))
      .filter(video => video.title.toLowerCase().includes(lowerTerm) || video.description.toLowerCase().includes(lowerTerm));
  
    this.spanishVideos = this.allVideos
      .filter(video => video.title.includes('SPA_PK'))
      .filter(video => video.title.toLowerCase().includes(lowerTerm) || video.description.toLowerCase().includes(lowerTerm));
  }
  

  constructor() {}

  ngOnInit(): void {
    this.trackVisit();
  }

  trackVisit(): void {
    // Mark the "Videos" page as visited
    sessionStorage.setItem('visitedVideos', 'true');
  }

  trackVideoClick(videoLink: string): void {
    let clickedVideos: string[] = JSON.parse(sessionStorage.getItem('clickedVideos') || '[]');
    let totalVideos = this.allVideos.length;
    let progressPerVideo = 100 / totalVideos;
    let currentProgress = Number(sessionStorage.getItem('videoProgress')) || 0;
    let watchedVideos: string[] = JSON.parse(sessionStorage.getItem('watchedVideos') || '[]');

    if (!clickedVideos.includes(videoLink)) {
        clickedVideos.push(videoLink);
        currentProgress = Math.min(currentProgress + progressPerVideo, 100);
        currentProgress = Math.round(currentProgress); // Round to nearest whole number

        sessionStorage.setItem('clickedVideos', JSON.stringify(clickedVideos));
        sessionStorage.setItem('videoProgress', currentProgress.toString());
    }

    if (!watchedVideos.includes(videoLink)) {
      watchedVideos.push(videoLink);
      sessionStorage.setItem('watchedVideos', JSON.stringify(watchedVideos));
    }
  }

  isWatched(videoLink: string): boolean {
    let watchedVideos: string[] = JSON.parse(sessionStorage.getItem('watchedVideos') || '[]');
    return watchedVideos.includes(videoLink);
  }
}
