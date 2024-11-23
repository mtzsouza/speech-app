import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vh',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vh.component.html',
  styleUrls: ['./vh.component.sass']
})
export class VHComponent {
  // Full video list
  allVideos = [
    { 
      thumbnail: 'https://img.youtube.com/vi/ELQhKWCad7o/hqdefault.jpg',
      title: 'Beatrice Music',
      description: 'The best music',
      link: 'https://www.youtube.com/watch?v=ELQhKWCad7o&ab_channel=Beatrice'
    },
    { 
      thumbnail: 'https://img.youtube.com/vi/vh7vQaFbAIg/hqdefault.jpg',
      title: 'Bulba Video',
      description: 'This description 1',
      link: 'https://www.youtube.com/watch?v=vh7vQaFbAIg&ab_channel=BULBA'
    },
    { 
      thumbnail: 'https://img.youtube.com/vi/Ussqi3nagrQ/hqdefault.jpg',
      title: 'Cartoon Network Clip 1',
      description: 'This description 2',
      link: 'https://www.youtube.com/watch?v=Ussqi3nagrQ&ab_channel=CartoonNetwork'
    },
    { 
      thumbnail: 'https://img.youtube.com/vi/ah1zyO3ob_A/hqdefault.jpg',
      title: '炎炎ノ消防隊 Video',
      description: 'This description 3',
      link: 'https://www.youtube.com/watch?v=ah1zyO3ob_A&ab_channel=炎炎ノ消防隊'
    },
    { 
      thumbnail: 'https://img.youtube.com/vi/uyNPrGR7y4w/hqdefault.jpg',
      title: 'Brandon McInnis Clip',
      description: 'This description 4',
      link: 'https://www.youtube.com/watch?v=uyNPrGR7y4w&list=LL&index=4&ab_channel=BrandonMcInnis'
    },
    { 
      thumbnail: 'https://img.youtube.com/vi/DwqFTAp9oW4/hqdefault.jpg',
      title: 'Dennis van Aarssen Topic',
      description: 'This description 5',
      link: 'https://www.youtube.com/watch?v=DwqFTAp9oW4&list=LL&index=15&ab_channel=DennisvanAarssen-Topic'
    },
    { 
      thumbnail: 'https://img.youtube.com/vi/jKKrfr4To14/hqdefault.jpg',
      title: 'Disney Music VEVO',
      description: 'This description 6',
      link: 'https://www.youtube.com/watch?v=jKKrfr4To14&list=LL&index=22&ab_channel=DisneyMusicVEVO'
    },
    { 
      thumbnail: 'https://img.youtube.com/vi/B_3fHpLqVEE/hqdefault.jpg',
      title: 'Adventure Time Clip',
      description: 'This description 7',
      link: 'https://www.youtube.com/watch?v=B_3fHpLqVEE&list=LL&index=19&ab_channel=AdventureTime'
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
