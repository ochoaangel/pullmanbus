import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'underscore';
import * as moment from 'moment';

@Pipe({
  name: 'duration'
})
export class DurationPipe implements PipeTransform {

  transform(cualquiera: any, fecha1: string, hora1: string, fecha2: string, hora2: string): any {

    let sfecha1 = `${fecha1} ${hora1}`;
    let sfecha2 = `${fecha2} ${hora2}`;

    let duracion = '';

    let date1 = moment(sfecha1, 'DD/MM/YYYY HH:mm');
    let date2 = moment(sfecha2, 'DD/MM/YYYY HH:mm');

    let horas = date2.diff(date1, 'hours');
    let minutos = date2.diff(date1, 'minutes');

    if (horas < 1) {
      duracion = `${minutos}Min`;
    } else {

      if ((minutos - (horas * 60)) > 0) {
        duracion = `${horas}Hrs  ${minutos - (horas * 60)}Min`;
      } else {
        duracion = `${horas}Hrs`;
      }

    }

    return duracion;
  }

}
