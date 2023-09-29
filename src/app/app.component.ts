import { EventbriteService } from './services/eventbrite.service';
import { SheetsService } from './services/sheets.service';
import { SecurityService } from './services/security.service';
import { AfterContentInit, Component } from '@angular/core';
import { State } from './classes';
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
    banners: [],
    members: [],
  };

  constructor(
    public sheet: SheetsService,
    public eventbrite: EventbriteService,
    public security: SecurityService,
    public banner: BannerService,
    public services: ServicesService
  ) {}

  async ngAfterContentInit() {
    this.services.init(this.state);

    await this.authenticate();
    await this.getData();
  }

  async getData() {
    const BannerUuid = this.banner.show('Loading eventbrite...', 'info');
    const res = await this.eventbrite.getTodaysEvents();

    this.state.trainings = res.trainings;
    if (res.status !== 200)
      return this.banner.update(
        BannerUuid,
        'Error Fetching Eventbrite Data',
        'error'
      );

    this.banner.update(BannerUuid, 'Loading data...', 'info');

    this.getSheetData(BannerUuid);
    return;
  }

  async getSheetData(BannerUuid: string) {
    const sheetsData = await this.sheet.getSheetsData();

    this.state.members = sheetsData.members;
    if (sheetsData.status == 200)
      return this.banner.update(BannerUuid, 'Data Fetched', 'success', 3000);
    if (sheetsData.status == 205)
      return this.banner.update(
        BannerUuid,
        'Cached Data Fetched',
        'success',
        3000
      );
    if (sheetsData.status > 400)
      return this.banner.update(BannerUuid, 'Error Fetching Data', 'error');
    return this.banner.update(BannerUuid, 'Something went wrong', 'error');
  }

  async authenticate(authBanner: string = '') {
    authBanner = this.banner.updateOrCreate(
      authBanner,
      'Authenticating...',
      'info'
    );
    const currentTime = new Date().getTime();
    const lastSignedIn = Number(sessionStorage.getItem('time')) ?? 0;

    (await this.security.signIn()).subscribe((auth) => {
      if (
        auth.isSignedIn.get() == true &&
        ['102985056909257225252', '106162011548186143809'].includes(
          auth.currentUser.get().getId()
        ) &&
        currentTime - lastSignedIn < 3000000
      ) {
        this.state.authenticated = true;
        this.banner.update(authBanner, 'Authenticated :)', 'success', 3000);
        return;
      }

      this.banner.update(authBanner, 'You are not authenticated', 'error');

      auth.signIn().then((res: any) => {
        sessionStorage.setItem(
          SecurityService.SESSION_STORAGE_KEY,
          res.getAuthResponse().access_token
        );
        sessionStorage.setItem('time', '' + currentTime);
        this.authenticate(authBanner);
      });
    });
  }
}
