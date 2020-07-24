import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SpecialTripPageRoutingModule } from './special-trip-routing.module';

import { SpecialTripPage } from './special-trip.page';
import { TextMaskModule } from 'angular2-text-mask';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TextMaskModule,
    SpecialTripPageRoutingModule
  ],
  declarations: [SpecialTripPage]
})
export class SpecialTripPageModule { }
