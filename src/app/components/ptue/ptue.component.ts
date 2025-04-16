import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
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
  language = english;
  languageService = inject(LanguageService);

  allBadges: Badge[] = [];

  initializeBadges(): void {
    const b = this.language.badges;
    const c = this.language.badgeCategories;

    this.allBadges = [
      { name: b.firstSteps.name, icon: '📺', description: b.firstSteps.description, requiredKey: 'videoProgress', requiredValue: 5, category: c.video },
      { name: b.bingeWatcher.name, icon: '🎥', description: b.bingeWatcher.description, requiredKey: 'videoProgress', requiredValue: 10, category: c.video },
      { name: b.committedLearner.name, icon: '🎬', description: b.committedLearner.description, requiredKey: 'videoProgress', requiredValue: 15, category: c.video },
      { name: b.videoMaster.name, icon: '🏆', description: b.videoMaster.description, requiredKey: 'videoProgress', requiredValue: 20, category: c.video },
      { name: b.marathonSession.name, icon: '⏳', description: b.marathonSession.description, requiredKey: 'videoProgress', requiredValue: 25, category: c.video },

      { name: b.soundExplorer.name, icon: '🔊', description: b.soundExplorer.description, requiredKey: 'soundboardProgress', requiredValue: 10, category: c.soundboard },
      { name: b.melodyMaker.name, icon: '🎶', description: b.melodyMaker.description, requiredKey: 'soundboardProgress', requiredValue: 20, category: c.soundboard },

      { name: b.bingoBeginner.name, icon: '🎲', description: b.bingoBeginner.description, requiredKey: 'bingoProgress', requiredValue: 10, category: c.bingo },
      { name: b.bingoBoss.name, icon: '🏁', description: b.bingoBoss.description, requiredKey: 'bingoProgress', requiredValue: 50, category: c.bingo },

      { name: b.speechWalker.name, icon: '🗣️', description: b.speechWalker.description, requiredKey: 'speechWalkProgress', requiredValue: 10, category: c.speechWalk },
      { name: b.speechPro.name, icon: '🎤', description: b.speechPro.description, requiredKey: 'speechWalkProgress', requiredValue: 50, category: c.speechWalk },

      { name: b.memoryStart.name, icon: '🧠', description: b.memoryStart.description, requiredKey: 'memoryMatchProgress', requiredValue: 10, category: c.memoryMatch },
      { name: b.memoryLegend.name, icon: '👑', description: b.memoryLegend.description, requiredKey: 'memoryMatchProgress', requiredValue: 100, category: c.memoryMatch },

      { name: b.earthRookie.name, icon: '🛡️', description: b.earthRookie.description, requiredKey: 'earthDefenderProgress', requiredValue: 10, category: c.earthDefender },
      { name: b.defenderElite.name, icon: '🌍', description: b.defenderElite.description, requiredKey: 'earthDefenderProgress', requiredValue: 100, category: c.earthDefender },
    
      { name: b.fishingFirstCatch.name, icon: '🐟', description: b.fishingFirstCatch.description, requiredKey: 'fishingGameProgress', requiredValue: 1, category: c.fishing },
      { name: b.fishingNovice.name, icon: '🎣', description: b.fishingNovice.description, requiredKey: 'fishingGameProgress', requiredValue: 5, category: c.fishing },
      { name: b.fishingApprentice.name, icon: '🏅', description: b.fishingApprentice.description, requiredKey: 'fishingGameProgress', requiredValue: 10, category: c.fishing },
    ];
  }

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.languageService.getLanguage().then(lang => {
      this.language = lang;
      this.initializeBadges();
      this.computeUnearnedBadges();
    });
  }

  computeUnearnedBadges(): void {
    const progressMap: Record<ProgressKey, number> = {
      videoProgress: Number(sessionStorage.getItem('videoProgress')) || 0,
      soundboardProgress: Number(sessionStorage.getItem('soundboardProgress')) || 0,
      bingoProgress: Number(localStorage.getItem('bingoProgress')) || 0,
      speechWalkProgress: Number(localStorage.getItem('speechWalkProgress')) || 0,
      memoryMatchProgress: Number(localStorage.getItem('memoryMatchProgress')) || 0,
      earthDefenderProgress: Number(localStorage.getItem('earthDefenderProgress')) || 0,
      fishingGameProgress: Number(localStorage.getItem('fishingGameProgress')) || 0 // ✅ add this
    };
    

    const earned = this.allBadges.filter(b => progressMap[b.requiredKey] >= b.requiredValue);
    const unearned = this.allBadges.filter(b => !earned.some(e => e.name === b.name));

    this.unearnedBadgesByCategory = {};
    for (const badge of unearned) {
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
