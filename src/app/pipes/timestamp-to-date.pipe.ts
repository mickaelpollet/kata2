import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'timestampToDate',
    standalone: true
})
export class TimestampToDatePipe implements PipeTransform {
    transform(timestamp: number | undefined, format: Intl.DateTimeFormatOptions = {}): string {
        if (!timestamp) return 'Invalid date';

        const date = new Date(timestamp * 1000);
        return date.toLocaleString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        ...format
        });
    }
}