import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pte',
  standalone: true,
  imports: [NavbarComponent, CommonModule],
  templateUrl: './pte.component.html',
  styleUrl: './pte.component.sass'
})
export class PTEComponent implements OnInit {
  earnedBadges: any[] = [];

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

  ngOnInit(): void {
    this.loadEarnedBadges();
  }

  loadEarnedBadges(): void {
    const videoProgress = Number(sessionStorage.getItem('videoProgress')) || 0;
    const soundboardProgress = Number(sessionStorage.getItem('soundboardProgress')) || 0;
    const totalProgress = Math.max(videoProgress, soundboardProgress);


    for (let badge of this.allBadges) {
      if (totalProgress >= badge.requiredProgress) {
        this.earnedBadges.push(badge);
      }
    }
  }
}
