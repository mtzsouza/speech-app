import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-ptue',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent
  ],
  templateUrl: './ptue.component.html',
  styleUrls: ['./ptue.component.sass']
})
export class PTUEComponent {
  constructor(private router: Router) {}

  goBack(): void {
    this.router.navigate(['/progress']);
  }
}
