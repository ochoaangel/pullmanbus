import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PullmanPassPage } from './pullman-pass.page';

const routes: Routes = [
  {
    path: '',
    component: PullmanPassPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PullmanPassPageRoutingModule {}
