import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterModule } from '@angular/router';

type ProgressKey =
  | 'videoProgress'
  | 'soundboardProgress'
  | 'bingoProgress'
  | 'speechWalkProgress'
  | 'memoryMatchProgress'
  | 'earthDefenderProgress';

interface Badge {
  name: string;
  icon: string;
  description: string;
  requiredKey: ProgressKey;
  requiredValue?: number;
  customCheck?: (val: number) => boolean;
}

@Component({
  selector: 'app-pte',
  standalone: true,
  imports: [NavbarComponent, CommonModule, RouterModule],
  templateUrl: './pte.component.html',
  styleUrls: ['./pte.component.sass']
})
export class PTEComponent implements OnInit {
  earnedBadges: Badge[] = [];

  readonly allBadges: Badge[] = [
    { name: 'First Steps', icon: '📺', description: 'Watch your first video!', requiredKey: 'videoProgress', requiredValue: 5 },
    { name: 'Binge Watcher', icon: '🎥', description: 'Watch 3 videos.', requiredKey: 'videoProgress', requiredValue: 10 },
    { name: 'Committed Learner', icon: '🎬', description: 'Watch 10 videos.', requiredKey: 'videoProgress', requiredValue: 15 },
    { name: 'Video Master', icon: '🏆', description: 'Watch 25 videos.', requiredKey: 'videoProgress', requiredValue: 20 },
    { name: 'Marathon Session', icon: '⏳', description: 'Watch videos for 1 hour.', requiredKey: 'videoProgress', requiredValue: 25 },
    { name: 'Sound Explorer', icon: '🔊', description: 'Play a sound from the soundboard.', requiredKey: 'soundboardProgress', requiredValue: 30 },
    { name: 'Melody Maker', icon: '🎶', description: 'Play 5 different sounds.', requiredKey: 'soundboardProgress', requiredValue: 35 },
    { name: 'Dedicated Student', icon: '📚', description: 'Study for 30 minutes.', requiredKey: 'videoProgress', requiredValue: 40 },
    { name: 'Master of Sounds', icon: '💡', description: 'Study for 1 hour.', requiredKey: 'videoProgress', requiredValue: 50 },
    { name: 'Daily Learner', icon: '📆', description: 'Visit the website 3 days in a row.', requiredKey: 'videoProgress', requiredValue: 55 },
    { name: 'Consistency is Key', icon: '🔥', description: 'Study for 7 consecutive days.', requiredKey: 'videoProgress', requiredValue: 60 },
    { name: 'Learning Streak', icon: '🏅', description: 'Use the app 10 days in a row.', requiredKey: 'videoProgress', requiredValue: 65 },
    { name: 'Curious Explorer', icon: '🧭', description: 'Visit Videos and Soundboard.', requiredKey: 'videoProgress', requiredValue: 70 },
    { name: 'Active Participant', icon: '⭐', description: 'Visit the website 10 times.', requiredKey: 'videoProgress', requiredValue: 75 },
    { name: 'Knowledge Seeker', icon: '🎓', description: 'Complete all previous achievements.', requiredKey: 'videoProgress', requiredValue: 80 }
  ];

  ngOnInit(): void {
    const progressMap: Record<ProgressKey, number> = {
      videoProgress: Number(sessionStorage.getItem('videoProgress') || 0),
      soundboardProgress: Number(sessionStorage.getItem('soundboardProgress') || 0),
      bingoProgress: Number(localStorage.getItem('bingoProgress') || 0),
      speechWalkProgress: Number(localStorage.getItem('speechWalkProgress') || 0),
      memoryMatchProgress: Number(localStorage.getItem('memoryMatchProgress') || 0),
      earthDefenderProgress: Number(localStorage.getItem('earthDefenderProgress') || 0)
    };

    const allStored: Badge[] = JSON.parse(sessionStorage.getItem('earnedBadges') || '[]');

    this.earnedBadges = this.allBadges.filter(badge => {
      const value = progressMap[badge.requiredKey] || 0;
      return badge.customCheck?.(value) || (badge.requiredValue !== undefined && value >= badge.requiredValue);
    });

    // optional: update session storage
    sessionStorage.setItem('earnedBadges', JSON.stringify(this.earnedBadges));

    // optional: sort badges in order of achievement
    this.earnedBadges.sort((a, b) => a.requiredValue! - b.requiredValue!);
  }
}
