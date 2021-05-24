import { Component, EventEmitter, Input, Output } from '@angular/core';
import { shakeAnimation } from './animations';

@Component({
  selector: 'custom-button',
  templateUrl: './custom-button.component.html',
  styleUrls: ['./custom-button.component.scss'],
  animations: [shakeAnimation],
})
export class CustomButtonComponent {
  @Input() public predicate: () => boolean = () => true;
  @Output() public onClick = new EventEmitter<void>();

  public shake = false;

  public click(): void {
    if (this.predicate()) {
      this.onClick.emit();
    } else {
      this.shake = true;
    }
  }
}
