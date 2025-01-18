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

  async ngOnInit() {
    console.log(await this.auth.isAdmin());
  }

}
