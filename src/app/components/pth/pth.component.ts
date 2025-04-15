import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
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
  requiredValue?: number;
  customCheck?: (value: number) => boolean;
}

@Component({
  selector: 'app-pth',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './pth.component.html',
  styleUrls: ['./pth.component.sass']
})
export class PTHComponent implements OnInit {
  earnedBadges: Badge[] = [];
  unearnedBadges: Badge[] = [];
  showConfetti = false;
  confettiPieces: any[] = [];

  readonly allBadges: Badge[] = [
    // 🎲 Bingo
    {
      name: 'Bingo Beginner',
      icon: '🎲',
      description: 'Completed 1 round of Bingo.',
      requiredKey: 'bingoProgress',
      customCheck: (val) => val >= 10
    },
    {
      name: 'Bingo Boss',
      icon: '🏁',
      description: 'Completed 5 rounds of Bingo.',
      requiredKey: 'bingoProgress',
      customCheck: (val) => val >= 50
    },

    // 🗣️ Speech-Walk
    {
      name: 'Speech Walker',
      icon: '🗣️',
      description: 'Completed 1 Speech-Walk story.',
      requiredKey: 'speechWalkProgress',
      customCheck: (val) => val >= 10
    },
    {
      name: 'Speech Pro',
      icon: '🎤',
      description: 'Completed 5 Speech-Walk stories.',
      requiredKey: 'speechWalkProgress',
      customCheck: (val) => val >= 50
    },

    // 🔊 Soundboard
    {
      name: 'Sound Explorer',
      icon: '🔊',
      description: 'Play a sound from the soundboard.',
      requiredKey: 'soundboardProgress',
      requiredValue: 10
    },
    {
      name: 'Melody Maker',
      icon: '🎶',
      description: 'Play 5 different sounds.',
      requiredKey: 'soundboardProgress',
      requiredValue: 20
    },

    // 🧠 Memory Match
    {
      name: 'Memory Start',
      icon: '🧠',
      description: 'Completed 1 Memory Match.',
      requiredKey: 'memoryMatchProgress',
      customCheck: (val) => val >= 10
    },
    {
      name: 'Memory Legend',
      icon: '👑',
      description: 'Completed 10 Memory Matches.',
      requiredKey: 'memoryMatchProgress',
      customCheck: (val) => val >= 100
    },

    // 🛡️ Earth Defender
    {
      name: 'Earth Rookie',
      icon: '🛡️',
      description: 'Played Earth Defender once.',
      requiredKey: 'earthDefenderProgress',
      customCheck: (val) => val >= 10
    },
    {
      name: 'Defender Elite',
      icon: '🌍',
      description: 'Played Earth Defender 10 times.',
      requiredKey: 'earthDefenderProgress',
      customCheck: (val) => val >= 100
    },

    // 📺 Video Progress
    {
      name: 'First Steps',
      icon: '📺',
      description: 'Watch your first video!',
      requiredKey: 'videoProgress',
      requiredValue: 5
    },
    {
      name: 'Binge Watcher',
      icon: '🎥',
      description: 'Watch 3 videos.',
      requiredKey: 'videoProgress',
      requiredValue: 10
    },
    {
      name: 'Committed Learner',
      icon: '🎬',
      description: 'Watch 10 videos.',
      requiredKey: 'videoProgress',
      requiredValue: 15
    },
    {
      name: 'Video Master',
      icon: '🏆',
      description: 'Watch 25 videos.',
      requiredKey: 'videoProgress',
      requiredValue: 20
    },
    {
      name: 'Marathon Session',
      icon: '⏳',
      description: 'Watch videos for 1 hour.',
      requiredKey: 'videoProgress',
      requiredValue: 25
    }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.checkProgressAndAwardBadges();
  }

  checkProgressAndAwardBadges(): void {
    const progressMap: Record<ProgressKey, number> = {
      videoProgress: Number(sessionStorage.getItem('videoProgress') || 0),
      soundboardProgress: Number(sessionStorage.getItem('soundboardProgress') || 0),
      bingoProgress: Number(localStorage.getItem('bingoProgress') || 0),
      speechWalkProgress: Number(localStorage.getItem('speechWalkProgress') || 0),
      memoryMatchProgress: Number(localStorage.getItem('memoryMatchProgress') || 0),
      earthDefenderProgress: Number(localStorage.getItem('earthDefenderProgress') || 0)
    };

    const prevEarned: Badge[] = JSON.parse(sessionStorage.getItem('earnedBadges') || '[]');
    this.earnedBadges = [];

    for (const badge of this.allBadges) {
      const value = progressMap[badge.requiredKey];
      const meetsCustom = badge.customCheck?.(value) ?? false;
      const meetsStandard = badge.requiredValue !== undefined && value >= badge.requiredValue;

      if (meetsCustom || meetsStandard) {
        this.earnedBadges.push(badge);
      }
    }

    const newlyEarned = this.earnedBadges.some(b =>
      !prevEarned.some(prev => prev.name === b.name)
    );

    if (newlyEarned) this.triggerConfetti();

    sessionStorage.setItem('earnedBadges', JSON.stringify(this.earnedBadges));

    this.unearnedBadges = this.allBadges.filter(
      b => !this.earnedBadges.some(e => e.name === b.name)
    ).slice(0, 4);
  }

  triggerConfetti(): void {
    this.showConfetti = true;
    this.confettiPieces = Array.from({ length: 50 }).map(() => ({
      left: Math.random() * 100 + 'vw',
      animationDuration: Math.random() * 2 + 2 + 's',
      color: this.getRandomColor()
    }));

    setTimeout(() => {
      this.showConfetti = false;
      this.confettiPieces = [];
    }, 3000);
  }

  getRandomColor(): string {
    const colors = ['#ffcc00', '#ff5733', '#33ff57', '#5733ff', '#ff33a1', '#33a1ff'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  viewEarnedBadges(): void {
    this.router.navigate(['/progress/earned']);
  }

  viewUnearnedBadges(): void {
    this.router.navigate(['/progress/unearned']);
  }

  navigateToProgress(): void {
    this.router.navigate(['/progress/data']);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
