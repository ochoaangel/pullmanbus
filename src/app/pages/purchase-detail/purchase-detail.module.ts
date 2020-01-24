import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PurchaseDetailPageRoutingModule } from './purchase-detail-routing.module';

import { PurchaseDetailPage } from './purchase-detail.page';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { PopMenuComponent } from 'src/app/components/pop-menu/pop-menu.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { PopLanguageComponent } from 'src/app/components/pop-language/pop-language.component';
import { PopCartComponent } from 'src/app/components/pop-cart/pop-cart.component';

@NgModule({
  entryComponents: [PopMenuComponent, PopCartComponent, PopLanguageComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PurchaseDetailPageRoutingModule,
    PipesModule,
    ComponentsModule
  ],
  declarations: [PurchaseDetailPage]
})
export class PurchaseDetailPageModule { }
