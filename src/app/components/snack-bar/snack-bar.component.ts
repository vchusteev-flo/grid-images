import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBar,
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
  MatSnackBarRef,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-snack-bar',
  standalone: true,
  templateUrl: 'snack-bar.component.html',
  styleUrl: 'snack-bar.component.css',
  imports: [MatFormFieldModule, FormsModule, MatInputModule, MatButtonModule],
})
export class SnackBarComponent {
  private _snackBar = inject(MatSnackBar);
  @Input() username: string = '';

  durationInSeconds = 5;
  ngOnInit() {
    this.openSnackBar();
  }

  openSnackBar() {
    this._snackBar.openFromComponent(PizzaPartyAnnotatedComponent, {
      duration: this.durationInSeconds * 1000,
      data: { username: this.username },
    });
  }
}

@Component({
  selector: 'snack-bar-annotated-component-example-snack',
  templateUrl: 'snack-bar-annotated-component-example-snack.html',
  standalone: true,
  styles: `
    :host {
      display: flex;
    }

    .example-pizza-party {
      color: hotpink;
    }
  `,
  imports: [MatButtonModule, MatSnackBarLabel, MatSnackBarActions, MatSnackBarAction],
})
export class PizzaPartyAnnotatedComponent {
  snackBarRef = inject(MatSnackBarRef);
  username: string = inject(MAT_SNACK_BAR_DATA).username;

}
