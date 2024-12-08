import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-stories',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './stories.component.html',
  styleUrl: './stories.component.sass'
})
export class StoriesComponent {

}
