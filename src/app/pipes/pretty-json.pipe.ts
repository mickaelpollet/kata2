import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'prettyJson',
    standalone: true
})
export class PrettyJsonPipe implements PipeTransform {

    transform(value: any): string {
        if (!value) {
            return '';
        }

        const json = JSON.stringify(value, null, 2);

        return json.replace(
            /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(?:\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g,
            (match) => {
                let cls = 'number';

                if (/^"/.test(match)) {
                    cls = /:$/.test(match) ? 'key' : 'string';
                } else if (/true|false/.test(match)) {
                    cls = 'boolean';
                } else if (/null/.test(match)) {
                    cls = 'null';
                }

                if (/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/.test(match)) {
                    cls = 'email';
                }

                if (/https?:\/\/[^\s]+/i.test(match)) {
                    cls = 'url';
                }

                if (/([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})/.test(match)) {
                    cls = 'uid';
                }

                return `<span class="${cls}">${match}</span>`;
            }
        );
    }
}