import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router, RouterModule } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { FormsModule } from '@angular/forms';
import * as english from '../../utils/english.json';

interface Game {
  title: string;
  description: string;
  emoji: string;
  iconClass: string;
  category: 'hearing' | 'visual' | 'memory' | 'interactive';
  link: string;
}

@Component({
  selector: 'app-games',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterModule, FormsModule],
  templateUrl: './games.component.html',
  styleUrl: './games.component.sass'
})
export class GamesComponent implements OnInit {
  sortBy: string = 'default';
  filteredGames: Game[] = [];

  constructor(
    private router: Router,
    private languageService: LanguageService
  ) {}

  userLanguage = english;

  games: Game[] = [
    {
      title: 'Memory Match',
      description: 'Match pairs of sounds to improve memory and recognition',
      emoji: '🎯',
      iconClass: 'game_1',
      category: 'memory',
      link: '/matching'
    },
    {
      title: 'Earth Defender',
      description: 'Save Earth by matching correct sounds',
      emoji: '🌍',
      iconClass: 'game_2',
      category: 'interactive',
      link: '/earth-defender'
    },
    {
      title: 'Tune Your Ears',
      description: 'Train your ears to recognize sounds',
      emoji: '🎵',
      iconClass: 'game_3',
      category: 'hearing',
      link: '/tune-your-ears'
    },
    {
      title: 'Bingo',
      description: 'Classic bingo with phonetic sounds',
      emoji: '🎲',
      iconClass: 'game_4',
      category: 'visual',
      link: '/bingo'
    }
  ];

  async ngOnInit() {
    this.userLanguage = await this.languageService.getLanguage();
    this.filteredGames = [...this.games];
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  sortGames(criteria: string) {
    this.sortBy = criteria;

    switch (criteria) {
      case 'hearing':
        this.filteredGames = this.games.filter(game => game.category === 'hearing');
        break;
      case 'visual':
        this.filteredGames = this.games.filter(game => game.category === 'visual');
        break;
      case 'memory':
        this.filteredGames = this.games.filter(game => game.category === 'memory');
        break;
      case 'interactive':
        this.filteredGames = this.games.filter(game => game.category === 'interactive');
        break;
      default:
        this.filteredGames = [...this.games];
        break;
    }
  }
}
