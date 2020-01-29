import { Component, OnInit } from '@angular/core';
import { MyserviceService } from 'src/app/service/myservice.service';

@Component({
  selector: 'app-pop-cart',
  templateUrl: './pop-cart.component.html',
  styleUrls: ['./pop-cart.component.scss'],
})
export class PopCartComponent implements OnInit {

  compras
  total
  constructor(private mys: MyserviceService) { }

  ngOnInit() {
    this.compras = this.mys.temporalComprasCarrito || []
    this.total=0;
    this.compras.forEach(element => {
      this.total = this.total+element.valor
    });
    console.log('compras desde popCart', this.compras);
  }

}
