import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { PipesModule } from './pipes/pipes.module';

const routes: Routes = [
  // // ORIGINAL
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomePageModule) },

  ////////////////////////////////////////////////////////////////////////////////////
  //  PARA PDF
  // { path: '', redirectTo: 'transaction-voucher/LQN64693497', pathMatch: 'full' },
  // {
  //   path: 'transaction-voucher/LQN64693497',
  //   loadChildren: () => import('./pages/transaction-voucher/transaction-voucher.module').then(m => m.TransactionVoucherPageModule)
  // },
  ////////////////////////////////////////////////////////////////////////////////////

  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'user-panel',
    loadChildren: () => import('./pages/user-panel/user-panel.module').then(m => m.UserPanelPageModule)
  },
  {
    path: 'my-tickets',
    loadChildren: () => import('./pages/my-tickets/my-tickets.module').then(m => m.MyTicketsPageModule)
  },
  {
    path: 'my-data',
    loadChildren: () => import('./pages/my-data/my-data.module').then(m => m.MyDataPageModule)
  },
  {
    path: 'my-cancellations',
    loadChildren: () => import('./pages/my-cancellations/my-cancellations.module').then(m => m.MyCancellationsPageModule)
  },
  {
    path: 'my-change-password',
    loadChildren: () => import('./pages/my-change-password/my-change-password.module').then(m => m.MyChangePasswordPageModule)
  },
  {
    path: 'contact',
    loadChildren: () => import('./pages/contact/contact.module').then(m => m.ContactPageModule)
  },
  {
    path: 'terms-conditions',
    loadChildren: () => import('./pages/terms-conditions/terms-conditions.module').then(m => m.TermsConditionsPageModule)
  },
  {
    path: 'payment-methods',
    loadChildren: () => import('./pages/payment-methods/payment-methods.module').then(m => m.PaymentMethodsPageModule)
  },
  {
    path: 'notice',
    loadChildren: () => import('./pages/notice/notice.module').then(m => m.NoticePageModule)
  },
  {
    path: 'seat-selection',
    loadChildren: () => import('./pages/seat-selection/seat-selection.module').then(m => m.SeatSelectionPageModule)
  },
  {
    path: 'purchase-detail',
    loadChildren: () => import('./pages/purchase-detail/purchase-detail.module').then(m => m.PurchaseDetailPageModule)
  },
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ORIGINAL
  {
    path: 'transaction-voucher/:codigo',
    loadChildren: () => import('./pages/transaction-voucher/transaction-voucher.module').then(m => m.TransactionVoucherPageModule)
  },
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  {
    path: 'buy-your-ticket',
    loadChildren: () => import('./pages/buy-your-ticket/buy-your-ticket.module').then(m => m.BuyYourTicketPageModule)
  },
  {
    path: 'payment-confirmation',
    loadChildren: () => import('./pages/payment-confirmation/payment-confirmation.module').then(m => m.PaymentConfirmationPageModule)
  },
  {
    path: 'ticket',
    loadChildren: () => import('./pages/ticket/ticket.module').then(m => m.TicketPageModule)
  },
  {
    path: 'recover-password',
    loadChildren: () => import('./pages/recover-password/recover-password.module').then(m => m.RecoverPasswordPageModule)
  },
  {
    path: 'ticket-change',
    loadChildren: () => import('./pages/ticket-change/ticket-change.module').then( m => m.TicketChangePageModule)
  },
  {
    path: 'questions',
    loadChildren: () => import('./pages/questions/questions.module').then( m => m.QuestionsPageModule)
  },
  {
    path: 'agencies',
    loadChildren: () => import('./pages/agencies/agencies.module').then( m => m.AgenciesPageModule)
  },
  {
    path: 'agreements',
    loadChildren: () => import('./pages/agreements/agreements.module').then( m => m.AgreementsPageModule)
  },
  {
    path: 'ticket-management',
    loadChildren: () => import('./pages/ticket-management/ticket-management.module').then( m => m.TicketManagementPageModule)
  },
  {
    path: 'special-trip',
    loadChildren: () => import('./pages/special-trip/special-trip.module').then( m => m.SpecialTripPageModule)
  },
  {
    path: 'current-account',
    loadChildren: () => import('./pages/current-account/current-account.module').then( m => m.CurrentAccountPageModule)
  },
  {
    path: 'pullman-pass',
    loadChildren: () => import('./pages/pullman-pass/pullman-pass.module').then( m => m.PullmanPassPageModule)
  },
  {
    path: 'destinations-of-the-month',
    loadChildren: () => import('./pages/destinations-of-the-month/destinations-of-the-month.module').then( m => m.DestinationsOfTheMonthPageModule)
  },
  {
    path: 'contact-form',
    loadChildren: () => import('./pages/contact-form/contact-form.module').then( m => m.ContactFormPageModule)
  },
  {
    path: 'ticket-confirmation',
    loadChildren: () => import('./pages/ticket-confirmation/ticket-confirmation.module').then( m => m.TicketConfirmationPageModule)
  },
  {
    path: 'confirm-seat',
    loadChildren: () => import('./pages/confirm-seat/confirm-seat.module').then( m => m.ConfirmSeatPageModule)
  },
  {
    path: 'electronic-coupon',
    loadChildren: () => import('./pages/electronic-coupon/electronic-coupon.module').then( m => m.ElectronicCouponPageModule)
  },
  {
    path: 'coupon-result',
    loadChildren: () => import('./pages/coupon-result/coupon-result.module').then( m => m.CouponResultPageModule)
  },
  {
    path: 'coupon-buy',
    loadChildren: () => import('./pages/coupon-buy/coupon-buy.module').then( m => m.CouponBuyPageModule)
  },
  {
    path: 'transaction-voucher-coupon/:codigo',
    loadChildren: () => import('./pages/transaction-voucher-coupon/transaction-voucher-coupon.module').then(m => m.TransactionCouponVoucherPageModule)
  },


];

@NgModule({
  imports: [
    PipesModule,
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, useHash: true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
