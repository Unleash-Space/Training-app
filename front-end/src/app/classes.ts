export class eventbriteEvent {
  //     capacity: 15,
  //   capacity_is_custom: false,
  //   category_id: null,
  //   changed: "2021-06-22T22:09:35Z",
  //   created: "2021-06-22T22:08:18Z",
  //   currency: "NZD",
  //   description: {text: "hi", html: "hi"},
  //   end: {timezone: "Pacific/Auckland", local: "2021-06-23T13:15:00", utc: "2021-06-23T01:15:00Z"},
  //   format_id: null,
  //   hide_end_date: false,
  //   hide_start_date: false,
  //   id: "160878047571",
  //   inventory_type: "limited",
  //   invite_only: false,
  //   is_externally_ticketed: false,
  //   is_free: true,
  //   is_locked: false,
  //   is_reserved_seating: false,
  //   is_series: true,
  //   is_series_parent: false,
  //   listed: false,
  //   locale: "en_NZ",
  //   logo: null,
  //   logo_id: null,
  //   name: {text: "Test event", html: "Test event"},
  //   online_event: false,
  //   organization_id: "169615816313",
  //   organizer_id: "16849565066",
  //   privacy_setting: "unlocked",
  //   published: "2021-06-22T22:09:06Z",
  //   resource_uri: "https://www.eventbriteapi.com/v3/events/160878047571/",
  //   series_id: "160877917181",
  //   shareable: false,
  //   show_colors_in_seatmap_thumbnail: false,
  //   show_pick_a_seat: false,
  //   show_remaining: false,
  //   show_seatmap_thumbnail: false,
  //   source: "coyote",
  start: { timezone: String; local: String; utc: String };
  //   status: "live",
  //   subcategory_id: null,
  //   summary: "hi",
  //   tx_time_limit: 480,
  //   url: "https://www.eventbrite.co.nz/e/test-event-tickets-160878047571",
  //   venue_id: "61450279",
  //   version: null,

  constructor() {
    this.start = { timezone: '', local: '', utc: '' };
  }
}
