import { animate, state, style, transition, trigger } from '@angular/animations';

export const cardMovementAnimation = trigger('card-move', [
  state('false', style({ display: 'block', transform: 'translate3d(-50%, -125%, 0)' })),
  state('true', style({ display: 'block', transform: 'translate3d(0, 0, 0)' })),
  transition('false => true', animate('0.3s 1s')),
  transition('true => false', animate('0s')),
]);
