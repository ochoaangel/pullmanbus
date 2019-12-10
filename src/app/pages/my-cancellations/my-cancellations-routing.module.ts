import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyCancellationsPage } from './my-cancellations.page';

const routes: Routes = [
  {
    path: '',
    component: MyCancellationsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyCancellationsPageRoutingModule {}
