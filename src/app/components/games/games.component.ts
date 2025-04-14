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
  category: 'hearing' | 'speaking' | 'phonetics' | 'interactive';
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
      category: 'hearing',
      link: '/matching'
    },
    {
      title: 'Earth Defender',
      description: 'Save Earth by matching correct phonetic characters',
      emoji: '🌍',
      iconClass: 'game_2',
      category: 'phonetics',
      link: '/earth-defender'
    },
    {
      title: 'Tune Your Ears',
      description: 'Train your ears to recognize minimal pairs',
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
      category: 'hearing',
      link: '/bingo'
    },
    {
      title: 'Game 5',
      description: 'Description of the game',
      emoji: '🎲',
      iconClass: 'game_5',
      category: 'speaking',
      link: '/games'
    },
    {
      title: 'Phonetic Fishing',
      description: 'Catch fish by practicing pronunciation',
      emoji: '🎣',
      iconClass: 'game_6',
      category: 'speaking',
      link: '/phonetic-fishing'
    },
    {
      title: 'Game 7',
      description: 'Description of the game',
      emoji: '🎲',
      iconClass: 'game_7',
      category: 'speaking',
      link: '/games'
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
      case 'speaking':
        this.filteredGames = this.games.filter(game => game.category === 'speaking');
        break;
      case 'phonetics':
        this.filteredGames = this.games.filter(game => game.category === 'phonetics');
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
