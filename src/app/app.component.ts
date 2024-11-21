import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { AmplifyAuthenticatorModule } from '@aws-amplify/ui-angular';
import { Amplify } from 'aws-amplify';

import outputs from '../../amplify_outputs.json';
import { ImageGridComponent } from './components/image-grid/image-grid.component';
import { SearchFormComponent } from './components/search-form/search-form.component';
import { SnackBarComponent } from "./components/snack-bar/snack-bar.component";
import { AuthService } from './services/auth.service';

Amplify.configure(outputs);
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ImageGridComponent, ReactiveFormsModule, AmplifyAuthenticatorModule, SnackBarComponent, SearchFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
 
})
export class AppComponent {
  isLoginVisible = false;
  isAuthenticated = false;

  constructor(private authService: AuthService ) {}

  showLoginForm(state: string) {
    if (state === 'true') this.isLoginVisible = true;
    return
  }

  async showUser() {
    return await this.authService.getCurrentAuthenticatedUser();
  }
  
  @HostListener('window:keydown.escape', ['$event'])
  onEscPressed($event: Event): void {
    if (this.isLoginVisible) {
    this.isLoginVisible = false;
    }
  }
}
