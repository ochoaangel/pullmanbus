import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CouponBuyPageRoutingModule } from './coupon-buy-routing.module';

import { CouponBuyPage } from './coupon-buy.page';
import { TextMaskModule } from 'angular2-text-mask';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TextMaskModule,
    ComponentsModule,
    CouponBuyPageRoutingModule
  ],
  declarations: [CouponBuyPage]
})
export class CouponBuyPageModule { }
