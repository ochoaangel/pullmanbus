import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SpecialTripPageRoutingModule } from './special-trip-routing.module';

import { SpecialTripPage } from './special-trip.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SpecialTripPageRoutingModule
  ],
  declarations: [SpecialTripPage]
})
export class SpecialTripPageModule {}
