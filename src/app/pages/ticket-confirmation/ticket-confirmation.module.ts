import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TicketConfirmationPageRoutingModule } from './ticket-confirmation-routing.module';

import { TicketConfirmationPage } from './ticket-confirmation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TicketConfirmationPageRoutingModule
  ],
  declarations: [TicketConfirmationPage]
})
export class TicketConfirmationPageModule {}
