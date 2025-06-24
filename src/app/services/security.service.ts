import { Injectable } from '@angular/core';

import { GoogleAuthService } from 'ng-gapi';
import { State } from '../classes';
@Injectable({
  providedIn: 'root',
})
export class SecurityService {
  public static SESSION_STORAGE_KEY: string = 'accessToken';

  constructor(private googleAuth: GoogleAuthService) {

  }

  public getToken() {
    let token = sessionStorage.getItem(SecurityService.SESSION_STORAGE_KEY);
    if (!token) {
      throw new Error('no token set, authentication required');
    }
    return token;
  }

  public async signIn() {
    console.log("Signing in to Google...");
    return await this.googleAuth.getAuth();
  }

  public updateAccessToken(user: gapi.auth2.AuthResponse) {
    sessionStorage.setItem(
      SecurityService.SESSION_STORAGE_KEY,
      user.access_token
    );
  }
}
