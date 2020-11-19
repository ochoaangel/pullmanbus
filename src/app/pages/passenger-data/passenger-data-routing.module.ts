import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PassengerDataPage } from './passenger-data.page';
const routes: Routes = [
  {
    path: '',
    component: PassengerDataPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PassengerDataRoutingModule {}
