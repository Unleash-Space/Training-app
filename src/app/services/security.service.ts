import { Injectable } from '@angular/core';

import { GoogleAuthService } from 'ng-gapi';
@Injectable({
  providedIn: 'root',
})
export class SecurityService {
  public static SESSION_STORAGE_KEY: string = 'accessToken';

  constructor(private googleAuth: GoogleAuthService) {}

  public getToken() {
    let token = sessionStorage.getItem(SecurityService.SESSION_STORAGE_KEY);
    if (!token) {
      throw new Error('no token set , authentication required');
    }
    return sessionStorage.getItem(SecurityService.SESSION_STORAGE_KEY);
  }

  public async signIn() {
    return await this.googleAuth.getAuth();
  }

  public updateAccessToken(user: gapi.auth2.AuthResponse) {
    sessionStorage.setItem(
      SecurityService.SESSION_STORAGE_KEY,
      user.access_token
    );
  }
}
