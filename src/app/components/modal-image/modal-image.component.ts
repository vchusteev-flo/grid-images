import { ChangeDetectionStrategy, Component, inject, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: 'modal-image.component.html',
  styleUrl: 'modal-image.component.css',
  standalone: true,
  imports: [MatButtonModule, MatDialogContent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalImageComponent {
  readonly dialogRef = inject(MatDialogRef<ModalImageComponent>);
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      imageUrl: string;
        alt: string;
    }
  ) {}
}
