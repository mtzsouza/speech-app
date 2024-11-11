import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';  // Adjust the path as necessary
import { FormsModule } from '@angular/forms';  // Ensure FormsModule is imported
import { Location } from '@angular/common';    // Import Location for navigating back

@Component({
  selector: 'app-update-name',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './update-name.component.html',
  styleUrls: ['./update-name.component.sass']
})
export class UpdateNameComponent implements OnInit {
  currentUsername: string | null | undefined = ''; // Store current username
  newUsername: string = ''; // New username input

  constructor(private authService: AuthService, private location: Location) {}  // Inject Location

  ngOnInit(): void {
    // Fetch the current username when the component is initialized
    this.currentUsername = this.authService.getUsername();
  }

  onSubmit() {
    if (this.newUsername.trim()) {
      this.authService.updateUsername(this.newUsername.trim()).subscribe(
        () => {
          console.log('Username updated successfully');
          this.currentUsername = this.newUsername;
          this.newUsername = ''; // Clear the input field

          // Navigate back to the previous page after updating the username
          this.location.back();
        },
        error => console.error('Error updating username:', error)
      );
    }
  }

  onCancel() {
    this.location.back(); // Navigate to the previous page
  }
}
