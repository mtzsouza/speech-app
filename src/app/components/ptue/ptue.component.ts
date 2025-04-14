import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  description: string;
  icon: string;
  requiredKey: ProgressKey;
  requiredValue: number;
  category: string;
}

@Component({
  selector: 'app-ptue',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './ptue.component.html',
  styleUrls: ['./ptue.component.sass']
})
export class PTUEComponent implements OnInit {
  unearnedBadgesByCategory: Record<string, Badge[]> = {};

  readonly allBadges: Badge[] = [
    { name: 'First Steps', icon: '📺', description: 'Watch your first video!', requiredKey: 'videoProgress', requiredValue: 5, category: 'Video Learning Achievements' },
    { name: 'Binge Watcher', icon: '🎥', description: 'Watch 3 videos.', requiredKey: 'videoProgress', requiredValue: 10, category: 'Video Learning Achievements' },
    { name: 'Committed Learner', icon: '🎬', description: 'Watch 10 videos.', requiredKey: 'videoProgress', requiredValue: 15, category: 'Video Learning Achievements' },
    { name: 'Video Master', icon: '🏆', description: 'Watch 25 videos.', requiredKey: 'videoProgress', requiredValue: 20, category: 'Video Learning Achievements' },
    { name: 'Marathon Session', icon: '⏳', description: 'Watch videos for 1 hour.', requiredKey: 'videoProgress', requiredValue: 25, category: 'Video Learning Achievements' },

    { name: 'Sound Explorer', icon: '🔊', description: 'Play a sound from the soundboard.', requiredKey: 'soundboardProgress', requiredValue: 10, category: 'Soundboard Achievements' },
    { name: 'Melody Maker', icon: '🎶', description: 'Play 5 different sounds.', requiredKey: 'soundboardProgress', requiredValue: 20, category: 'Soundboard Achievements' },

    { name: 'Bingo Beginner', icon: '🎲', description: 'Completed 1 round of Bingo.', requiredKey: 'bingoProgress', requiredValue: 10, category: 'Bingo' },
    { name: 'Bingo Boss', icon: '🏁', description: 'Completed 5 rounds of Bingo.', requiredKey: 'bingoProgress', requiredValue: 50, category: 'Bingo' },

    { name: 'Speech Walker', icon: '🗣️', description: 'Completed 1 Speech-Walk story.', requiredKey: 'speechWalkProgress', requiredValue: 10, category: 'Speech Walk' },
    { name: 'Speech Pro', icon: '🎤', description: 'Completed 5 Speech-Walk stories.', requiredKey: 'speechWalkProgress', requiredValue: 50, category: 'Speech Walk' },

    { name: 'Memory Start', icon: '🧠', description: 'Completed 1 Memory Match.', requiredKey: 'memoryMatchProgress', requiredValue: 10, category: 'Memory Match' },
    { name: 'Memory Legend', icon: '👑', description: 'Completed 10 Memory Matches.', requiredKey: 'memoryMatchProgress', requiredValue: 100, category: 'Memory Match' },

    { name: 'Earth Rookie', icon: '🛡️', description: 'Played Earth Defender once.', requiredKey: 'earthDefenderProgress', requiredValue: 10, category: 'Earth Defender' },
    { name: 'Defender Elite', icon: '🌍', description: 'Played Earth Defender 10 times.', requiredKey: 'earthDefenderProgress', requiredValue: 100, category: 'Earth Defender' }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    const progressMap: Record<ProgressKey, number> = {
      videoProgress: Number(sessionStorage.getItem('videoProgress')) || 0,
      soundboardProgress: Number(sessionStorage.getItem('soundboardProgress')) || 0,
      bingoProgress: Number(localStorage.getItem('bingoProgress')) || 0,
      speechWalkProgress: Number(localStorage.getItem('speechWalkProgress')) || 0,
      memoryMatchProgress: Number(localStorage.getItem('memoryMatchProgress')) || 0,
      earthDefenderProgress: Number(localStorage.getItem('earthDefenderProgress')) || 0
    };

    const earnedBadges = this.allBadges.filter(
      badge => progressMap[badge.requiredKey] >= badge.requiredValue
    );

    const unearnedBadges = this.allBadges.filter(
      badge => !earnedBadges.some(earned => earned.name === badge.name)
    );

    this.unearnedBadgesByCategory = {};
    for (const badge of unearnedBadges) {
      if (!this.unearnedBadgesByCategory[badge.category]) {
        this.unearnedBadgesByCategory[badge.category] = [];
      }
      this.unearnedBadgesByCategory[badge.category].push(badge);
    }
  }

  goBack(): void {
    this.router.navigate(['/progress']);
  }
}
