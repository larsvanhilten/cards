import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { ButtonStyleType } from '../custom-button/custom-button.component';

@Component({
  selector: 'confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent {
  @Output() public onConfirm = new EventEmitter<void>();
  @Output() public onCancel = new EventEmitter<void>();
  @ViewChild('dialog') public dialog!: ElementRef;

  public ButtonStyleType = ButtonStyleType;

  public onClick(event: MouseEvent, element: any): void {
    const isClickInDialog = element.contains(event.target);
    if (!isClickInDialog) {
      this.onCancel.emit();
    }
  }
}
