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
      thumbnail: 'https://img.youtube.com/vi/vIN0HzzPWJY/hqdefault.jpg',
      title: 'Learn to Read with Toddlers',
      description: 'A guide to help toddlers learn to read effectively.',
      link: 'https://www.youtube.com/watch?v=vIN0HzzPWJY&ab_channel=ToddlersCanRead'
    },
    { 
      thumbnail: 'https://img.youtube.com/vi/uJHs8FVGrmU/hqdefault.jpg',
      title: 'Bulba’s Educational Adventure',
      description: 'Explore fun and educational activities with Bulba!',
      link: 'https://www.youtube.com/watch?v=uJHs8FVGrmU&ab_channel=ToddlersCanRead'
    },
    { 
      thumbnail: 'https://img.youtube.com/vi/7CeNTtbhYLs/hqdefault.jpg',
      title: 'How to Learn English | Tips and Tricks',
      description: 'Practical tips for learning English quickly and effectively.',
      link: 'https://www.youtube.com/watch?v=7CeNTtbhYLs&ab_channel=BBCLearningEnglish'
    },
    { 
      thumbnail: 'https://img.youtube.com/vi/NF92RdZC6wE/hqdefault.jpg',
      title: 'Everyday English for Beginners',
      description: 'Learn useful everyday phrases and expressions.',
      link: 'https://www.youtube.com/watch?v=NF92RdZC6wE&list=PLD6B222E02447DC07&index=2&ab_channel=BBCLearningEnglish'
    },
    { 
      thumbnail: 'https://img.youtube.com/vi/fdRmGvmeY1U/hqdefault.jpg',
      title: 'Practice Your English Skills',
      description: 'Improve your English through engaging practice exercises.',
      link: 'https://www.youtube.com/watch?v=fdRmGvmeY1U&list=PLD6B222E02447DC07&index=5&ab_channel=BBCLearningEnglish'
    },
    { 
      thumbnail: 'https://img.youtube.com/vi/eJ7dM_LU9t4/hqdefault.jpg',
      title: 'Learn English with Stories',
      description: 'Stories to help improve your English vocabulary and grammar.',
      link: 'https://www.youtube.com/watch?v=eJ7dM_LU9t4&list=PLD6B222E02447DC07&index=6&ab_channel=BBCLearningEnglish'
    },
    { 
      thumbnail: 'https://img.youtube.com/vi/wg0P0oYkniE/hqdefault.jpg',
      title: 'How to say the schwa sound /ə/ in words',
      description: ' How to say the schwa sound /ə/ in words',
      link: 'https://www.youtube.com/watch?v=wg0P0oYkniE&list=PLD6B222E02447DC07&index=8&ab_channel=BBCLearningEnglish'
    },
    { 
      thumbnail: 'https://img.youtube.com/vi/hLN1cdSTDo8/hqdefault.jpg',
      title: ' Short Vowel - /e/',
      description: 'Learn to say  Short Vowel - /e/',
      link: 'https://www.youtube.com/watch?v=hLN1cdSTDo8&list=PLD6B222E02447DC07&index=11&ab_channel=BBCLearningEnglish'
    }
  ];

  // Displayed videos (filtered list)
  videos = [...this.allVideos];

  // Method to filter videos based on search term
  onSearch(term: string): void {
    const lowerTerm = term.toLowerCase();
    this.videos = this.allVideos.filter(video =>
      video.title.toLowerCase().includes(lowerTerm) ||
      video.description.toLowerCase().includes(lowerTerm)
    );
  }
}
