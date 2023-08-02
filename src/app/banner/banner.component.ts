import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Banner, State } from '../classes';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
  animations: [
    trigger('createDestroy', [
      state('in', style({ transform: 'translateX(0)' })),
      transition('void => *', [
        style({ transform: 'translateY(100%)' }),
        animate(100),
      ]),
      transition('* => void', [
        animate(100, style({ transform: 'translateY(100%)' })),
      ]),
    ]),
  ],
})
export class BannerComponent {
  @Input() state!: State;
  @Output() stateChange = new EventEmitter<State>();

  close(banner: Banner) {
    this.state.banners = this.state.banners.filter(
      (b) => b.uuid != banner.uuid
    );
  }
}
