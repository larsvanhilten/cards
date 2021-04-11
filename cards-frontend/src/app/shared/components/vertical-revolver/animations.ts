import { animate, state, style, transition, trigger } from '@angular/animations';

export const moveUpAnimation = trigger('moveUp', [
  state('false', style({ transform: 'translateY(0%)' })),
  state('true', style({ transform: 'translateY(-100%)' })),
  transition('false => true', animate('300ms')),
  transition('true => false', animate('0s')),
]);
