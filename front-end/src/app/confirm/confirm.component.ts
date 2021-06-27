import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {


  ngOnInit(): void {
  }

  constructor(
    public dialogRef: MatDialogRef<ConfirmComponent>){}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
