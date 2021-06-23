import { eventbriteEvent } from './classes';
import { ApiService } from './api.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'front-end';
  trainings: any = [];

  constructor(public api: ApiService) {}

  async ngOnInit() {
    this.trainings = await this.api.getTodaysEvents();

    console.log(this.trainings);
  }
}
