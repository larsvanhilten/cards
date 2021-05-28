import { Component, EventEmitter, Input, Output } from '@angular/core';
import { popUpAnimation, shakeAnimation } from './animations';

export enum ButtonStyleType {
  PRIMARY = 'PRIMARY',
  SECONDARY = 'SECONDARY',
}

@Component({
  selector: 'custom-button',
  templateUrl: './custom-button.component.html',
  styleUrls: ['./custom-button.component.scss'],
  animations: [shakeAnimation, popUpAnimation],
})
export class CustomButtonComponent {
  @Input() public style = ButtonStyleType.PRIMARY;
  @Input() public predicate: () => boolean = () => true;
  @Input() public error = '';
  @Output() public onClick = new EventEmitter<void>();

  public showError = false;
  public shake = false;
  public ButtonStyleType = ButtonStyleType;

  private timeout!: number;

  public click(): void {
    window.clearTimeout(this.timeout);
    this.showError = false;

    if (this.predicate()) {
      this.onClick.emit();
    } else {
      this.shake = true;
    }
  }

  public onShakeDone(): void {
    this.shake = false;
    this.showError = !!this.error;

    this.timeout = window.setTimeout(() => (this.showError = false), 5000);
  }
}
