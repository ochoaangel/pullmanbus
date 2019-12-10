import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyCancellationsPageRoutingModule } from './my-cancellations-routing.module';

import { MyCancellationsPage } from './my-cancellations.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyCancellationsPageRoutingModule
  ],
  declarations: [MyCancellationsPage]
})
export class MyCancellationsPageModule {}
