import { Component, OnInit } from "@angular/core";
import { MyserviceService } from "src/app/service/myservice.service";
import { Router } from "@angular/router";
import { PopMenuComponent } from 'src/app/components/pop-menu/pop-menu.component';
import { PopoverController } from '@ionic/angular';
import { PopCartComponent } from 'src/app/components/pop-cart/pop-cart.component';
import { IntegradorService } from 'src/app/service/integrador.service';
import * as _ from 'underscore';


@Component({
  selector: "app-purchase-detail",
  templateUrl: "./purchase-detail.page.html",
  styleUrls: ["./purchase-detail.page.scss"]
})
export class PurchaseDetailPage implements OnInit {
  constructor(private router: Router,
    private mys: MyserviceService,
    private popoverCtrl: PopoverController,
    private integradorService: IntegradorService,
  ) { }

  ticket;
  way;
  tarifaTotal;
  eliminadoAsiento = false;
  loading = false


  ngOnInit() {

    console.log(this.mys.ticket);
    // console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
    // console.log(JSON.stringify(this.mys.ticket));
    // console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');

    if (this.mys.ticket) {
      this.ticket = this.mys.ticket;
      this.way = this.mys.way;
      console.log('this.ticket', this.ticket);
      let total_general = 0;
      this.ticket.comprasDetalles.forEach(element => {
        total_general = total_general + element.valor;
      });
      this.tarifaTotal = total_general;


    } else {
      // solo pruebas
      console.log('Ejecutando con info de prueba');
    }

    console.log('this.ticket', this.ticket);


  }  // fin ngOnInit

  continuar() {

    if (this.tarifaTotal === 0) {
      this.mys.ticket = null;
      this.router.navigateByUrl('/home');
    } else if ((this.ticket.tripType === 'goBack' && this.way === 'back') || (this.ticket.tripType === 'goOnly')) {
      this.mys.total = this.tarifaTotal;
      this.router.navigateByUrl('/payment-methods');
      this.mys.ticket = this.ticket;
    } else if (this.ticket.tripType === 'goBack' && this.way === 'go') {

      this.way = 'back'
      this.mys.way = this.way;
      this.mys.ticket = this.ticket;
      this.router.navigateByUrl('/ticket');
    }
  }// fin continuar

  EliminarPasaje(way, idServicio, asiento, y, x, piso) {
    let texto = way + '_' + idServicio + '_' + asiento
    console.log('asiento a eliminar', texto);

    let index = this.ticket.comprasDetallesPosicion.indexOf(texto);
    console.log('index', index)

    // eliminar del backend y (GENERALcomprasDetallesPosicion y GENERALcomprasDetalles ) de ticket
    if (index !== -1) {
      // preparando para eliminar en backend
      let asiento = {
        "servicio": this.ticket.comprasDetalles[index].idServicio,
        "fecha": this.ticket.comprasDetalles[index].service.fechaSalida,
        "origen": this.ticket.comprasDetalles[index].service.idTerminalOrigen,
        "destino": this.ticket.comprasDetalles[index].service.idTerminalDestino,
        "asiento": this.ticket.comprasDetalles[index].asiento,
        "integrador": this.ticket.comprasDetalles[index].service.integrador
      }
      this.loading = true
      // eliminando en backend
      this.integradorService.liberarAsiento(asiento).subscribe(resp => {
        this.loading = false
      })
      this.ticket.comprasDetallesPosicion.splice(index, 1);
      this.ticket.comprasDetalles.splice(index, 1);
    }

    // eliminar del (GOcompras y BACKcompras) de ticket
    if (way === 'go') {
      let index2 = this.ticket.goCompras.indexOf(texto);
      if (index2 !== -1) { this.ticket.goCompras.splice(index2, 1); }
    } else {
      let index3 = this.ticket.backCompras.indexOf(texto);
      if (index3 !== -1) { this.ticket.backCompras.splice(index3, 1); }
    }

    console.log('this.ticket.comprasDetallesPosicion', this.ticket.comprasDetallesPosicion);
    let index4 = this.ticket.comprasDetallesPosicion.indexOf(texto);
    console.log('index4', index4);
    if (index4 !== -1) {
      this.ticket.comprasDetalles.splice(index4, 1);
      this.ticket.comprasDetallesPosicion.splice(index4, 1);
      // this.mys.ticket = this.ticket;
      this.mys.ticket = this.eliminarAsientoDeTicketCompras(this.ticket, way, idServicio, asiento, y, x, piso)
    }

    let total_general = 0;
    this.ticket.comprasDetalles.forEach(element => {
      total_general = total_general + element.valor;
    });
    this.tarifaTotal = total_general;

    this.mys.ticket = this.eliminarAsientoDeTicketCompras(this.ticket, way, idServicio, asiento, y, x, piso)
    // this.mys.ticket = this.ticket;
    this.eliminadoAsiento = true;
  }

