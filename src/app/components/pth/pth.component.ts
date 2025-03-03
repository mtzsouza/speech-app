import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pth',
  standalone: true,
  imports: [NavbarComponent, CommonModule],
  templateUrl: './pth.component.html',
  styleUrls: ['./pth.component.sass']
})
export class PTHComponent implements OnInit {
  earnedBadges: any[] = [];
  unearnedBadges: any[] = [];
  showConfetti = false;
  confettiPieces: any[] = []; // Array to store confetti pieces

  allBadges = [
    { name: 'First Steps', description: 'Watch your first video!', icon: '📺', requiredProgress: 5 },
    { name: 'Binge Watcher', description: 'Watch 3 videos.', icon: '🎥', requiredProgress: 10 },
    { name: 'Committed Learner', description: 'Watch 10 videos.', icon: '🎬', requiredProgress: 15 },
    { name: 'Video Master', description: 'Watch 25 videos.', icon: '🏆', requiredProgress: 20 },
    { name: 'Marathon Session', description: 'Watch videos for 1 hour.', icon: '⏳', requiredProgress: 25 },
    { name: 'Sound Explorer', description: 'Play a sound from the soundboard.', icon: '🔊', requiredProgress: 30 },
    { name: 'Melody Maker', description: 'Play 5 different sounds.', icon: '🎶', requiredProgress: 35 },
    { name: 'Dedicated Student', description: 'Study for 30 minutes.', icon: '📚', requiredProgress: 40 },
    { name: 'Master of Sounds', description: 'Study for 1 hour.', icon: '💡', requiredProgress: 50 }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.checkProgressAndAwardBadges();
  }

  checkProgressAndAwardBadges() {
    const videoProgress = Number(sessionStorage.getItem('videoProgress')) || 0;
    const soundboardProgress = Number(sessionStorage.getItem('soundboardProgress')) || 0;
    const totalProgress = Math.max(videoProgress, soundboardProgress);
  
    // Load previously earned badges from sessionStorage (ensure it's an array)
    const prevEarnedBadges: { name: string }[] = JSON.parse(sessionStorage.getItem('earnedBadges') || '[]');
  
    this.earnedBadges = [];
  
    for (let badge of this.allBadges) {
      if (totalProgress >= badge.requiredProgress) {
        this.earnedBadges.push(badge);
      }
    }
  
    const newEarnedBadge = this.earnedBadges.some((badge: { name: string }) => 
      !prevEarnedBadges.some((prevBadge: { name: string }) => prevBadge.name === badge.name)
    );
  
    if (newEarnedBadge) {
      this.triggerConfetti();
    }
  
    sessionStorage.setItem('earnedBadges', JSON.stringify(this.earnedBadges));
  
    // Get remaining unearned badges
    this.unearnedBadges = this.allBadges.filter(b => !this.earnedBadges.includes(b)).slice(0, 4);
  }
  

  triggerConfetti() {
    this.showConfetti = true;
    this.confettiPieces = Array.from({ length: 50 }).map(() => ({
      left: Math.random() * 100 + 'vw', // Random horizontal position
      animationDuration: Math.random() * 2 + 2 + 's', // Random animation speed
      color: this.getRandomColor() // Random colors
    }));

    setTimeout(() => {
      this.showConfetti = false;
      this.confettiPieces = [];
    }, 3000);
  }

  getRandomColor() {
    const colors = ['#ffcc00', '#ff5733', '#33ff57', '#5733ff', '#ff33a1', '#33a1ff'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  viewEarnedBadges() {
    this.router.navigate(['/progress/earned']);
  }

  viewUnearnedBadges() {
    this.router.navigate(['/progress/unearned']);
  }

  navigateToProgress() {
    this.router.navigate(['/progress/data']);
  }
}
