import { Component } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import pairs from './assets/pairs.json'

@Component({
  selector: 'app-tune',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './tune.component.html',
  styleUrl: './tune.component.sass'
})
export class TuneComponent {
  pairs = pairs;
  menuActive = true;
  gameActive = false;
  gameData = {
    "word": "",
    "correctSound": "",
    "wrongSound": ""
  }

  startGame(pair: any) {
    this.menuActive = false;
    this.gameActive = true;

    
  }
}
