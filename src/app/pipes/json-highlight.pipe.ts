import { Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';

@Pipe({
    name: 'jsonHighlight',
    standalone: true,
    pure: true,
    // imports: [
    //     CommonModule
    // ]
})
export class JsonHighlightPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    const json = value
      // Keys
      .replace(/("(\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*?"(?=\s*:))/g,
        '<span class="json-key">$1</span>')
      // String values
      .replace(/:\s*"([^"]*)"/g,
        ': <span class="json-string">"$1"</span>')
      // Numbers
      .replace(/:\s*(\d+)/g,
        ': <span class="json-number">$1</span>')
      // Booleans
      .replace(/:\s*(true|false)/g,
        ': <span class="json-boolean">$1</span>')
      // Nulls
      .replace(/:\s*(null)/g,
        ': <span class="json-null">$1</span>');

    return json;
  }
}