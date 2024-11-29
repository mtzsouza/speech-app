import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-pth',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './pth.component.html',
  styleUrls: ['./pth.component.sass']
})
export class PTHComponent {

  constructor(private router: Router) {}

  viewEarnedBadges() {
    this.router.navigate(['/progress/earned']);
  }

  viewUnearnedBadges() {
    this.router.navigate(['/progress/unearned']);
  }
}
