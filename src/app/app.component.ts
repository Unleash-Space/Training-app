import { AfterContentInit, Component, ViewChild } from '@angular/core';
import { State, Tab, Banner, Member } from './classes';
import { ApiService } from './api.service';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterContentInit {
  state: State = {
    tab: 'Lookup',
    authenticated: false,
    trainings: [],
    selectedFacilitator: '',
    banner: { open: false },
    members: [],
  };

  constructor(public api: ApiService) {}

  async ngAfterContentInit() {
    this.showBanner('Loading...', 'info');

    await this.authenticate();
  }

  async getData() {
    const res = await this.api.getTodaysEvents();
    const sheetsData = await this.api.getSheetsData();

    this.state.trainings = res.trainings;
    this.state.members = sheetsData;
    this.showBanner('Data Fetched', 'info');
  }

  async authenticate() {
    const currentTime = new Date().getTime();
    const lastSignedIn = Number(sessionStorage.getItem('time')) ?? 0;

    (await this.api.signIn()).subscribe((auth) => {
      if (
        auth.isSignedIn.get() == true &&
        auth.currentUser.get().getId() == '106162011548186143809' &&
        currentTime - lastSignedIn < 3000000
      ) {
        this.state.authenticated = true;
        this.state.banner.open = false;
        this.showBanner('You are authenticated', 'info');
        this.getData();
        return;
      }

      this.showBanner('You are not authenticated', 'error', 10000);

      auth.signIn().then((res: any) => {
        sessionStorage.setItem(
          ApiService.SESSION_STORAGE_KEY,
          res.getAuthResponse().access_token
        );
        sessionStorage.setItem('time', '' + currentTime);
        this.authenticate();
      });
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
