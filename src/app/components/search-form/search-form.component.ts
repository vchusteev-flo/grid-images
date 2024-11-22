import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, computed, EventEmitter, HostListener, input, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatError, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Store } from '@ngxs/store';
import { AuthService } from 'src/app/services/auth.service';
import { SearchPictures } from 'src/app/store/picutre.state';

@Component({
  selector: 'app-search-form',
  standalone: true,
  imports: [MatError, MatFormField, FormsModule, MatInputModule, ReactiveFormsModule, MatButtonModule],
  templateUrl: './search-form.component.html',
  styleUrl: './search-form.component.css',
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
export class SearchFormComponent {
  @Output() isLoginFormVisible = new EventEmitter();
  searchControl = new FormControl('', [Validators.required]);
  isScrolled = false;
  username = input('');
  userIsAuthenticated = computed(() => this.username() !== '');

  constructor(private store: Store, private authService: AuthService) {}

  async search($event: Event) {
    $event.preventDefault();
    if(this.searchControl.value !== null) {
      this.store.dispatch(new SearchPictures(this.searchControl.value))
    }
  }

  showLogin(event: Event) {
    event?.preventDefault();
    this.isLoginFormVisible.emit('true');
    const logginButton = event.target as HTMLElement
    const parentNode = logginButton.parentNode as HTMLElement
    const input = parentNode.previousSibling as HTMLElement
    if (input) {
      (document.activeElement as HTMLElement).blur();
    }
  }

  signOut() {
    this.authService.signOut();
  }
  @HostListener('window:scroll', ['$event'])
  async onScroll(): Promise<void> {
    this.isScrolled = true;
  }
}