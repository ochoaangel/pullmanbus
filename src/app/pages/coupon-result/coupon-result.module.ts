import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CouponResultPageRoutingModule } from './coupon-result-routing.module';

import { CouponResultPage } from './coupon-result.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CouponResultPageRoutingModule
  ],
  declarations: [CouponResultPage]
})
export class CouponResultPageModule {}
