import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'eventDateRange'
})
export class EventDateRangePipe implements PipeTransform {

  transform(start: string | Date, end: string | Date | null | undefined, locale = 'en-US'): string {
    const startDate = (start instanceof Date) ? start : new Date(start);

    // If no end date is provided, just return the start date.
    if (!end) {
      const dateOptions: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' };
      return startDate.toLocaleString(locale, dateOptions);
    }

    const endDate = (end instanceof Date) ? end : new Date(end);


   


    
    // Options for date formatting
    const dateOptions: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' };
    const timeOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit' };



    if (startDate.toDateString() === endDate.toDateString()) {

      if (startDate.getHours()  === endDate.getHours() && startDate.getMinutes()  === endDate.getMinutes()) {
        return `${startDate.toLocaleString(locale, dateOptions)}`;

      } else {
        return `${startDate.toLocaleString(locale, dateOptions)} - ${endDate.toLocaleTimeString(locale, timeOptions)}`;
      }
    } else {
      return `${startDate.toLocaleString(locale, dateOptions)} to ${endDate.toLocaleString(locale, dateOptions)}`;
    }
  }
}


// old pipe
// export class EventDateRangePipe implements PipeTransform {
//   transform(start?: Date | string, end?: Date | string): { date: string; timeRange: string } {
//     if (!start || !end) {
//       return { date: '', timeRange: '' };
//     }

//     const startDate = new Date(start);
//     const endDate = new Date(end);

//     const sameDay =
//       startDate.getFullYear() === endDate.getFullYear() &&
//       startDate.getMonth() === endDate.getMonth() &&
//       startDate.getDate() === endDate.getDate();

//     const dateOptions: Intl.DateTimeFormatOptions = {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric',
//     };

//     const timeOptions: Intl.DateTimeFormatOptions = {
//       hour: 'numeric',
//       minute: '2-digit',
//       hour12: true,
//     };

//     const formatDate = (d: Date) => d.toLocaleDateString('en-US', dateOptions);
//     const formatTime = (d: Date) => d.toLocaleTimeString('en-US', timeOptions);

//     if (sameDay) {
//       return {
//         date: formatDate(startDate),
//         timeRange: `${formatTime(startDate)} - ${formatTime(endDate)}`,
//       };
//     } else {
//       return {
//         date: `${formatDate(startDate)} - ${formatDate(endDate)}`,
//         timeRange: `${formatTime(startDate)} - ${formatTime(endDate)}`,
//       };
//     }
//   }
// }