import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TicketPageRoutingModule } from './ticket-routing.module';
import { TicketPage } from './ticket.page';

// agregar a cada pagina en imports
import { PipesModule } from 'src/app/pipes/pipes.module';


 
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TicketPageRoutingModule,
    PipesModule
  ],
  declarations: [
    TicketPage,
  ]
})
export class TicketPageModule { }
