import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TicketChangePageRoutingModule } from './ticket-change-routing.module';

import { TicketChangePage } from './ticket-change.page';

import { PipesModule } from 'src/app/pipes/pipes.module';
import { PopMenuComponent } from 'src/app/components/pop-menu/pop-menu.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { PopCartComponent } from 'src/app/components/pop-cart/pop-cart.component';
import { PopLanguageComponent } from 'src/app/components/pop-language/pop-language.component';
import { TextMaskModule } from 'angular2-text-mask';

@NgModule({
  entryComponents: [PopMenuComponent, PopCartComponent, PopLanguageComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TicketChangePageRoutingModule,
    PipesModule,
    TextMaskModule,
    ComponentsModule
  ],
  declarations: [TicketChangePage]
})
export class TicketChangePageModule {}
