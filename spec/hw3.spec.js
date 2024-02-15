const fs = require('fs');
const { CalendarVerifier } = require('/src/test_input.ics');

describe('CalendarVerifier', () => {
  let calendarVerifier;

  beforeEach(() => {
    // Set up a new instance of CalendarVerifier before each test
    calendarVerifier = new CalendarVerifier('/src/test_input.ics');
  });

  it('should read a valid iCalendar file', () => {
    spyOn(fs, 'readFileSync').and.returnValue(`
      BEGIN:VCALENDAR
      VERSION:2.0
      PRODID:-//hacksw/handcal//NONSGML v1.0//EN
      BEGIN:VEVENT
      UID:uid1@example.com
      DTSTAMP:19970714T170000Z
      ORGANIZER;CN=John Doe:MAILTO:john.doe@example.com
      DTSTART:19970714T170000Z
      DTEND:19970715T040000Z
      SUMMARY:Bastille Day Party
      END:VEVENT
      END:VCALENDAR
    `);

    const verifySpy = spyOn(calendarVerifier, 'verifyICalendarFormat').and.callThrough();
    calendarVerifier.readCalendarFile();

    expect(fs.readFileSync).toHaveBeenCalledWith('/src/test_input.ics', 'utf-8');
    expect(verifySpy).toHaveBeenCalled();
  });

  it('should handle missing BEGIN:VCALENDAR and END:VCALENDAR', () => {
    spyOn(fs, 'readFileSync').and.returnValue(`
      VERSION:2.0
      PRODID:-//hacksw/handcal//NONSGML v1.0//EN
      BEGIN:VEVENT
      UID:uid1@example.com
      DTSTAMP:19970714T170000Z
      ORGANIZER;CN=John Doe:MAILTO:john.doe@example.com
      DTSTART:19970714T170000Z
      DTEND:19970715T040000Z
      SUMMARY:Bastille Day Party
      END:VEVENT
    `);

    spyOn(console, 'error');

    calendarVerifier.readCalendarFile();

    expect(console.error).toHaveBeenCalledWith('Invalid iCalendar format. BEGIN:VCALENDAR and END:VCALENDAR not found.');
  });

  // Add more test cases to cover different scenarios (missing properties, unknown properties, etc.)

  // Example: Test for missing REQUIRED properties in VEVENT
  it('should handle missing required properties in VEVENT', () => {
    spyOn(fs, 'readFileSync').and.returnValue(`
      BEGIN:VCALENDAR
      VERSION:2.0
      PRODID:-//hacksw/handcal//NONSGML v1.0//EN
      BEGIN:VEVENT
      UID:uid1@example.com
      DTSTAMP:19970714T170000Z
      DTEND:19970715T040000Z
      SUMMARY:Bastille Day Party
      END:VEVENT
      END:VCALENDAR
    `);

    spyOn(console, 'error');

    calendarVerifier.readCalendarFile();

    expect(console.error).toHaveBeenCalledWith('Missing required properties in VEVENT: ORGANIZER, DTSTART, METHOD, STATUS');
  });

  // Example: Test for unknown properties in VEVENT
  it('should report warnings for unknown properties in VEVENT', () => {
    spyOn(fs, 'readFileSync').and.returnValue(`
      BEGIN:VCALENDAR
      VERSION:2.0
      PRODID:-//hacksw/handcal//NONSGML v1.0//EN
      BEGIN:VEVENT
      UID:uid1@example.com
      DTSTAMP:19970714T170000Z
      ORGANIZER;CN=John Doe:MAILTO:john.doe@example.com
      DTSTART:19970714T170000Z
      DTEND:19970715T040000Z
      SUMMARY:Bastille Day Party
      LOCATION:Paris
      END:VEVENT
      END:VCALENDAR
    `);

    spyOn(console, 'warn');

    calendarVerifier.readCalendarFile();

    expect(console.warn).toHaveBeenCalledWith('Warning: Unknown property in VEVENT: LOCATION');
  });

  // Add more test cases as needed

});
