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
      title: 'viynl',
      time: '3pm',
      complete: false,
      users: [
        { name: 'a', id: 1234, upi: 'abc123', attended: true },
        { name: 'b', id: 1234, upi: 'abc123', attended: true },
      ],
    },
    {
      title: 'Lasers',
      time: '3pm',
      complete: false,
      users: [
        { name: 'a', id: 1234, upi: 'abc123', attended: true },
        { name: 'b', id: 1234, upi: 'abc123', attended: true },
      ],
    },
  ];
}
