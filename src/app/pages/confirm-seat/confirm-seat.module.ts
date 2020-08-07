
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

// agregar a cada pagina en imports
import { PipesModule } from 'src/app/pipes/pipes.module';


import { PopMenuComponent } from 'src/app/components/pop-menu/pop-menu.component';
import { PopCartComponent } from 'src/app/components/pop-cart/pop-cart.component';
import { PopLanguageComponent } from 'src/app/components/pop-language/pop-language.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { ConfirmSeatPageRoutingModule } from './confirm-seat-routing.module';
import { ConfirmSeatPage } from './confirm-seat.page';



@NgModule({
  entryComponents: [PopMenuComponent, PopCartComponent, PopLanguageComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    ComponentsModule,
    ConfirmSeatPageRoutingModule
  ],
  declarations: [ConfirmSeatPage]
})
export class ConfirmSeatPageModule { }
