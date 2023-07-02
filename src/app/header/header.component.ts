import {
  Component,
  Input,
  Output,
  EventEmitter,
  AfterContentInit,
} from '@angular/core';
import { Tab } from '../classes';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements AfterContentInit {
  @Input() tab!: Tab;
  @Output() tabChange = new EventEmitter<Tab>();

  ngAfterContentInit() {
    console.log(this.tab);
    if (!this.tab) {
      this.tab = 'Training';
    }
  }

  switchTab(tab: Tab) {
    this.tab = tab;
    this.tabChange.emit(tab);
  }
}
