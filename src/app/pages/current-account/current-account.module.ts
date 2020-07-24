import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CurrentAccountPageRoutingModule } from './current-account-routing.module';

import { CurrentAccountPage } from './current-account.page';
import { TextMaskModule } from 'angular2-text-mask';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TextMaskModule,
    CurrentAccountPageRoutingModule
  ],
  declarations: [CurrentAccountPage]
})
export class CurrentAccountPageModule { }
