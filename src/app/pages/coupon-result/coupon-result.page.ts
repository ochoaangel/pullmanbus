import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MyserviceService } from 'src/app/service/myservice.service';
import { IntegradorService } from 'src/app/service/integrador.service';

@Component({
  selector: 'app-coupon-result',
  templateUrl: './coupon-result.page.html',
  styleUrls: ['./coupon-result.page.scss'],
})
export class CouponResultPage implements OnInit {

  loading = 0;
  cupones;

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    public mys: MyserviceService,
    private integradorService: IntegradorService,
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    if (!this.mys.initCouponResult) {
      this.router.navigateByUrl('/electronic-coupon');
    } else {
      // buscando cupones
      console.log('buscando Cupones');
      this.loading++;
      this.integradorService.buscarCupones(this.mys.initCouponResult).subscribe(cuponex => {
        this.loading--;
        console.log('cuponex', cuponex);
        this.cupones = cuponex;
      });
    }
  }


  ionViewWillLeave() {
    this.cupones = null;

  }

  comprar(data) {
    this.mys.initCouponBuy = data;
    this.router.navigateByUrl('/coupon-buy');
  }
}
