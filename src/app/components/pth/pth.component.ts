import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import * as english from '../../utils/english.json';

type ProgressKey =
  | 'videoProgress'
  | 'soundboardProgress'
  | 'bingoProgress'
  | 'speechWalkProgress'
  | 'memoryMatchProgress'
  | 'earthDefenderProgress'
  | 'fishingGameProgress';

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
  languageService = inject(LanguageService);
  language = english;

  allBadges: Badge[] = [];

  initializeBadges(): void {
    const b = this.language.badges;
  
    this.allBadges = [
      { name: b.bingoBeginner.name, description: b.bingoBeginner.description, icon: '🎲', requiredKey: 'bingoProgress', customCheck: val => val >= 10 },
      { name: b.bingoBoss.name, description: b.bingoBoss.description, icon: '🏁', requiredKey: 'bingoProgress', customCheck: val => val >= 50 },
      { name: b.speechWalker.name, description: b.speechWalker.description, icon: '🗣️', requiredKey: 'speechWalkProgress', customCheck: val => val >= 10 },
      { name: b.speechPro.name, description: b.speechPro.description, icon: '🎤', requiredKey: 'speechWalkProgress', customCheck: val => val >= 50 },
      { name: b.soundExplorer.name, description: b.soundExplorer.description, icon: '🔊', requiredKey: 'soundboardProgress', requiredValue: 10 },
      { name: b.melodyMaker.name, description: b.melodyMaker.description, icon: '🎶', requiredKey: 'soundboardProgress', requiredValue: 20 },
      { name: b.memoryStart.name, description: b.memoryStart.description, icon: '🧠', requiredKey: 'memoryMatchProgress', customCheck: val => val >= 10 },
      { name: b.memoryLegend.name, description: b.memoryLegend.description, icon: '👑', requiredKey: 'memoryMatchProgress', customCheck: val => val >= 100 },
      { name: b.earthRookie.name, description: b.earthRookie.description, icon: '🛡️', requiredKey: 'earthDefenderProgress', customCheck: val => val >= 10 },
      { name: b.defenderElite.name, description: b.defenderElite.description, icon: '🌍', requiredKey: 'earthDefenderProgress', customCheck: val => val >= 100 },
      { name: b.firstSteps.name, description: b.firstSteps.description, icon: '📺', requiredKey: 'videoProgress', requiredValue: 5 },
      { name: b.bingeWatcher.name, description: b.bingeWatcher.description, icon: '🎥', requiredKey: 'videoProgress', requiredValue: 10 },
      { name: b.committedLearner.name, description: b.committedLearner.description, icon: '🎬', requiredKey: 'videoProgress', requiredValue: 15 },
      { name: b.videoMaster.name, description: b.videoMaster.description, icon: '🏆', requiredKey: 'videoProgress', requiredValue: 20 },
      { name: b.marathonSession.name, description: b.marathonSession.description, icon: '⏳', requiredKey: 'videoProgress', requiredValue: 25 },
      { name: b.fishingFirstCatch.name, description: b.fishingFirstCatch.description, icon: '🐟', requiredKey: 'fishingGameProgress', requiredValue: 1 },
      { name: b.fishingNovice.name, description: b.fishingNovice.description, icon: '🎣', requiredKey: 'fishingGameProgress', requiredValue: 5 },
      { name: b.fishingApprentice.name, description: b.fishingApprentice.description, icon: '🏅', requiredKey: 'fishingGameProgress', requiredValue: 10 },      
    ];
  }

  constructor(private router: Router) {}

  ngOnInit() {
    this.languageService.getLanguage().then(lang => {
      this.language = lang;
      this.initializeBadges();
      this.checkProgressAndAwardBadges();
    });
  }

  checkProgressAndAwardBadges(): void {
    const progressMap: Record<ProgressKey, number> = {
      videoProgress: Number(sessionStorage.getItem('videoProgress') || 0),
      soundboardProgress: Number(sessionStorage.getItem('soundboardProgress') || 0),
      bingoProgress: Number(localStorage.getItem('bingoProgress') || 0),
      speechWalkProgress: Number(localStorage.getItem('speechWalkProgress') || 0),
      memoryMatchProgress: Number(localStorage.getItem('memoryMatchProgress') || 0),
      earthDefenderProgress: Number(localStorage.getItem('earthDefenderProgress') || 0),
      fishingGameProgress: Number(localStorage.getItem('fishingGameProgress') || 0) // 👈 add this
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
