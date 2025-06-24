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
import { SheetsService } from '../services/sheets.service';

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
    { name: 'VR', value: 1024, venue: 'tech-hub', table: 'Virtual Reality',  },
    { name: 'AI', value: 512, venue: 'tech-hub', table: 'AI',  },
    { name: '5G', value: 256, venue: 'tech-hub', table: '5G',  },
    { name: 'IoT', value: 128, venue: 'tech-hub', table: 'IoT',  },
    { name: '3D Scanner', value: 64, venue: '', table: '3D Scanner' },
    { name: 'Sewing', value: 32, venue: 'maker-space', table: 'Sewing',  },
    { name: 'Soldering', value: 16, venue: 'maker-space', table: 'Soldering' },
    { name: 'Laser', value: 8, venue: 'maker-space', table: 'Laser',  },
    { name: 'Vinyl', value: 4, venue: 'maker-space', table: 'Vinyl',  },
    { name: 'CNC router', value: 2, venue: 'maker-space', table: 'CNC router' },
    { name: '3D Printer', value: 1, venue: 'maker-space', table: '3D Printer' },
  ];

  constructor(
    public sheet: SheetsService,
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
        table: trainingsMap[i].table,
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
    console.log(`Opening dialog for training: ${type}`);


    const dialogRef = this.dialog.open(DialogComponent, {
      data: { member: this.member, training_table: type, state: this.state },
    });

    dialogRef.afterClosed().subscribe((result) => {
      const trainingValue = this.trainingsMap.find(
        (training) => training.table == type
      )!;

      console.log(`Training ${type} completed: ${result}`);

      if (result) {
        this.trainings.find((training) => training.table == type)!.complete =
          true;

        console.log(`Adding ${trainingValue.value} to member's trainings : ${this.member!.trainings} (${JSON.stringify(trainingValue)}) (${JSON.stringify(this.member)})`);

        // this.member!.trainings can be a number or a string, so to forceable parse
        this.member!.trainings = Number.parseInt((""+this.member!.trainings) as unknown as string) + trainingValue.value;

        this.sheet.saveSheetCache(this.state.members);
      }
    });
  }
}
