import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgenciesPageRoutingModule } from './agencies-routing.module';

import { AgenciesPage } from './agencies.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgenciesPageRoutingModule
  ],
  declarations: [AgenciesPage]
})
export class AgenciesPageModule {}
