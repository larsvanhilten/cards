import { Component, Input } from '@angular/core';

@Component({
  selector: 'icon',
  templateUrl: './icon.component.html',
})
export class IconComponent {
  @Input() public icon = 'comment';
  @Input() public color = 'black';
  @Input() public size = 1;

  public get src(): string {
    return `/assets/icons/${this.icon}.svg#icon`;
  }

  public get width(): string {
    const width = 18 * this.size;
    return `${width}px`;
  }
}
