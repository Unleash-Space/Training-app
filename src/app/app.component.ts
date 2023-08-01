import { AfterContentInit, Component, ViewChild } from '@angular/core';
import { State, Tab, Banner, Member } from './classes';
import { ApiService } from './services/api.service';
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
    await this.authenticate();
    await this.getData();
  }

  async getData() {
    this.showBanner('Loading...', 'info');
    const res = await this.api.getTodaysEvents();

    this.state.trainings = res.trainings;
    if (res.status !== 200)
      return this.showBanner('Error Fetching Eventbrite Data', 'error');

    this.getSheetData();
    return;
  }

  async getSheetData() {
    const sheetsData = await this.api.getSheetsData();
    this.state.members = sheetsData.members;
    if (sheetsData.status == 200)
      return this.showBanner('Data Fetched', 'success', 5000);
    if (sheetsData.status == 205)
      return this.showBanner('Cached Data Fetched', 'success', 5000);
    if (sheetsData.status > 400)
      return this.showBanner('Error Fetching Member Data', 'error');
  }

  async authenticate() {
    this.showBanner('Authenticating...', 'info');
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
        this.getData();
        return;
      }

      this.showBanner('You are not authenticated', 'error');

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
    duration: number = 0
  ) {
    this.state.banner.text = message;
    this.state.banner.type = type;
    this.state.banner.open = true;
    if (duration == 0) return;
    setTimeout(() => {
      this.state.banner.open = false;
    }, duration);
  }
}
