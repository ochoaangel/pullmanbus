import { Component, OnInit } from '@angular/core';
import { MyserviceService } from 'src/app/service/myservice.service';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-pop-cart',
  templateUrl: './pop-cart.component.html',
  styleUrls: ['./pop-cart.component.scss'],
})
export class PopCartComponent implements OnInit {

  compras: [any];
  total;
  constructor(
    private mys: MyserviceService,
    private popoverCtrl: PopoverController
  ) { }

  ngOnInit() {
    this.compras = this.mys.temporalComprasCarrito || [];
    this.total = 0;
    this.compras.forEach(element => {
      this.total = this.total + element.valor;
    });
  }

  ionViewWillLeave() {
    this.popoverCtrl.dismiss({ id: 'valores' });

  }

  eliminarBoleto(i) {
    this.mys.actualizarCarritoEliminar(this.compras[i]);  //informo el elemento eliminado
    this.compras.splice(i, 1);
    this.actualizarTotal();
  }

  actualizarTotal() {
    this.total = 0;
    this.compras.forEach(element => {
      this.total = this.total + element.valor;
    });


  }

}
