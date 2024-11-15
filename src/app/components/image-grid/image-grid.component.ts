import { CommonModule } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import {
  MatDialog,
  MatDialogActions,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { Store } from '@ngxs/store';
import { LoadMorePictures } from '../../store/picutre.state';
import { DialogComponent } from '../dialog/dialog.component';

interface Picture {
  author: string;
  download_url: string;
  id: string;
  url: string;
  width: string;
  height: string;
}

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
})
export class ImageGridComponent {
  readonly dialog = inject(MatDialog);
  isLoading$
  page$
  pictures$

  constructor(private store: Store) {
    this.isLoading$ = this.store.select(state => state.pictures.isLoading)
    this.page$ = this.store.select(state => state.pictures.page)
    this.pictures$ = this.store.select(state => state.pictures.pictures)
    this.updatePictures();
  }

  updatePictures() {
    this.store.dispatch(new LoadMorePictures())
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string, picture: Picture): void {
    const img = new Image();
    img.src = picture.download_url;
    
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
          imageUrl: picture.download_url,
          author: picture.author
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