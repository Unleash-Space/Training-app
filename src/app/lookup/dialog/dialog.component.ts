import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { Member, State } from 'src/app/classes';
import facilitatorList from './../../CTs.json';
import KEYS from './../../keys.json';
import { BannerService } from 'src/app/services/banner.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent {
  password: string = '';
  selectedFacilitator: string = '';
  facilitators = facilitatorList;

  constructor(
    public api: ApiService,
    public dialogRef: MatDialogRef<DialogComponent>,
    public banner: BannerService,
    @Inject(MAT_DIALOG_DATA)
    public data: { member: Member; training: string; state: State }
  ) {}

  onNoClick(): void {
    this.close();
  }

  close() {
    this.dialogRef.close(false);
  }

  confirm() {
    if (this.password == KEYS.certificationPassword) {
      this.banner.show('Submitting', 'info');
      this.submitUserData();
      return;
    }
    this.banner.show('Incorrect Password', 'error');
    this.dialogRef.close(false);
    return;
  }

  async submitUserData() {
    var res = await this.api.insertCertificationData(
      this.data.member,
      this.data.training,
      this.selectedFacilitator
    );

    if (res === 200) {
      this.banner.show('Submitted', 'success');
      this.dialogRef.close(true);
      return;
    } else {
      this.dialogRef.close(false);
      this.banner.show(`Something went wrong`, 'error', 5000);
    }
  }
}
