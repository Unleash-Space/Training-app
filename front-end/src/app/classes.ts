export class eventbriteEvent {
  capacity?: number;
  description: any;
  summary?: string;
  id: string;
  start: { timezone: String; local: String; utc: String };
  attendees?: attendee[];

  constructor() {
    this.start = { timezone: '', local: '', utc: '' };
    this.id = '';
  }
}

export class attendee {
  name?: string;
  id?: string;
  upi?: string;
  email?: string;
  attending?: boolean;
}
