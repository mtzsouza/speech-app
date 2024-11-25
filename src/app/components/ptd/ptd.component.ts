import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-ptd',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './ptd.component.html',
  styleUrls: ['./ptd.component.sass']
})
export class PTDComponent {
  recentSounds = [
    { name: 'First Recent Studied Sound', percentage: 75, icon: '🎵', title: 'Activity 1', color: '#ff5722' },  // Orange
    { name: 'Second Recent Studied Sound', percentage: 50, icon: '🎸', title: 'Activity 2', color: '#4caf50' },  // Green
    { name: 'Third Recent Studied Sound', percentage: 25, icon: '🎤', title: 'Activity 3', color: '#e91e63' }   // Pink
  ];

  getStrokeDashArray(percentage: number): string {
    const radius = 60; // Updated radius
    const circumference = 2 * Math.PI * radius;
    return `${circumference} ${circumference}`;
  }
  
  getStrokeDashOffset(percentage: number): number {
    const radius = 60; // Updated radius
    const circumference = 2 * Math.PI * radius;
    return circumference - (percentage / 100) * circumference;
  }
}
