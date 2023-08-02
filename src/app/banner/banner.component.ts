import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Banner, State } from '../classes';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
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
