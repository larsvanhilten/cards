import { Component, Input } from '@angular/core';
import { moveUpAnimation } from './animations';

@Component({
  selector: 'vertical-revolver',
  templateUrl: './vertical-revolver.component.html',
  styleUrls: ['./vertical-revolver.component.scss'],
  animations: [moveUpAnimation],
})
export class VerticalRevolverComponent {
  public moveUp = false;

  @Input() public items: string[] = [];

  public add(item: string, next?: string): void {
    this.items.push(item);
    if (next) {
      this.items.push(next);
    }

    if (this.items.length > 3) {
      this.moveUp = true;
    }
  }

  public get isEmpty(): boolean {
    return this.items.length === 0;
  }

  public shift(): void {
    if (!this.moveUp) {
      return;
    }

    this.items.shift();

    this.moveUp = false;
  }
}
