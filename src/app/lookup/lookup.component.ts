import { Component, EventEmitter, Input, Output, Inject } from '@angular/core';
import { Member, State, Training } from '../classes';
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
  trainings: Training[] = [];
  member: Member | undefined | null = undefined;
  trainingsMap: Training[] = [
    { name: 'VR', value: 1024, venue: 'tech-hub' },
    { name: 'AI', value: 512, venue: 'tech-hub' },
    { name: '5G', value: 256, venue: 'tech-hub' },
    { name: 'IoT', value: 128, venue: 'tech-hub' },
    { name: '3D Scanner', value: 64, venue: '' },
    { name: 'Sewing', value: 32, venue: 'maker-space' },
    { name: 'Soldering', value: 16, venue: 'maker-space' },
    { name: 'Laser', value: 8, venue: 'maker-space' },
    { name: 'Vinyl', value: 4, venue: 'maker-space' },
    { name: 'CNC router', value: 2, venue: 'maker-space' },
    { name: '3D Printer', value: 1, venue: 'maker-space' },
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
      const value = trainingsMap[i].value;
      const tempTraining: Training = {
        name: trainingsMap[i].name,
        value: trainingsMap[i].value,
        venue: trainingsMap[i].venue,
      };
      if (trainingsValue >= value) {
        trainingsValue -= value;
        tempTraining.complete = true;
      } else {
        tempTraining.complete = false;
      }
      this.trainings.push(tempTraining);
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

  openDialog(type: string): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { member: this.member, training: type, state: this.state },
    });

    dialogRef.afterClosed().subscribe((result) => {
      const trainingValue = this.trainingsMap.find(
        (training) => training.name == type
      )! as unknown as number;

      if (result) {
        this.trainings.find((training) => training.name == type)!.complete =
          true;
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
