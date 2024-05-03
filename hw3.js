// calendarValidator.js

const fs = require('fs');

function parseICalendarFile(filePath) {
    try {
        const fileData = fs.readFileSync(filePath, 'utf8');
        return fileData;
    } catch (error) {
        console.error('Error reading the file:', error.message);
        return null;
    }
}

function validateICalendarFormat(icalData) {
    try {
        if (!icalData.includes('BEGIN:VCALENDAR') || !icalData.includes('END:VCALENDAR')) {
            console.error('Error: BEGIN:VCALENDAR and END:VCALENDAR delimiters are missing.');
            return false;
        }
        if (!icalData.includes('VERSION:2.0')) {
            console.error('Error: Required property VERSION:2.0 is missing.');
            return false;
        }
        if (!icalData.includes('PRODID:')) {
            console.error('Error: Required property PRODID is missing.');
            return false;
        }
        if (!icalData.includes('BEGIN:VEVENT')) {
            console.error('Error: No event components (BEGIN:VEVENT) found.');
            return false;
        }
        return true;
    } catch (error) {
        console.error('Error validating iCalendar format:', error.message);
        return false;
    }
}

function extractEventComponents(icalData) {
    try {
        const events = [];
        const lines = icalData.split('\n');
        let event = {};
        lines.forEach(line => {
            if (line.startsWith('BEGIN:VEVENT')) {
                event = {};
            } else if (line.startsWith('END:VEVENT')) {
                events.push(event);
            } else if (line.startsWith('END:VCALENDAR')) {
                // Reset the event object when encountering END:VCALENDAR
                event = {};
            } else {
                const [key, value] = line.split(':');
                if (key && value) {
                    event[key] = value;
                }
            }
        });
        return events;
    } catch (error) {
        console.error('Error extracting event components:', error.message);
        return [];
    }
}

module.exports = {
    parseICalendarFile,
    validateICalendarFormat,
    extractEventComponents
};

const filePath = 'sample.ical';
const icalData = parseICalendarFile(filePath);

if (validateICalendarFormat(icalData)) {
    console.log('iCal format is valid.');
    const events = extractEventComponents(icalData);
    console.log('Extracted events:', events);
} else {
    console.log('iCal format is invalid.');
}
