import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CouponBuyPageRoutingModule } from './coupon-buy-routing.module';

import { CouponBuyPage } from './coupon-buy.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CouponBuyPageRoutingModule
  ],
  declarations: [CouponBuyPage]
})
export class CouponBuyPageModule {}
