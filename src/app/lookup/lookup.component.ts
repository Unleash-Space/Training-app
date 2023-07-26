import { Component, EventEmitter, Input, Output, Inject } from '@angular/core';
import { Member, State } from '../classes';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';

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
  trainingsMap = [
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

  constructor(public dialog: MatDialog) {}

  search() {
    this.upi = this.upi.toLowerCase();
    const member = this.state.members.find(
      (member) => member.upi.toLowerCase() == this.upi || member.ID == this.upi
    );

    if (this.state.members.length == 0) {
      this.member = null;
      this.showBanner('Data not loaded', 'error');
      return;
    }

    if (member == undefined) {
      this.member = null;
      this.showBanner('Member not found', 'info');
    } else this.member = member;

    this.updateTrainings();
  }

  updateTrainings() {
    if (!this.member) return;
    this.trainings = [];
    let trainingsValue = this.member.trainings;
    const trainingsMap = this.trainingsMap;

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

  openDialog(type: string, status: string): void {
    if (status) return;

    const dialogRef = this.dialog.open(DialogComponent, {
      data: { member: this.member, training: type, state: this.state },
    });

    dialogRef.afterClosed().subscribe((result) => {
      const trainingValue = this.trainingsMap.find(
        (training) => training[0] == type
      )! as unknown as number;

      if (result) {
        this.trainings.find((training) => training[0] == type)![1] = true;
        this.member!.trainings += trainingValue;
      }
    });
  }

  async showBanner(
    message: string,
    type: 'success' | 'info' | 'error' | 'warning',
    duration: number = 1500
  ) {
    this.state.banner.text = message;
    this.state.banner.type = type;
    this.state.banner.open = true;
    setTimeout(() => {
      this.state.banner.open = false;
    }, duration);
  }
}
