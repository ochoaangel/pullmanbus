import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CurrentAccountPageRoutingModule } from './current-account-routing.module';

import { CurrentAccountPage } from './current-account.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CurrentAccountPageRoutingModule
  ],
  declarations: [CurrentAccountPage]
})
export class CurrentAccountPageModule {}
