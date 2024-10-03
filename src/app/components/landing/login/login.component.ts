import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router} from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.sass'
})
export class LoginComponent {
  // Injections
  http = inject(HttpClient);
  router = inject(Router);
  authService = inject(AuthService);

  // Switch to register panel
  @Output('changeLandingPage')
  changeLandingPage: EventEmitter<{ page: string }> = new EventEmitter();
  openRegisterPage() {
    this.changeLandingPage.emit({page: 'register'});
  }

  // Initialize data
  errorMessage: string | null = null;
  formData = {
    "email": "",
    "password": ""
  }

  // Log in
  onSubmit() {
    this.authService.login(this.formData.email, this.formData.password)
    .subscribe({
      next: () => {
      this.router.navigateByUrl('/');
      },
      error: (err) => {
        this.errorMessage = err.code;
      }
    }
    )
  }
}
