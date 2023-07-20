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
    this.upi = this.upi.toLowerCase();
    const member = this.state.members.find(
      (member) => member.upi.toLowerCase() == this.upi || member.ID == this.upi
    );

    if (this.state.members.length == 0) {
      this.member = null;
      this.showBanner('Data not loaded', 'error');
      return
    }

    if (member == undefined) {
      this.member = null;
      this.showBanner('Member not found', 'info');
    }
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
      ['Sewing', 32],
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

  softSubmit() {
    this.member = null;
    if (this.upi == null) return;
    // must be 6,7 or 9 characters long for all UPI/ID lengths
    if (this.upi.length < 7) return;
    if (this.upi.length == 8) return;
    if (this.upi.length > 9) return;
    this.search();
  }

  async showBanner(message: string, type: 'success' | 'info' | 'error' | 'warning', duration: number = 1500) {
    this.state.banner.text = message;
    this.state.banner.type = type;
    this.state.banner.open = true;
    setTimeout(() => {
      this.state.banner.open = false;
    }, duration);
  }
}
