import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ptd',
  templateUrl: './ptd.component.html',
  styleUrls: ['./ptd.component.sass'],
  standalone: true,
  imports: [NavbarComponent, CommonModule, RouterModule] // Add RouterModule
})

export class PTDComponent implements OnInit {
  recentSounds: any[] = [];
  lastActivity: string | null = null;
  mostRecentSound: string | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadProgress();
  }

  getStrokeDashArray(percentage: number): string {
    const radius = 100; // Same radius as defined in the SVG
    const circumference = 2 * Math.PI * radius;
    return `${circumference} ${circumference}`;
  }

  getStrokeDashOffset(percentage: number): number {
    const radius = 100;
    const circumference = 2 * Math.PI * radius;
    return circumference - (percentage / 100) * circumference;
  }

  private loadProgress(): void {
    const videoProgress = Number(sessionStorage.getItem('videoProgress')) || 0;
    const soundboardProgress = Number(sessionStorage.getItem('soundboardProgress')) || 0;
    const bingoProgress = Number(localStorage.getItem('bingoProgress')) || 0;
    const memoryProgress = Number(localStorage.getItem('memoryMatchProgress')) || 0;
    const edProgress = Number(localStorage.getItem('earthDefenderProgress')) || 0;
    const speechWalkProgress = Number(localStorage.getItem('speechWalkProgress')) || 0;




    this.recentSounds = [
      {
        name: 'Videos Watched',
        percentage: videoProgress,
        icon: '🎬',
        title: 'Videos',
        color: '#2196f3'
      },
      {
        name: 'Sounds Played',
        percentage: soundboardProgress,
        icon: '🔊',
        title: 'Soundboard',
        color: '#ff9800'
      },
      {
        name: 'Memory Match',
        percentage: memoryProgress,
        icon: '🧠',
        title: 'Memory Match',
        color: '#009688'
      },
      {
        name: 'Earth Defender',
        percentage: edProgress,
        icon: '🌍',
        title: 'Earth Defender',
        color: '#4caf50'
      },
      {
        name: 'Tune Your Ears',
        percentage: 0, //NEED MAT HERE
        icon: '🎧',
        title: 'Tune Your Ears',
        color: '#00bcd4'
      },
      {
        name: 'Bingo',
        percentage: bingoProgress,
        icon: '🎱',
        title: 'Bingo',
        color: '#9c27b0'
      },
      {
        name: 'Speech Walk',
        percentage: speechWalkProgress,
        icon: '🚶‍♂️',
        title: 'Speech Walk',
        color: '#3f51b5'
      },
      {
        name: 'Game X',
        percentage: 0,
        icon: '🎯',
        title: 'Game X',
        color: '#ff5722'
      },
      {
        name: 'Game Y',
        percentage: 0,
        icon: '🕹️',
        title: 'Game Y',
        color: '#607d8b'
      }
    ];
  }

  navigateTo(title: string): void {
    const routes: { [key: string]: string } = {
      'Videos': '/videos',
      'Soundboard': '/soundboard',
      'Memory Match': '/matching',
      'Earth Defender': '/earth-defender',
      'Tune Your Ears': '/tune-your-ears',
      'Bingo': '/bingo',
      'Speech Walk': '/speech-walk',
      'Game X': '/game-x',
      'Game Y': '/game-y'
    };
  
    if (routes[title]) {
      this.router.navigate([routes[title]]);
    }
  }

  goBack(): void {
    this.router.navigate(['/progress']);
  }
}