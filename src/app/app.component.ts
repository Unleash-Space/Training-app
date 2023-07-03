import { AfterContentInit, Component, ViewChild } from '@angular/core';
import { State, Tab, Banner, Member } from './classes';
import { ApiService } from './api.service';

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
    this.state.banner = {
      open: true,
      text: 'Loading...',
      type: 'info',
    };

    await this.authenticate();
    const res = await this.api.getTodaysEvents();
    const sheetsData = await this.api.getSheetsData();

    this.state.trainings = res.trainings;
    this.state.members = sheetsData;

    this.state.banner.open = false;
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
        return;
      }

      this.state.banner = {
        open: true,
        text: 'You are not authenticated',
        type: 'error',
      };

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

  async showError(errorMessage: string) {
    this.state.banner.text = errorMessage;
    this.state.banner.type = 'error';
    this.state.banner.open = true;
    setTimeout(() => {
      this.state.banner.open = false;
    }, 1500);
  }
}
