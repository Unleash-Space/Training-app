import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'front-end';
  trainings = [
    {
      title: '23 June 2021 / 9AM / Viny cutter practice',
      time: '3pm',
      complete: false,
      users: [
        { name: 'a', id: 1234, upi: 'abc123', attended: true },
        { name: 'b', id: 1234, upi: 'abc123', attended: true },
      ],
    },
    {
      title: '23 June 2021 / 9AM / Sewing machine practice',
      time: '3pm',
      complete: false,
      users: [
        { name: 'a', id: 1234, upi: 'abc123', attended: true },
        { name: 'b', id: 1234, upi: 'abc123', attended: true },
      ],
    },
    {
      title: '23 June 2021 / 9:30AM / Laser cutter practice',
      time: '3pm',
      complete: false,
      users: [
        { name: 'a', id: 1234, upi: 'abc123', attended: true },
        { name: 'b', id: 1234, upi: 'abc123', attended: true },
      ],
    },
  ];
  attendees = [
    {
      name: 'Hayden Moore',
      upi: 'hmoo908',
      id: '8169070',
    },
    {
      name: 'Etienne Naude',
      upi: 'enaud123',
      id: '123456789',
    },
    {
      name: 'Test Student',
      upi: 'tstud666',
      id: '666666666',
    },
  ];
}
