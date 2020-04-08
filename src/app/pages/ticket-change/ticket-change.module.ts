import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TicketChangePageRoutingModule } from './ticket-change-routing.module';

import { TicketChangePage } from './ticket-change.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TicketChangePageRoutingModule
  ],
  declarations: [TicketChangePage]
})
export class TicketChangePageModule {}
