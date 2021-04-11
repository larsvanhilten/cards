import { animate, style, transition, trigger } from '@angular/animations';

export const cardMovementAnimation = trigger('card-move', [
  transition(':enter', [
    style({ display: 'block', transform: 'translate3d(-50%, -125%, 0)' }), // initial
    animate('1s', style({ display: 'block', transform: 'translate3d(-50%, -125%, 0)' })), // final
    animate('0.3s', style({ display: 'block', transform: 'translate3d(0, 0, 0)' })), // final
  ]),
]);
