import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CouponBuyPage } from './coupon-buy.page';

const routes: Routes = [
  {
    path: '',
    component: CouponBuyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CouponBuyPageRoutingModule {}
