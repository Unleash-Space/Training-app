export class eventbriteEvent {
  capacity?: number;
  description: any;
  summary?: string;
  id: string = '';
  start: { timezone: string; local: string; utc: string } = {
    timezone: '',
    local: '',
    utc: '',
  };
  attendees?: attendee[];
  fetchedAttendees: boolean = false;
  date: { date: string; time: string } = { date: '', time: '' };
  name?: any;
  title: string = '';

  constructor() {}
}

export class attendee {
  firstName: string = '';
  lastName: string = '';
  id: string = '';
  upi: string = '';
  email: string = '';
  attending: boolean = false;
}

export type Tab = 'Training' | 'Lookup' | 'Certification';

export type State = {
  tab: Tab;
  authenticated: boolean;
  trainings: eventbriteEvent[];
  selectedFacilitator: string;
  banner: Banner;
  members: Member[];
};

export type Banner = {
  open: boolean;
  text?: string;
  type?: 'error' | 'success' | 'info' | 'warning';
};

export type Member = {
  upi: string;
  ID: string;
  name: string;
  trainings: number;
};
