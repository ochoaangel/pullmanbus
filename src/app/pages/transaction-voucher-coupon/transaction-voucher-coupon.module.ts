import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TransactionCouponVoucherPageRoutingModule } from './transaction-voucher-coupon-routing.module';

import { TransactionCouponVoucherPage } from './transaction-voucher-coupon.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TransactionCouponVoucherPageRoutingModule
  ],
  declarations: [TransactionCouponVoucherPage]
})
export class TransactionCouponVoucherPageModule {}