  volver() {
    // if (this.eliminadoAsiento) {
    //   this.router.navigateByUrl('/home');
    // } else {
    // this.mys.regresandoAticket = true;
    // this.mys.ticket = this.ticket
    this.router.navigateByUrl('/ticket');
    // }

  }

  eliminarAsientoDeTicketCompras(ticket, way, idServicio, asiento, y, x, piso) {
    let texto = way + '_' + idServicio + '_' + asiento

    // let texto = this.way + '_' + this.serviceSelected.idServicio + '_' + this.bus[piso][y][x]['asiento'];
    // console.log('--texto',texto);
    // console.log('this.comprasByService',this.comprasByService);
    // let index3 = this.comprasByService.indexOf(texto)
    // if (index3 !== -1) { this.comprasByService.splice(index3, 1); }
    // console.log('this.comprasByService',this.comprasByService);


    if (way === 'go') {
      ticket.goAllService.forEach(item => {

        if (item.idServicio === idServicio) {
          item.my_Bus[piso][y][x]['estado'] = 'libre'
          let index3 = item.my_comprasByService.indexOf(texto)
          if (index3 !== -1) { item.my_comprasByService.splice(index3, 1); }
        }
      });

      let index3 = ticket.goCompras.indexOf(texto)
      if (index3 !== -1) { ticket.goCompras.splice(index3, 1); }


    } else {
      ticket.backAllService.forEach(item => {

        if (item.idServicio === idServicio) {
          item.my_Bus[piso][y][x]['estado'] = 'libre'
          let index3 = item.my_comprasByService.indexOf(texto)
          if (index3 !== -1) { item.my_comprasByService.splice(index3, 1); }
        }
      });





        // item.idServicio === idServicio ? item.my_Bus[piso][y][x]['estado'] = 'libre' : null
      // });
      let index3 = ticket.backCompras.indexOf(texto)
      if (index3 !== -1) { ticket.backCompras.splice(index3, 1); }
    }
    console.log('ticketDsdEliminarxx', ticket);
    return ticket
  }

  async popMenu(event) {
    const popoverMenu = await this.popoverCtrl.create({
      component: PopMenuComponent,
      event,
      mode: 'ios',
      backdropDismiss: true,
      cssClass: "popMenu"
    });
    await popoverMenu.present();

    // recibo la variable desde el popover y la guardo en data
    const { data } = await popoverMenu.onWillDismiss();
    this.router.navigateByUrl(data.destino);
  }

  async popCart(event) {
    this.mys.temporalComprasCarrito = this.ticket.comprasDetalles
    const popoverCart = await this.popoverCtrl.create({
      component: PopCartComponent,
      event,
      mode: 'ios',
      backdropDismiss: true,
      cssClass: "popCart"
    });
    await popoverCart.present();

    // recibo la variable desde el popover y la guardo en data
    // const { data } = await popoverCart.onWillDismiss();
    // this.router.navigateByUrl(data.destino);
  }


}


//////////////////////////////////////////////////////////////////////////////////////
