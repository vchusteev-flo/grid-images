import { Component, HostListener, inject } from '@angular/core';
import {
  MatDialog,
  MatDialogActions,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { PictureService } from '../../services/app.pictures.service';
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
  pictures: any[] = [];
  isLoading = false;
  page = 1;

  constructor(private pictureService: PictureService) {
    this.loadPictures();
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
      this.loadMorePictures();
    }
  }

  private isNearBottom(): boolean {
    return (
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 100
    );
  }

  async loadPictures() {
    const newPictures = await this.pictureService.getPhotos();
    this.pictures = [...this.pictures, ...newPictures];
  }

  async loadMorePictures() {
    if (this.isLoading) return;

    this.isLoading = true;
    this.page = this.pictureService.nextPage();
    await this.loadPictures();
    this.isLoading = false;
  }
}
