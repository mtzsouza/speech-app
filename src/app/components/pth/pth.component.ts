import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pth',
  standalone: true,
  imports: [NavbarComponent, CommonModule],
  templateUrl: './pth.component.html',
  styleUrls: ['./pth.component.sass']
})

export class PTHComponent {
  earnedBadges: any[] = [];
  unearnedBadges: any[] = [];

  allBadges = [
    { name: 'First Steps', description: 'Start your journey!', icon: '🥇', requiredProgress: 5 },
    { name: 'Binge Watcher', description: 'Watch 10 videos!', icon: '📺', requiredProgress: 10 },
    { name: 'Committed Learner', description: 'Reach 50% progress!', icon: '🎓', requiredProgress: 50 },
    { name: 'Video Master', description: 'Complete all videos!', icon: '🏆', requiredProgress: 100 }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.checkProgressAndAwardBadges();
  }

  checkProgressAndAwardBadges() {
    const videoProgress = Number(sessionStorage.getItem('videoProgress')) || 0;
    const soundboardProgress = Number(sessionStorage.getItem('soundboardProgress')) || 0;
    const totalProgress = Math.max(videoProgress, soundboardProgress); // Use the highest progress value

    this.earnedBadges = []; // Reset earned badges

    if (totalProgress >= 5) {
      this.earnedBadges.push(this.allBadges.find(b => b.name === 'First Steps'));
    }
    if (totalProgress >= 10) {
      this.earnedBadges.push(this.allBadges.find(b => b.name === 'Binge Watcher'));
    }
    if (totalProgress >= 50) {
      this.earnedBadges.push(this.allBadges.find(b => b.name === 'Committed Learner'));
    }
    if (totalProgress >= 100) {
      this.earnedBadges.push(this.allBadges.find(b => b.name === 'Video Master'));
    }

    // Filter out earned badges from unearned list
    this.unearnedBadges = this.allBadges.filter(b => !this.earnedBadges.includes(b));
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