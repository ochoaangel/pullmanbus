import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TicketPageRoutingModule } from './ticket-routing.module';
import { TicketPage } from './ticket.page';

// agregar a cada pagina en imports
import { PipesModule } from 'src/app/pipes/pipes.module';


import { PopMenuComponent } from 'src/app/components/pop-menu/pop-menu.component';
import { PopCartComponent } from 'src/app/components/pop-cart/pop-cart.component';
import { PopLanguageComponent } from 'src/app/components/pop-language/pop-language.component';
import { ComponentsModule } from 'src/app/components/components.module';



@NgModule({
  entryComponents: [PopMenuComponent, PopCartComponent, PopLanguageComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TicketPageRoutingModule,
    PipesModule,
    ComponentsModule
  ],
  declarations: [
    TicketPage,
  ]
})
export class TicketPageModule { }
