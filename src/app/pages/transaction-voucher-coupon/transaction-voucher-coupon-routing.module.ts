import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TransactionCouponVoucherPage } from './transaction-voucher-coupon.page';

const routes: Routes = [
  {
    path: '',
    component: TransactionCouponVoucherPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransactionCouponVoucherPageRoutingModule {}
