import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyChangePasswordPageRoutingModule } from './my-change-password-routing.module';

import { MyChangePasswordPage } from './my-change-password.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyChangePasswordPageRoutingModule
  ],
  declarations: [MyChangePasswordPage]
})
export class MyChangePasswordPageModule {}
