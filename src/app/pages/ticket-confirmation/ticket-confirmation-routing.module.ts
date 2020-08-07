import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TicketConfirmationPage } from './ticket-confirmation.page';

const routes: Routes = [
  {
    path: '',
    component: TicketConfirmationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TicketConfirmationPageRoutingModule {}
