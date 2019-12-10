import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TransactionVoucherPage } from './transaction-voucher.page';

const routes: Routes = [
  {
    path: '',
    component: TransactionVoucherPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransactionVoucherPageRoutingModule {}
