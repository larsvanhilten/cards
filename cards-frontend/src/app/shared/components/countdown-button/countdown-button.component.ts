import { Component, EventEmitter, Output } from '@angular/core';
import { progressAnimation } from './animation';

@Component({
  selector: 'countdown-button',
  templateUrl: './countdown-button.component.html',
  styleUrls: ['./countdown-button.component.scss'],
  animations: [progressAnimation],
})
export class CountdownButtonComponent {
  @Output() public onComplete = new EventEmitter<void>();
}
