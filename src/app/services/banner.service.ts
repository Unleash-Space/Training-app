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

  show(
    message: string,
    type: 'success' | 'info' | 'error' | 'warning',
    duration: number = 0
  ): string {
    const uuid = crypto.randomUUID();
    const banner: Banner = {
      text: message,
      type: type,
      uuid: uuid,
      timeOut: duration,
    };

    this.generate(banner);

    if (duration == 0) return uuid;

    setTimeout(() => {
      this.destroy(banner.uuid!);
    }, duration);

    return uuid;
  }

  updateOrCreate(
    id: string,
    message: string,
    type: 'success' | 'info' | 'error' | 'warning',
    duration: number = 0
  ) {
    const banner = this.state.banners.find((banner) => banner.uuid == id);
    if (banner == undefined) return this.show(message, type, duration);
    return this.update(id, message, type, duration);
  }

  update(
    id: string,
    message: string,
    type: 'success' | 'info' | 'error' | 'warning',
    duration: number = 0
  ): string {
    const banner = this.state.banners.find((banner) => banner.uuid == id);
    if (banner == undefined) return id;

    banner.text = message;
    banner.type = type;

    setTimeout(() => {
      this.destroy(banner.uuid!);
    }, duration);

    return id;
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
