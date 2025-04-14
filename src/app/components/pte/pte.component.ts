import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-pte',
  standalone: true,
  imports: [NavbarComponent, CommonModule, RouterModule],
  templateUrl: './pte.component.html',
  styleUrls: ['./pte.component.sass']
})
export class PTEComponent implements OnInit {
  earnedBadges: any[] = [];

  allBadges = [
    { name: 'First Steps', icon: '📺', description: 'Watch your first video!', requiredProgress: 5 },
    { name: 'Binge Watcher', icon: '🎥', description: 'Watch 3 videos.', requiredProgress: 10 },
    { name: 'Committed Learner', icon: '🎬', description: 'Watch 10 videos.', requiredProgress: 15 },
    { name: 'Video Master', icon: '🏆', description: 'Watch 25 videos.', requiredProgress: 20 },
    { name: 'Marathon Session', icon: '⏳', description: 'Watch videos for 1 hour.', requiredProgress: 25 },
    { name: 'Sound Explorer', icon: '🔊', description: 'Play a sound from the soundboard.', requiredProgress: 30 },
    { name: 'Melody Maker', icon: '🎶', description: 'Play 5 different sounds.', requiredProgress: 35 },
    { name: 'Dedicated Student', icon: '📚', description: 'Study for 30 minutes.', requiredProgress: 40 },
    { name: 'Master of Sounds', icon: '💡', description: 'Study for 1 hour.', requiredProgress: 50 },
    { name: 'Daily Learner', icon: '📆', description: 'Visit the website 3 days in a row.', requiredProgress: 55 },
    { name: 'Consistency is Key', icon: '🔥', description: 'Study for 7 consecutive days.', requiredProgress: 60 },
    { name: 'Learning Streak', icon: '🏅', description: 'Watch a video or use the soundboard 10 days in a row.', requiredProgress: 65 },
    { name: 'Curious Explorer', icon: '🧭', description: 'Visit both Videos and Soundboard sections.', requiredProgress: 70 },
    { name: 'Active Participant', icon: '⭐', description: 'Visit the website 10 times.', requiredProgress: 75 },
    { name: 'Knowledge Seeker', icon: '🎓', description: 'Complete all previous achievements.', requiredProgress: 80 }
  ];

  ngOnInit(): void {
    const videoProgress = Number(sessionStorage.getItem('videoProgress')) || 0;
    const soundboardProgress = Number(sessionStorage.getItem('soundboardProgress')) || 0;
    const totalProgress = Math.max(videoProgress, soundboardProgress);

    this.earnedBadges = this.allBadges.filter(badge => totalProgress >= badge.requiredProgress);
  }
}
