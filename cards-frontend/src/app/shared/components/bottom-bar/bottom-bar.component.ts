import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'bottom-bar',
  templateUrl: './bottom-bar.component.html',
  styleUrls: ['./bottom-bar.component.scss'],
})
export class BottomBarComponent {
  @Output() public onChatClicked = new EventEmitter<void>();
  @Output() public onScoreClicked = new EventEmitter<void>();
}
