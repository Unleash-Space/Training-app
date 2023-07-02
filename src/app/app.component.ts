import { Component } from '@angular/core';
import { Tab } from './classes';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  tab: Tab = 'Certification';
}
