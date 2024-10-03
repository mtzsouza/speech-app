import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, LoginComponent, RegisterComponent, DashboardComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.sass'
})
export class LandingComponent {
  currentPage = 'login';

  changeLandingPage(page: string) {
    this.currentPage = page;
  }
}
