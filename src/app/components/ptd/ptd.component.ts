import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ptd',
  templateUrl: './ptd.component.html',
  styleUrls: ['./ptd.component.sass'],
  standalone: true,
  imports: [NavbarComponent, CommonModule]
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
          name: 'Stories',
          percentage: 25, // Placeholder value for now
          icon: '📖',
          title: 'Stories',
          color: '#673ab7'
      }
    ];
  }

  navigateTo(title: string): void {
    const routes: { [key: string]: string } = {
      'Videos': '/videos',
      'Soundboard': '/soundboard'
    };
  
    if (routes[title]) {
      this.router.navigate([routes[title]]);
    }
  }
}