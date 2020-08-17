import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContactFormPageRoutingModule } from './contact-form-routing.module';

import { ContactFormPage } from './contact-form.page';
import { TextMaskModule } from 'angular2-text-mask';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TextMaskModule,
    ContactFormPageRoutingModule,
    ComponentsModule

  ],
  declarations: [ContactFormPage]
})
export class ContactFormPageModule { }
