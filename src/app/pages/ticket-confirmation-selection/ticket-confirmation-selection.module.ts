import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';



import { PipesModule } from 'src/app/pipes/pipes.module';
import { PopMenuComponent } from 'src/app/components/pop-menu/pop-menu.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { PopCartComponent } from 'src/app/components/pop-cart/pop-cart.component';
import { PopLanguageComponent } from 'src/app/components/pop-language/pop-language.component';
import { TicketConfirmationSelectionPage } from './ticket-confirmation-selection.page';
import { TicketConfirmationSelectionPageRoutingModule } from './ticket-confirmation-selection.routing.module';

@NgModule({
  entryComponents: [PopMenuComponent, PopCartComponent, PopLanguageComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TicketConfirmationSelectionPageRoutingModule,
    PipesModule,
    ComponentsModule

  ],
  declarations: [TicketConfirmationSelectionPage]
})
export class TicketConfirmationSelectionPageModule { }
