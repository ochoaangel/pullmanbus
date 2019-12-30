import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// agregar acá cada pipe en declarations y exports
import { Hh2ampmPipe } from './hh2ampm.pipe';
import { Date2linePipe } from './date2line.pipe';
import { DurationPipe } from './duration.pipe';




@NgModule({

  declarations: [
    Hh2ampmPipe,
    Date2linePipe,
    DurationPipe,
    
    
    
    
    
  ],
  exports: [
    Hh2ampmPipe,
    Date2linePipe,
    DurationPipe,




  ],

  imports: [
    CommonModule
  ]
})
export class PipesModule { }


// acá se debe importar cada pipe creado
// acá agregarlo en "declarations" y "exports"
// y en cada modulo de cada pagina importar este "PipesModule"

