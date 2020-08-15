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
  constructor(
    private router: Router,
    private mys: MyserviceService,
    private popoverCtrl: PopoverController,
    private integradorService: IntegradorService,
  ) {

    this.mys.carritoEliminar.subscribe(eliminar => {
      // dejar cuando NOO tiene compraDetalles  
      this.mys.ticket.comprasDetalles = this.mys.ticket.comprasDetalles.filter(x => !(x.idServicio === eliminar.idServicio && x.asiento === eliminar.asiento));
      this.ticket.comprasDetalles = this.mys.ticket.comprasDetalles;

      let total_general = 0;
      this.ticket.comprasDetalles.forEach(element => {
        total_general = total_general + element.valor;
      });
      this.tarifaTotal = total_general;

      if (total_general === 0) {
        this.next = '/home';
      }

      this.mys.liberarAsientoDesdeHeader(eliminar);
    })


  }

  ticket;
  way;
  tarifaTotal;
  eliminadoAsiento = false;
  loading = false;

  next;


  ngOnInit() {
    this.ionViewWillEnter();
  }



  ionViewWillEnter() {
    console.log('this.mys.ticketWillEnter', this.mys.ticket);
    console.log('this.mys.totalWillEnter', this.mys.total);
    if (this.mys.ticket) {
      this.ticket = this.mys.ticket;
      this.way = this.mys.way;
      let total_general = 0;
      this.ticket.comprasDetalles.forEach(element => {
        total_general = total_general + element.valor;
      });
      this.tarifaTotal = total_general;
    }
    console.log('this.tarifaTotalWillEnter', this.tarifaTotal);

    //////////////////////////////////////////////////////////////

    if (this.tarifaTotal === 0) {
      this.next = '/home';
    } else if ((this.ticket.tripType === 'goBack' && this.way === 'back') || (this.ticket.tripType === 'goOnly')) {
      this.next = '/payment-methods';
    } else if (this.ticket.tripType === 'goBack' && this.way === 'go') {
      this.next = '/ticket';
    }






  }

  continuar(destino) {

    switch (destino) {
      case '/home':
        this.mys.ticket = null;
        break;

      case '/payment-methods':
        this.mys.total = this.tarifaTotal;
        localStorage.setItem('totalFinal', JSON.stringify(this.tarifaTotal));
        localStorage.setItem('ticket', JSON.stringify(this.ticket));
        this.mys.ticket = this.ticket;
        break;

      case '/ticket':
        this.way = 'back';
        this.mys.way = this.way;
        this.mys.ticket = this.ticket;
        break;

      default:
        break;
    }
    this.router.navigateByUrl(destino);
  }// fin continuar

  EliminarPasaje(way, idServicio, asiento, y, x, piso) {


    let pasajeAeliminar;

    // elimino el asiento de this.comprasDetalles
    if (this.ticket.comprasDetalles.length > 0) {
      pasajeAeliminar = this.ticket.comprasDetalles
        .filter(x => (x.idServicio === idServicio && x.asiento === asiento))[0];
    }

    console.log('pasajeCompleto', pasajeAeliminar);

    let asientoToDelete = {
      servicio: pasajeAeliminar.idServicio,
      fecha: pasajeAeliminar.service.fechaSalida,
      origen: pasajeAeliminar.service.idTerminalOrigen,
      destino: pasajeAeliminar.service.idTerminalDestino,
      asiento: pasajeAeliminar.asiento,
      integrador: pasajeAeliminar.service.integrador
    };
    this.loading = true;
    this.integradorService.liberarAsiento(asientoToDelete).subscribe(resp => {
      this.loading = false;
    });
    console.log('this.ticket.comprasDetallesAntes', this.ticket.comprasDetalles);

    this.ticket.comprasDetalles = this.ticket.comprasDetalles
      .filter(x => !(x.idServicio === idServicio && x.asiento === asiento));

    console.log('this.ticket.comprasDetallesDespues', this.ticket.comprasDetalles);

    let total_general = 0;
    this.ticket.comprasDetalles.forEach(element => {
      total_general = total_general + element.valor;
    });
    this.tarifaTotal = total_general;

    this.mys.ticket = this.eliminarAsientoDeTicketCompras(this.ticket, way, idServicio, asiento, y, x, piso);
    this.eliminadoAsiento = true;


    if (total_general === 0) {
      this.next = '/home';
    }

  }

  volver() {
    this.router.navigateByUrl('/ticket');
  }

  eliminarAsientoDeTicketCompras(ticket, way, idServicio, asiento, y, x, piso) {
    let texto = way + '_' + idServicio + '_' + asiento;
    if (way === 'go') {
      ticket.goAllService.forEach(item => {

        if (item.idServicio === idServicio) {
          item.my_Bus[piso][y][x]['estado'] = 'libre';
          let index3 = item.my_comprasByService.indexOf(texto);
          if (index3 !== -1) { item.my_comprasByService.splice(index3, 1); }
        }
      });

      let index3 = ticket.goCompras.indexOf(texto);
      if (index3 !== -1) { ticket.goCompras.splice(index3, 1); }


    } else {
      ticket.backAllService.forEach(item => {

        if (item.idServicio === idServicio) {
          item.my_Bus[piso][y][x]['estado'] = 'libre';
          let index3 = item.my_comprasByService.indexOf(texto);
          if (index3 !== -1) { item.my_comprasByService.splice(index3, 1); }
        }
      });
      let index3 = ticket.backCompras.indexOf(texto);
      if (index3 !== -1) { ticket.backCompras.splice(index3, 1); }
    }
    return ticket;
  }

  async popMenu(event) {
    // console.log('event', event);
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
    if (data && data.destino) {
      if (data.destino === '/login') {
        this.mys.checkIfExistUsuario().subscribe(exist => {
          exist ? this.router.navigateByUrl('/user-panel') : this.router.navigateByUrl('/login');
        });
      } else {
        this.router.navigateByUrl(data.destino);
      }
    }

  }

  async popCart(event) {
    this.mys.temporalComprasCarrito = this.ticket.comprasDetalles;
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

  comprarMasPasajes() {
    this.mys.comprarMas = true;
    this.router.navigateByUrl('/buy-your-ticket');
  }

  getItinerario(idServicio) {
    console.log('idServicio', idServicio);
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 1000);
    this.mys.showItinerario(idServicio);
  }


}
