import { animate, style, transition, trigger } from '@angular/animations';

export const progressAnimation = trigger('progress', [
  transition(':enter', [style({ width: '0%' }), animate('{{ time }}', style({ width: '100%' }))], { params: { time: '10s' } }),
]);
