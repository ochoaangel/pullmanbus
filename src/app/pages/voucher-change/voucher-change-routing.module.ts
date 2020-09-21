import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VoucherChangePage } from './voucher-change.page';

const routes: Routes = [
  {
    path: '',
    component: VoucherChangePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VoucherChangePageRoutingModule {}
