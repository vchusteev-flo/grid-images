import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, inject } from '@angular/core';
import {
  MatDialog,
  MatDialogActions,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { Store } from '@ngxs/store';
import { LoadMorePictures, PicturesStateModel } from '../../store/picutre.state';
import { DialogComponent } from '../dialog/dialog.component';

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
// interface Picture {
//   author: string;
//   download_url: string;
//   id: string;
//   url: string;
//   width: string;
//   height: string;
// }

@Component({
  selector: 'app-image-grid',
  standalone: true,
  imports: [
    CommonModule,
    MatGridList,
    MatGridTile,
    MatDialogModule,
    MatDialogActions,
    DialogComponent,
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
  initialized: boolean = false;

  constructor(private store: Store) {
    this.isLoading$ = this.store.select((state: AppState) => state.pictures.isLoading)
    this.page$ = this.store.select((state: AppState) => state.pictures.page)
    this.pictures$ = this.store.select((state: AppState) => state.pictures.pictures)
    this.source$ = this.store.select((state: AppState) => state.pictures.source);

    // this.source$.subscribe(source => {
    //   if (source === 'load') {
    //     this.updatePictures();
    //   }
    // });
  }

  ngOnInit() {
    this.store.select(state => state.pictures.source).subscribe(source => {
      console.log('store variable - source', source)
      if (source !== 'search') {
        this.updatePictures();
      }
    });
  }

  updatePictures() {
    this.store.dispatch(new LoadMorePictures())
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string, picture: Photo): void {
    const img = new Image();
    img.src = picture.urls.regular;
    
    img.onload = () => {
      const dialogWidth = Math.min(img.width, window.innerWidth * 0.45); 
      const dialogHeight = Math.min(img.height, window.innerHeight * 0.45); 
      this.dialog.open(DialogComponent, {
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