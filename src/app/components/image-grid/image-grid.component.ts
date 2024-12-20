import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, inject } from '@angular/core';
import {
  MatDialog,
  MatDialogModule
} from '@angular/material/dialog';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { Store } from '@ngxs/store';
import { LoadMorePictures, PicturesStateModel } from '../../store/picutre.state';
import { ModalImageComponent } from '../modal-image/modal-image.component';

export interface AppState {
  pictures: PicturesStateModel;
}

type Photo = {
  id: number;
  width: number;
  height: number;
  urls: { large: string; regular: string; raw: string; small: string };
  color: string | null;
  user: {
    username: string;
    name: string;
  };
};

@Component({
  selector: 'app-image-grid',
  standalone: true,
  imports: [
    CommonModule,
    MatGridList,
    MatGridTile,
    MatDialogModule,
    NgOptimizedImage,
  ],
  templateUrl: './image-grid.component.html',
  styleUrl: './image-grid.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageGridComponent {
  readonly dialog = inject(MatDialog);
  isLoading$
  page$
  pictures$
  source$
  query$
  initialized: boolean = false;

  constructor(private store: Store) {
    this.isLoading$ = this.store.select((state: AppState) => state.pictures.isLoading)
    this.page$ = this.store.select((state: AppState) => state.pictures.page)
    this.pictures$ = this.store.select((state: AppState) => state.pictures.pictures)
    this.source$ = this.store.select((state: AppState) => state.pictures.source);
    this.query$ = this.store.select((state: AppState) => state.pictures.query);
  }

  ngOnInit() {
    this.store.select(state => state.pictures.source).subscribe(source => {
      if (source === 'load') {
        this.updatePictures();
      }
    });
  }

  updatePictures() {
     return this.store.dispatch(new LoadMorePictures());
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string, picture: Photo): void {
    const img = new Image();
    img.src = picture.urls.regular;
    
    img.onload = () => {
      const dialogWidth = Math.min(img.width, window.innerWidth * 0.45); 
      const dialogHeight = Math.min(img.height, window.innerHeight * 0.45); 
      this.dialog.open(ModalImageComponent, {
        panelClass: 'custom-dialog-container',
        minWidth: `${dialogWidth}px`,
        minHeight: `${dialogHeight}px`,
        enterAnimationDuration,
        exitAnimationDuration,
        data: { 
          imageUrl: picture.urls.regular,
          author: picture.user.name,
        }
      });
    };
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    if (this.isNearBottom()) {
      this.updatePictures()
    }
  }

  private isNearBottom(): boolean {
    return (
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 100
    );
  }
}