import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Member, State } from '../classes';
import trainingList from './../trainings.json';

@Component({
  selector: 'app-lookup',
  templateUrl: './lookup.component.html',
  styleUrls: ['./lookup.component.scss'],
})
export class LookupComponent {
  @Input() state!: State;
  @Output() stateChange = new EventEmitter<State>();
  upi: string = '';
  trainings: any[] = [];
  member: Member | undefined | null = undefined;

  search() {
    const member = this.state.members.find(
      (member) => member.upi == this.upi || member.ID == this.upi
    );

    if (member == undefined) this.member = null;
    else this.member = member;

    this.updateTrainings();
  }

  updateTrainings() {
    if (!this.member) return;
    this.trainings = [];
    let trainingsValue = this.member.trainings;

    const trainingsMap = [
      ['VR', 1024],
      ['AI', 512],
      ['5G', 256],
      ['IoT', 128],
      ['3D Scanner', 64],
      ['sewing', 32],
      ['Soldering', 16],
      ['Laser', 8],
      ['Vinyl', 4],
      ['CNC router', 2],
      ['3D Printer', 1],
    ];

    for (let i = 0; i < trainingsMap.length; i++) {
      const value = trainingsMap[i][1] as number;
      if (trainingsValue >= value) {
        trainingsValue -= value;
        this.trainings.push([trainingsMap[i][0], true]);
      } else this.trainings.push([trainingsMap[i][0], false]);
    }
  }
}
