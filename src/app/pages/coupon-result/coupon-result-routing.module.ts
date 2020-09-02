import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CouponResultPage } from './coupon-result.page';

const routes: Routes = [
  {
    path: '',
    component: CouponResultPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CouponResultPageRoutingModule {}
