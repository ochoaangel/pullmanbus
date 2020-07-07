import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DestinationsOfTheMonthPageRoutingModule } from './destinations-of-the-month-routing.module';

import { DestinationsOfTheMonthPage } from './destinations-of-the-month.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DestinationsOfTheMonthPageRoutingModule
  ],
  declarations: [DestinationsOfTheMonthPage]
})
export class DestinationsOfTheMonthPageModule {}
