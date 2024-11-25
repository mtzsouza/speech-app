import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';


@Component({
  selector: 'app-pte',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './pte.component.html',
  styleUrl: './pte.component.sass'
})
export class PTEComponent {

}
