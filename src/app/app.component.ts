import { AfterContentInit, Component, ViewChild } from '@angular/core';
import { State, Tab, Banner } from './classes';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterContentInit {
  state: State = {
    tab: 'Certification',
    authenticated: false,
    trainings: [],
    selectedFacilitator: '',
    banner: { open: false },
  };

  constructor(public api: ApiService) {}

  async ngAfterContentInit() {
    await this.authenticate();
    const res = await this.api.getTodaysEvents();

    this.state.trainings = res.trainings;
  }

  async authenticate() {
    (await this.api.signIn()).subscribe((auth) => {
      if (
        auth.isSignedIn.get() == true &&
        auth.currentUser.get().getId() == '106162011548186143809'
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
