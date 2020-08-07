import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfirmSeatPage } from './confirm-seat.page';

const routes: Routes = [
  {
    path: '',
    component: ConfirmSeatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfirmSeatPageRoutingModule {}
