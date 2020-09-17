import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TermsConditionsChangePage } from './terms-conditions-change.page';




const routes: Routes = [
  {
    path: '',
    component: TermsConditionsChangePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TermsConditionsChangePageRoutingModule {}
