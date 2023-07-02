import { AfterContentInit, Component, ViewChild } from '@angular/core';
import { State, Tab } from './classes';
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
    (await this.api.signIn()).subscribe((auth) => {
      if (auth.isSignedIn.get() === true) {
        this.state.authenticated = true;

        if (auth.currentUser.get().getId() !== '102985056909257225252') {
          this.showError('Please Sign in with the Unleash Account');
          auth.signIn().then((res: any) => {
            this.api.signInSuccessHandler(res);
            this.state.authenticated = true;
          });
          return;
        }

        auth.currentUser
          .get()
          .reloadAuthResponse()
          .then((user) => {
            this.api.updateAccessToken(user);
          });
        return;
      }

      auth.signIn().then((res: any) => {
        this.api.signInSuccessHandler(res);
        this.state.authenticated = true;
      });
    });
    const res = await this.api.getTodaysEvents();

    this.state.trainings = res.trainings;
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
