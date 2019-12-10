import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BuyYourTicketPage } from './buy-your-ticket.page';

const routes: Routes = [
  {
    path: '',
    component: BuyYourTicketPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BuyYourTicketPageRoutingModule {}
