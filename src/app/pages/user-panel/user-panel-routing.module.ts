import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserPanelPage } from './user-panel.page';

const routes: Routes = [
  {
    path: '',
    component: UserPanelPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserPanelPageRoutingModule {}
