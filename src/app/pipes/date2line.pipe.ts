import { Pipe, PipeTransform } from '@angular/core';
import { FechasService } from '../service/fechas.service';

@Pipe({
  name: 'date2line'
})
export class Date2linePipe implements PipeTransform {

  constructor(
    private sfecha: FechasService,
    ) {

  }

  transform(fecha: any): string {
    let valores= this.sfecha.dateToString(fecha);
    return `${valores.diaL}, ${valores.diaN} ${valores.mesL} ${valores.anoN}`;
  }
  
}
