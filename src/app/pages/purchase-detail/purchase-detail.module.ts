import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PurchaseDetailPageRoutingModule } from './purchase-detail-routing.module';

import { PurchaseDetailPage } from './purchase-detail.page';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PurchaseDetailPageRoutingModule,
    PipesModule
  ],
  declarations: [PurchaseDetailPage]
})
export class PurchaseDetailPageModule {}
