import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'parseElementVar'
})
export class ParseElementVarPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    const result = value.replace(/([A-Z])/g, ' $1');
    return result.charAt(0).toUpperCase() + result.slice(1);
  }

}
