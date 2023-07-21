import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/api.service';
import { Member, State } from 'src/app/classes';
import facilitatorList from './../../CTs.json';
import KEYS from './../../keys.json';

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
    @Inject(MAT_DIALOG_DATA)
    public data: { member: Member; training: string; state: State }
  ) {
    console.log(data);
  }

  onNoClick(): void {
    this.close();
  }

  close() {
    this.dialogRef.close(false);
  }

  confirm() {
    if (this.password == KEYS.certificationPassword) {
      this.showBanner('Submitting', 'info');
      this.submitUserData();
      return;
    }
    this.showBanner('Incorrect Password', 'error');
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
      this.showBanner('Submitted', 'success');
      this.dialogRef.close(true);
      return;
    } else {
      this.dialogRef.close(false);
      this.showBanner(`Something went wrong`, 'error', 5000);
    }
  }

  async showBanner(
    message: string,
    type: 'success' | 'info' | 'error' | 'warning',
    duration: number = 1500
  ) {
    this.data.state.banner.text = message;
    this.data.state.banner.type = type;
    this.data.state.banner.open = true;
    setTimeout(() => {
      this.data.state.banner.open = false;
    }, duration);
  }
}
