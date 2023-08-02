import { Injectable } from '@angular/core';
import { Banner, State } from '../classes';
import { BannerComponent } from '../banner/banner.component';

@Injectable({
  providedIn: 'root',
})
export class BannerService {
  state!: State;

  constructor() {}

  init(state: State) {
    this.state = state;
  }

  async show(
    message: string,
    type: 'success' | 'info' | 'error' | 'warning',
    duration: number = 0
  ) {
    const uuid = crypto.randomUUID();
    const banner: Banner = {
      text: message,
      type: type,
      uuid: uuid,
      timeOut: duration,
    };

    this.generate(banner);

    if (duration == 0) return;
    setTimeout(() => {
      this.destroy(banner.uuid!);
    }, duration);
  }

  generate(banner: Banner) {
    this.state.banners.push(banner);
  }

  destroy(id: string) {
    this.state.banners = this.state.banners.filter(
      (banner) => banner.uuid != id
    );
  }

  clear() {
    this.state.banners = [];
  }
}
