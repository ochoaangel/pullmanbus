import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PullmanPassPageRoutingModule } from './pullman-pass-routing.module';

import { PullmanPassPage } from './pullman-pass.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PullmanPassPageRoutingModule
  ],
  declarations: [PullmanPassPage]
})
export class PullmanPassPageModule {}
