import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { TermsConditionsChangePage } from './terms-conditions-change.page';
import { TermsConditionsChangePageRoutingModule } from './terms-conditions-change-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TermsConditionsChangePageRoutingModule
  ],
  declarations: [TermsConditionsChangePage]
})
export class TermsConditionsChangePageModule {}
