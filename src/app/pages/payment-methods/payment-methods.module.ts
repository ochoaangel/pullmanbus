import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaymentMethodsPageRoutingModule } from './payment-methods-routing.module';

import { PaymentMethodsPage } from './payment-methods.page';
import { TextMaskModule } from 'angular2-text-mask';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaymentMethodsPageRoutingModule,
    TextMaskModule
  ],
  declarations: [PaymentMethodsPage]
})
export class PaymentMethodsPageModule {}
