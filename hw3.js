// hw3.js

class CalendarVerifier {
    constructor(calendarText) {
      this.calendarText = calendarText;
    }
  
    verifyICalendarFormat() {
      // Implement the verification logic here
  
      // Check for BEGIN:VCALENDAR and END:VCALENDAR
      // Check for VERSION and PRODID properties
      // Check for VEVENT component
      // Check for required properties within VEVENT (ATTENDEE, DTSTART, DTSTAMP, METHOD, STATUS)
  
      // Report warnings for any additional properties
  
      // Return true if the calendar is valid, otherwise false
    }
  }
  
  module.exports = CalendarVerifier;
  