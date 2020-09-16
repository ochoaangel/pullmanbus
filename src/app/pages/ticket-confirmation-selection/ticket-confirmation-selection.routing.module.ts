import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TicketConfirmationSelectionPage } from './ticket-confirmation-selection.page';
const routes: Routes = [
  {
    path: '',
    component: TicketConfirmationSelectionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TicketConfirmationSelectionPageRoutingModule {}
