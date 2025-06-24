import {
  Component,
  Input,
  Output,
  EventEmitter,
  AfterContentInit,
} from '@angular/core';
import { State, Tab } from '../classes';
import { SheetsService } from '../services/sheets.service';
import { BannerService } from '../services/banner.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements AfterContentInit {
  @Input() state!: State;
  @Output() stateChange = new EventEmitter<State>();

  constructor(
    private sheets: SheetsService,
    private banner: BannerService
  ) {}

  ngAfterContentInit() {
    if (!this.state.tab) {
      this.state.tab = 'Training';
    }
  }

  switchTab(tab: Tab) {
    this.state.tab = tab;
    this.stateChange.emit(this.state);
  }

  async clearCache() {
    let initial_id = this.banner.show('Reloading data...', 'info');

    this.sheets.clearCache();

    try {
      const sheetsData = await this.sheets.getSheetsData();
      this.state.members = sheetsData.members;
      this.stateChange.emit(this.state);
      this.banner.destroy(initial_id);

      this.banner.updateOrCreate(
        '',
        'Cache cleared and data refreshed. Refreshing page...',
        'success',
        1000
      );

      // Refresh page after 1 second cooldown
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      this.banner.destroy(initial_id);
      this.banner.updateOrCreate(
        '',
        'Error clearing cache or fetching data',
        'error',
        5000
      );

      console.error('Error clearing cache or fetching data:', error);
    }

  }
}
