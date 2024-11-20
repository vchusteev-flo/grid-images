import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ImageGridComponent } from './components/image-grid/image-grid.component';
import { PictureService } from './services/app.pictures.service';
import { Decrement, Increment } from './store/counter.state';
import { SearchPictures } from './store/picutre.state';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ImageGridComponent, MatFormField, MatError, ReactiveFormsModule, MatInputModule],
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

  constructor(private store: Store, private pictureService: PictureService ) {
    this.count$ = this.store.select(state => state.counter.count)
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
  onScroll(): void {
    this.isScrolled = true;
  }
}
