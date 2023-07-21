import {
  Component,
  Input,
  Output,
  EventEmitter,
  AfterContentInit,
} from '@angular/core';
import { State, Tab } from '../classes';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements AfterContentInit {
  @Input() state!: State;
  @Output() stateChange = new EventEmitter<State>();

  ngAfterContentInit() {
    if (!this.state.tab) {
      this.state.tab = 'Training';
    }
  }

  switchTab(tab: Tab) {
    this.state.tab = tab;
    this.stateChange.emit(this.state);
  }
}
