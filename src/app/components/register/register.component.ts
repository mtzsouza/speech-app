import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.sass'
})
export class RegisterComponent {
  http = inject(HttpClient);
  router = inject(Router);
  auth = inject(AuthService);

  // Initialize data
  errorMessage: string | null = null;
  formData = {
    "email": "",
    "username": "",
    "password": ""
  }

  // Register
  onSubmit() {
    this.auth.register(this.formData.email, this.formData.username, this.formData.password)
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
