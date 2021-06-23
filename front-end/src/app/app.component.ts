import { eventbriteEvent } from './classes';
import { ApiService } from './api.service';
import { AfterContentInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterContentInit {
  title = 'front-end';
  trainings: any = [];
  selectedFacilitator = 'FRED!';
  selectedEvent = { title: 'router' };

  constructor(public api: ApiService) {}

  async ngAfterContentInit() {
    // this.trainings = await this.api.getTodaysEvents();
    // console.log(this.trainings);
  }

  login() {
    this.api.signIn();
  }

  submitData() {
    var table = '';

    if (this.selectedEvent.title.includes('router')) {
      table = 'CNC Router';
    }

    const body = {
      values: [
        ['1/1/1', 768485633, this.selectedFacilitator],
        ['1/1/1', 12345, this.selectedFacilitator],
      ],
    };

    this.api.insertData(body, table);
  }
}
