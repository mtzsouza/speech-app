import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-recover',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './recover.component.html',
  styleUrl: './recover.component.sass'
})
export class RecoverComponent {
    router = inject(Router)
    auth = inject(AuthService)

    // Initialize data
    formData = {
      "email": "",
    }

    // Send recovery email
    onSubmit() {
      this.auth.resetPassword(this.formData.email)
      .subscribe({
        next: () => {
          alert("If this email is associated with an account, a recovery email was sent.")
          this.router.navigateByUrl("/login")
        }
      })
    }

}
