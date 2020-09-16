import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MyserviceService } from 'src/app/service/myservice.service';

@Component({
  selector: 'app-terms-conditions-coupon',
  templateUrl: './terms-conditions-coupon.page.html',
  styleUrls: ['./terms-conditions-coupon.page.scss'],
})
export class TermsConditionsCouponPage implements OnInit {
  condiciones = "";
  constructor(private location: Location,
              public mys: MyserviceService) { }

  ngOnInit() {
    this.condiciones = "";    
    this.condiciones = this.mys.termConditionCoupon;
  }

  backbutton(){
    this.location.back();
  }
}