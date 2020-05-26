import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserPanelPageRoutingModule } from './user-panel-routing.module';

import { UserPanelPage } from './user-panel.page';

import { PopMenuComponent } from 'src/app/components/pop-menu/pop-menu.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { PopCartComponent } from 'src/app/components/pop-cart/pop-cart.component';
import { PopLanguageComponent } from 'src/app/components/pop-language/pop-language.component';

@NgModule({
  entryComponents: [PopMenuComponent, PopCartComponent, PopLanguageComponent],

  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserPanelPageRoutingModule,
    ComponentsModule
  ],
  declarations: [UserPanelPage]
})
export class UserPanelPageModule {}
