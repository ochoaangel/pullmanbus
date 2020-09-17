import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MyserviceService } from 'src/app/service/myservice.service';

@Component({
  selector: 'app-terms-conditions-change',
  templateUrl: './terms-conditions-change.page.html',
  styleUrls: ['./terms-conditions-change.page.scss'],
})
export class TermsConditionsChangePage implements OnInit {
  condiciones = "";
  constructor(private location: Location,
              public mys: MyserviceService) { }

  ngOnInit() {
    this.condiciones = "";    
    this.condiciones = this.mys.termConditionChange;
  }

  backbutton(){
    this.location.back();
  }
}