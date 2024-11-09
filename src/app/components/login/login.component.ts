import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router} from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.sass'
})
export class LoginComponent {
  // Injections
  router = inject(Router);
  auth = inject(AuthService);

  // Initialize data
  errorMessage: string | null = null;
  formData = {
    "email": "",
    "password": ""
  }

  // Log in
  onSubmit() {
    this.auth.login(this.formData.email, this.formData.password)
    .subscribe({
      next: () => {
      this.router.navigateByUrl('/');
      },
      error: (err) => {
        this.errorMessage = err.code;
      }
    })
  }
}
