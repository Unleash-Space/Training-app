import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Member, State, Training } from '../classes';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { BannerService } from '../services/banner.service';
import { DataService } from '../services/data.service';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-lookup',
  templateUrl: './lookup.component.html',
  styleUrls: ['./lookup.component.scss'],
  animations: [
    trigger('createDestroy', [
      state('in', style({ transform: 'translateX(0)' })),
      transition('void => *', [
        style({ transform: 'translateX(100%)' }),
        animate(100),
      ]),
      transition('* => void', [
        animate(100, style({ transform: 'translateX(100%)' })),
      ]),
    ]),
  ],
})
export class LookupComponent {
  @Input() state!: State;
  @Output() stateChange = new EventEmitter<State>();
  upi: string = '';
  trainings: Training[] = [];
  bannerUuid: string = '';
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

  constructor(
    public dialog: MatDialog,
    public banner: BannerService,
    public data: DataService
  ) {}

  search(showMessage: boolean = true) {
    this.member = this.data.searchMember(this.upi);
    if (showMessage && !this.member) {
      this.bannerUuid = this.banner.updateOrCreate(
        this.bannerUuid,
        'Member not found',
        'info',
        3000
      );
    }
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
    if (this.upi.length < 6) return;
    if (this.upi.length == 8) return;
    if (this.upi.length > 9) return;
    this.search(false);
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
}
