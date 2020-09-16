import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { TermsConditionsCouponPage } from './terms-conditions-coupon.page';
import { TermsConditionsCouponPageRoutingModule } from './terms-conditions-coupon-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TermsConditionsCouponPageRoutingModule
  ],
  declarations: [TermsConditionsCouponPage]
})
export class TermsConditionsCouponPageModule {}
