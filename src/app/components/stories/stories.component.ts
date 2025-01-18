import { Component, inject, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-stories',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './stories.component.html',
  styleUrl: './stories.component.sass'
})
export class StoriesComponent {
  auth = inject(AuthService);
  isAdmin = false

  ngOnInit(): void {
    // Wait 1 second
    setTimeout(() => {
      this.checkAdminStatus();
    }, 1000);
  }

  async checkAdminStatus() {
    this.isAdmin = await this.auth.isAdmin()
  }

}
