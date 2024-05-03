const fs = require('fs');
const { parseICalendarFile, validateICalendarFormat, extractEventComponents } = require('../hw3.js');

describe('parseICalendarFile', () => {
    it('should return the contents of the iCal file', () => {
        const filePath = 'sample.ical';
        const expectedData = fs.readFileSync(filePath, 'utf8');
        const result = parseICalendarFile(filePath);
        expect(result).toEqual(expectedData);
    });

    it('should return null if the file does not exist', () => {
        const filePath = 'nonexistent_file.ical';
        const result = parseICalendarFile(filePath);
        expect(result).toBeNull();
    });

    it('should handle errors during file parsing', () => {
        // Create a spy to mock the fs.readFileSync method
        spyOn(fs, 'readFileSync').and.throwError('Mock file read error');
        const filePath = 'sample.ical';
        const result = parseICalendarFile(filePath);
        expect(result).toBeNull();
    });
});

describe('validateICalendarFormat', () => {
    it('should return true for a valid iCalendar format', () => {
        const icalData = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Sample Calendar//EN\nBEGIN:VEVENT\nUID:1\nDTSTART:20240101T080000\nDTEND:20240101T090000\nSUMMARY:Meeting with Client\nEND:VEVENT\nEND:VCALENDAR`;
        const result = validateICalendarFormat(icalData);
        expect(result).toBe(true);
    });

    it('should return false if BEGIN:VCALENDAR or END:VCALENDAR delimiters are missing', () => {
        const icalData = `VERSION:2.0\nPRODID:-//Sample Calendar//EN`;
        const result = validateICalendarFormat(icalData);
        expect(result).toBe(false);
    });

    it('should return false if VERSION or PRODID properties are missing', () => {
        const icalData = `BEGIN:VCALENDAR\nEND:VCALENDAR`;
        const result = validateICalendarFormat(icalData);
        expect(result).toBe(false);
    });

    it('should return false if no event components are found', () => {
        const icalData = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Sample Calendar//EN\nEND:VCALENDAR`;
        const result = validateICalendarFormat(icalData);
        expect(result).toBe(false);
    });

    
    
    it('should handle additional properties gracefully', () => {
        const icalData = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Sample Calendar//EN\nX-CUSTOM-PROPERTY: Value\nBEGIN:VEVENT\nUID:1\nDTSTART:20240101T080000\nDTEND:20240101T090000\nSUMMARY:Meeting with Client\nEND:VEVENT\nEND:VCALENDAR`;
        const result = validateICalendarFormat(icalData);
        expect(result).toBe(true);
    });
    
    it('should detect invalid iCalendar data', () => {
        const icalData = `INVALID:DATA\nBEGIN:VEVENT\nUID:1\nDTSTART:20240101T080000\nDTEND:20240101T090000\nSUMMARY:Meeting with Client\nEND:VEVENT\nEND:VCALENDAR`;
        const result = validateICalendarFormat(icalData);
        expect(result).toBe(false);
    });
});

describe('extractEventComponents', () => {
    it('should extract event components correctly', () => {
        const icalData = `BEGIN:VCALENDAR\nBEGIN:VEVENT\nUID:1\nDTSTART:20240101T080000\nDTEND:20240101T090000\nSUMMARY:Meeting with Client\nEND:VEVENT\nEND:VCALENDAR`;
        const expectedEvents = [{
            UID: '1',
            DTSTART: '20240101T080000',
            DTEND: '20240101T090000',
            SUMMARY: 'Meeting with Client'
        }];
        const result = extractEventComponents(icalData);
        expect(result).toEqual(expectedEvents);
    });

    it('should handle multiple events correctly', () => {
        const icalData = `BEGIN:VCALENDAR\nBEGIN:VEVENT\nUID:1\nDTSTART:20240101T080000\nDTEND:20240101T090000\nSUMMARY:Meeting with Client\nEND:VEVENT\nBEGIN:VEVENT\nUID:2\nDTSTART:20240102T100000\nDTEND:20240102T120000\nSUMMARY:Team Meeting\nEND:VEVENT\nEND:VCALENDAR`;
        const expectedEvents = [
            {
                UID: '1',
                DTSTART: '20240101T080000',
                DTEND: '20240101T090000',
                SUMMARY: 'Meeting with Client'
            },
            {
                UID: '2',
                DTSTART: '20240102T100000',
                DTEND: '20240102T120000',
                SUMMARY: 'Team Meeting'
            }
        ];
        const result = extractEventComponents(icalData);
        expect(result).toEqual(expectedEvents);
    });

    it('should handle missing properties correctly', () => {
        const icalData = `BEGIN:VCALENDAR\nBEGIN:VEVENT\nUID:1\nSUMMARY:Meeting with Client\nEND:VEVENT\nEND:VCALENDAR`;
        const expectedEvents = [{
            UID: '1',
            SUMMARY: 'Meeting with Client'
        }];
        const result = extractEventComponents(icalData);
        expect(result).toEqual(expectedEvents);
    });

    it('should handle empty input', () => {
        // Test case for handling empty input
        const icalData = '';
        const result = extractEventComponents(icalData);
        expect(result).toEqual([]);
    });
});
