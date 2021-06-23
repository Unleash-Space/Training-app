export class eventbriteEvent {
  capacity?: number;
  description: any;
  summary?: string;
  id: string;
  start: { timezone: String; local: String; utc: String };
  attendees: any;

  constructor() {
    this.start = { timezone: '', local: '', utc: '' };
    this.id = '';
  }
}
