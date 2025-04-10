import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'eventDateRange',
})
export class EventDateRangePipe implements PipeTransform {
  transform(start?: Date | string, end?: Date | string): { date: string; timeRange: string } {
    if (!start || !end) {
      return { date: '', timeRange: '' };
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    const sameDay =
      startDate.getFullYear() === endDate.getFullYear() &&
      startDate.getMonth() === endDate.getMonth() &&
      startDate.getDate() === endDate.getDate();

    const dateOptions: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    };

    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    };

    const formatDate = (d: Date) => d.toLocaleDateString('en-US', dateOptions);
    const formatTime = (d: Date) => d.toLocaleTimeString('en-US', timeOptions);

    if (sameDay) {
      return {
        date: formatDate(startDate),
        timeRange: `${formatTime(startDate)} - ${formatTime(endDate)}`,
      };
    } else {
      return {
        date: `${formatDate(startDate)} - ${formatDate(endDate)}`,
        timeRange: `${formatTime(startDate)} - ${formatTime(endDate)}`,
      };
    }
  }
}