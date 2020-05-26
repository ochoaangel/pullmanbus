import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TicketChangePage } from './ticket-change.page';

const routes: Routes = [
  {
    path: '',
    component: TicketChangePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TicketChangePageRoutingModule {}
