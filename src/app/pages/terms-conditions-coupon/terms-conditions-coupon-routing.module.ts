import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TermsConditionsCouponPage } from './terms-conditions-coupon.page';



const routes: Routes = [
  {
    path: '',
    component: TermsConditionsCouponPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TermsConditionsCouponPageRoutingModule {}
