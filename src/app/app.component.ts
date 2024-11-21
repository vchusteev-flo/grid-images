import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatError, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterOutlet } from '@angular/router';
import { AmplifyAuthenticatorModule } from '@aws-amplify/ui-angular';
import { Store } from '@ngxs/store';
import { Amplify } from 'aws-amplify';
import { Observable } from 'rxjs';

import outputs from '../../amplify_outputs.json';
import { ImageGridComponent } from './components/image-grid/image-grid.component';
import { PictureService } from './services/app.pictures.service';
import { AuthService } from './services/auth.service';
import { Decrement, Increment } from './store/counter.state';
import { SearchPictures } from './store/picutre.state';


Amplify.configure(outputs);
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ImageGridComponent, MatFormField, MatError, ReactiveFormsModule, MatInputModule, AmplifyAuthenticatorModule, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [
    trigger('moveToTop', [
      state('begin', style({
        width: '50%',
        position: 'fixed',
        left: '50%',
        top: '50%',
        zIndex: '1',
        transform: 'translate(-50%, -50%)'
      })),
      state('finish', style({
        width: '100%',
        position: 'fixed',
        left: '50%',
        top: '0',
        zIndex: '1',
        transform: 'translateX(-50%)'
      })),
      transition('begin => finish', [
        animate('0.8s cubic-bezier(0.4, 0.0, 0.2, 1)')
      ]),
      transition('finish => begin', [
        animate('0.8s cubic-bezier(0.4, 0.0, 0.2, 1)')
      ])
    ])
  ],
})
export class AppComponent {
  count$: Observable<number>;
  searchControl = new FormControl('', [Validators.required]);
  isScrolled = false;
  isLoginVisible = false;

  constructor(private store: Store, private pictureService: PictureService, private authService: AuthService ) {
    this.count$ = this.store.select(state => state.counter.count)
  }

  async showUser() {
    return await this.authService.getCurrentAuthenticatedUser();
  }

  showLogin(event: Event) {
    event?.preventDefault();
    this.isLoginVisible = true;
    const logginButton = event.target as HTMLElement
    const parentNode = logginButton.parentNode as HTMLElement
    const input = parentNode.previousSibling as HTMLElement
    if (input) {
      (document.activeElement as HTMLElement).blur();
    }
  }

  increment(event: Event) {
    event.preventDefault();
    this.store.dispatch(new Increment());
  }

  decrement(event: Event) {
    event.preventDefault();
    this.store.dispatch(new Decrement());
  }

  async search($event: Event) {
    $event.preventDefault();
    if(this.searchControl.value !== null) {
      this.store.dispatch(new SearchPictures(this.searchControl.value))
    }
  }

  @HostListener('window:scroll', ['$event'])
  async onScroll(): Promise<void> {
    this.isScrolled = true;
  }

  @HostListener('window:keydown.escape', ['$event'])
  onEscPressed($event: Event): void {
    if (this.isLoginVisible) {
    this.isLoginVisible = false;
    }
  }
}
