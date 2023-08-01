import { AfterContentInit, Component } from '@angular/core';
import { State } from './classes';
import { ApiService } from './services/api.service';
import { BannerService } from './services/banner.service';
import { ServicesService } from './services/services.service';

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

  constructor(
    public api: ApiService,
    public banner: BannerService,
    public services: ServicesService
  ) {}

  async ngAfterContentInit() {
    this.services.init(this.state);

    await this.authenticate();
    await this.getData();
  }

  async getData() {
    this.banner.show('Loading...', 'info');
    const res = await this.api.getTodaysEvents();

    this.state.trainings = res.trainings;
    if (res.status !== 200)
      return this.banner.show('Error Fetching Eventbrite Data', 'error');

    this.getSheetData();
    return;
  }

  async getSheetData() {
    const sheetsData = await this.api.getSheetsData();
    this.state.members = sheetsData.members;
    if (sheetsData.status == 200)
      return this.banner.show('Data Fetched', 'success', 5000);
    if (sheetsData.status == 205)
      return this.banner.show('Cached Data Fetched', 'success', 5000);
    if (sheetsData.status > 400)
      return this.banner.show('Error Fetching Member Data', 'error');
  }

  async authenticate() {
    this.banner.show('Authenticating...', 'info');
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

      this.banner.show('You are not authenticated', 'error');

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
}
