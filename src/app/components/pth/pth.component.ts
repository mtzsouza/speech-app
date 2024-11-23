import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pth',
  standalone: true,
  imports: [],
  templateUrl: './pth.component.html',
  styleUrls: ['./pth.component.sass']
})
export class PTHComponent {

  constructor(private router: Router) {}

  viewEarnedBadges() {
    this.router.navigate(['/progressTrackingEarned']);
  }

  viewUnearnedBadges() {
    this.router.navigate(['/progressTrackingUnearned']);
  }
}
