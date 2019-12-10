import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyChangePasswordPage } from './my-change-password.page';

const routes: Routes = [
  {
    path: '',
    component: MyChangePasswordPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyChangePasswordPageRoutingModule {}
