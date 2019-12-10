import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TransactionVoucherPageRoutingModule } from './transaction-voucher-routing.module';

import { TransactionVoucherPage } from './transaction-voucher.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TransactionVoucherPageRoutingModule
  ],
  declarations: [TransactionVoucherPage]
})
export class TransactionVoucherPageModule {}
