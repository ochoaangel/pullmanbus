import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';


import { VoucherChangePage } from './voucher-change.page';
import { VoucherChangePageRoutingModule } from './voucher-change-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VoucherChangePageRoutingModule
  ],
  declarations: [VoucherChangePage]
})
export class VoucherChangePageModule {}
