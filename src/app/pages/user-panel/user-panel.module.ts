import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserPanelPageRoutingModule } from './user-panel-routing.module';

import { UserPanelPage } from './user-panel.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserPanelPageRoutingModule
  ],
  declarations: [UserPanelPage]
})
export class UserPanelPageModule {}
