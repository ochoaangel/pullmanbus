import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'underscore';
import * as moment from 'moment';

@Pipe({
  name: 'hh2ampm'
})
export class Hh2ampmPipe implements PipeTransform {

  transform(HH: string): string {
    return moment('0001-01-01 ' + HH).format('LT');
  }

}
