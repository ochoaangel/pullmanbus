import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BuyYourTicketPageRoutingModule } from './buy-your-ticket-routing.module';

import { BuyYourTicketPage } from './buy-your-ticket.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BuyYourTicketPageRoutingModule
  ],
  declarations: [BuyYourTicketPage]
})
export class BuyYourTicketPageModule {}
