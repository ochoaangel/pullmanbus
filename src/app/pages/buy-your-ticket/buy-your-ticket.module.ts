import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BuyYourTicketPageRoutingModule } from './buy-your-ticket-routing.module';

import { BuyYourTicketPage } from './buy-your-ticket.page';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BuyYourTicketPageRoutingModule,
    PipesModule
  ],
  declarations: [BuyYourTicketPage]
})
export class BuyYourTicketPageModule {}
