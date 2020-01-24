import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopCartComponent } from './pop-cart/pop-cart.component';
import { PopMenuComponent } from './pop-menu/pop-menu.component';
import { PopLanguageComponent } from './pop-language/pop-language.component';
import { IonicModule } from '@ionic/angular';

 

@NgModule({
  declarations: [
    PopCartComponent,
    PopMenuComponent,
    PopLanguageComponent,
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports:[
    PopCartComponent,
    PopMenuComponent,
    PopLanguageComponent
  ]
})
export class ComponentsModule { }
