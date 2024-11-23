import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-games',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './games.component.html',
  styleUrl: './games.component.sass'
})
export class GamesComponent {

}
