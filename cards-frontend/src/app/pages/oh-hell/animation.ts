import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';

export const cardMovementAnimation = trigger('card-move', [
  state('false', style({ display: 'block', transform: 'translate3d(calc(-50% - 10px), -125%, 0)' })),
  state('true', style({ display: 'block', transform: 'translate3d(0, 0, 0)' })),
  transition('false => true', animate('0.3s 1s')),
  transition('true => false', animate('0s')),
]);

export const fadeAnimation = trigger('fade', [
  transition('true => false', [style({ opacity: 0 }), animate('0.3s', style({ opacity: 1 }))]),
  transition(':enter', [style({ opacity: 0 }), animate('0.3s', style({ opacity: 1 }))]),
  transition(':leave', [style({ opacity: 1 }), animate('0.3s', style({ opacity: 0 }))]),
]);

export const winnerFadeAnimation = trigger('winner-fade', [
  transition(':enter', [
    animate(
      '3s',
      keyframes([
        style({ opacity: 0, offset: 0 }),
        style({ opacity: 1, offset: 0.2 }),
        style({ opacity: 1, offset: 0.8 }),
        style({ opacity: 0, offset: 1.0 }),
      ])
    ),
  ]),
]);
