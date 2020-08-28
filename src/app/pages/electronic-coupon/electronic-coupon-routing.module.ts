import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ElectronicCouponPage } from './electronic-coupon.page';

const routes: Routes = [
  {
    path: '',
    component: ElectronicCouponPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ElectronicCouponPageRoutingModule {}
