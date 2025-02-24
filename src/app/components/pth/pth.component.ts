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

  allBadges = [
    // Video Watching Achievements
    { name: 'First Steps', description: 'Watch your first video!', icon: '📺', requiredProgress: 5 },
    { name: 'Binge Watcher', description: 'Watch 3 videos.', icon: '🎥', requiredProgress: 10 },
    { name: 'Committed Learner', description: 'Watch 10 videos.', icon: '🎬', requiredProgress: 15 },
    { name: 'Video Master', description: 'Watch 25 videos.', icon: '🏆', requiredProgress: 20 },
    { name: 'Marathon Session', description: 'Watch videos for 1 hour.', icon: '⏳', requiredProgress: 25 },

    // Soundboard Study Achievements
    { name: 'Sound Explorer', description: 'Play a sound from the soundboard.', icon: '🔊', requiredProgress: 30 },
    { name: 'Melody Maker', description: 'Play 5 different sounds.', icon: '🎶', requiredProgress: 35 },
    { name: 'Dedicated Student', description: 'Study for 30 minutes.', icon: '📚', requiredProgress: 40 },
    { name: 'Master of Sounds', description: 'Study for 1 hour.', icon: '💡', requiredProgress: 50 },

    // Streak & Daily Achievements
    { name: 'Daily Learner', description: 'Visit the website 3 days in a row.', icon: '📆', requiredProgress: 55 },
    { name: 'Consistency is Key', description: 'Study for 7 consecutive days.', icon: '🔥', requiredProgress: 60 },
    { name: 'Learning Streak', description: 'Watch a video or use the soundboard 10 days in a row.', icon: '🏅', requiredProgress: 65 },

    // Miscellaneous Achievements
    { name: 'Curious Explorer', description: 'Visit both Videos and Soundboard sections.', icon: '🧭', requiredProgress: 70 },
    { name: 'Active Participant', description: 'Visit the website 10 times.', icon: '⭐', requiredProgress: 75 },
    { name: 'Knowledge Seeker', description: 'Complete all previous achievements.', icon: '🎓', requiredProgress: 80 }
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

    // Check and award badges based on progress
    for (let badge of this.allBadges) {
      if (totalProgress >= badge.requiredProgress) {
        this.earnedBadges.push(badge);
      }
    }

    // Get remaining unearned badges (that are not in earnedBadges)
    let remainingUnearned = this.allBadges.filter(b => !this.earnedBadges.includes(b));

    // Ensure 4 unearned badges are always displayed
    this.unearnedBadges = remainingUnearned.slice(0, 4);
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
