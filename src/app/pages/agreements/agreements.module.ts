import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgreementsPageRoutingModule } from './agreements-routing.module';

import { AgreementsPage } from './agreements.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgreementsPageRoutingModule
  ],
  declarations: [AgreementsPage]
})
export class AgreementsPageModule {}
