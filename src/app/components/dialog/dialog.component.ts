import { ChangeDetectionStrategy, Component, inject, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA, MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: 'dialog.component.html',
  styleUrl: 'dialog.component.css',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogComponent {
  readonly dialogRef = inject(MatDialogRef<DialogComponent>);
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      imageUrl: string;
        alt: string;
    }
  ) {}
}
