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
  attendees?: Attendee[];
  fetchedAttendees: boolean = false;
  date: { date: string; time: string } = { date: '', time: '' };
  name?: any;
  title: string = '';

  constructor() {}
}

export class Attendee {
  firstName: string = '';
  lastName: string = '';
  id: string = '';
  upi: string = '';
  email: string = '';
  attending: boolean = false;
  idFound?: boolean = false;
  status?: string = '';
}

export type Tab = 'Training' | 'Lookup' | 'Certification';

export type State = {
  tab: Tab;
  authenticated: boolean;
  trainings: eventbriteEvent[];
  selectedFacilitator: string;
  banners: Banner[];
  members: Member[];
};

export type Banner = {
  text: string;
  type: 'error' | 'success' | 'info' | 'warning';
  uuid: string;
  timeOut: number;
};

export type Member = {
  upi: string;
  ID: string;
  firstName: string;
  lastName: string;
  email: string;
  trainings: number;
};

export type Training = {
  name: string;
  value: number;
  venue: 'Online' | 'maker-space' | 'tech-hub' | '';
  table: string;
  complete?: boolean;
};
