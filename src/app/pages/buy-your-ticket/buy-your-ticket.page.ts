import { Component, OnInit, ViewChild, ElementRef, Renderer } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import * as _ from 'underscore';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { MyserviceService } from 'src/app/service/myservice.service';
import { IntegradorService } from 'src/app/service/integrador.service';
import { PopoverController } from '@ionic/angular';
import { PopMenuComponent } from 'src/app/components/pop-menu/pop-menu.component';
import { PopCartComponent } from 'src/app/components/pop-cart/pop-cart.component';



@Component({
  selector: 'app-buy-your-ticket',
  templateUrl: './buy-your-ticket.page.html',
  styleUrls: ['./buy-your-ticket.page.scss']
})

export class BuyYourTicketPage implements OnInit {

  ticket;

  showSelection = false;
  mySelection = '';

  allOrigin = [];
  allDestiny = [];

  myOrigin;
  myDestiny;

  selectOrigin;
  selectDestiny;


  loading = false;

  goDate;
  backDate;

  mingoDate;
  maxgoDate;
  minbackDate;
  maxbackDate;

  stringgoDate;
  stringbackDate;

  // condiciones iniciales
  goOnly = true;
  goBack = false;

  inputFiltrado;
  inputFuente;

  promociones;  // recibe colecciones

  comprasDetalles = [];


  constructor(
    private httpClient: HttpClient,
    private router: Router,
    public mys: MyserviceService,
    private integradorService: IntegradorService,
    private popoverCtrl: PopoverController,
    private renderer: Renderer,
  ) {
    this.loading = false;

    this.mys.carritoEliminar.subscribe(eliminar => {
      console.log('Eliminado desde dentro de tickets', eliminar);

      // dejar cuando tien compra detalles
      this.comprasDetalles = this.comprasDetalles.filter(x => !(x.idServicio === eliminar.idServicio && x.asiento === eliminar.asiento));

      this.mys.temporalComprasCarrito = this.comprasDetalles;
      this.mys.liberarAsientoDesdeHeader(eliminar);
    })
  }

  ngOnInit() {
    this.mingoDate = moment().format();
    this.maxgoDate = moment().add(1, 'y').format();
    this.minbackDate = moment().format();
    this.maxbackDate = moment().add(1, 'y').format();
    this.getCityOrigin();
    this.goDate = moment().format();
  }

  ionViewWillEnter() {
    this.comprasDetalles = this.mys.ticket && this.mys.ticket.comprasDetalles ? this.mys.ticket.comprasDetalles : null;
    this.myOrigin = null;
    this.myDestiny = null;
    this.promociones = null;

  }

  getCityOrigin() {
    this.loading = true;
    this.integradorService.getCityOrigin().subscribe(data => {
      this.loading = false;
      this.allOrigin = data;
      this.inputFuente = data;
      this.inputFiltrado = data;
    });
  }

  getCityDestination(value: string) {
    this.loading = true;

    this.integradorService.getCityDestination(value).subscribe(data => {
      this.loading = false;
      this.allDestiny = data;
      this.inputFuente = data;
      this.inputFiltrado = data;
    });
  }

  changeOrigin(value: string) {
    this.allDestiny = [];
    this.getCityDestination(value);
    this.selectDestiny = null;
  }


  checkChangeGoOnly() {
    this.goOnly ? this.goBack = false : this.goBack = true;
  }

  checkChangeGoBack() {
    this.goBack ? this.goOnly = false : this.goOnly = true;
  }

  noBack() { this.backDate = null; }


  btnSearch() {

    this.ticket = this.mys.ticket ? {
      comprasDetalles: this.mys.ticket.comprasDetalles,
      comprasDetallesPosicion: this.mys.ticket.comprasDetallesPosicion,
      goCompras: this.mys.ticket.comprasDetalles,
      backCompras: this.mys.ticket.comprasDetalles,
    } : {};

    this.ticket['origin'] = this.myOrigin;
    this.ticket['destiny'] = this.myDestiny;

    // guardo el tipo de viaje
    if (this.backDate) {
      this.ticket['tripType'] = 'goBack';
      this.ticket['goDate'] = this.goDate;
      this.ticket['backDate'] = this.backDate;
    } else {
      this.ticket['tripType'] = 'goOnly';
      this.ticket['goDate'] = this.goDate;
    }

    // iniciando la compra
    this.mys.way = 'go';

    // Verifico datos requeridos y redirijo a "pasaje ida"
    if (!this.myOrigin) {
      this.mys.alertShow('Verifique', 'alert', 'Seleccione un origen<br> Intente nuevamente..');
    } else if (!this.myDestiny) {
      this.mys.alertShow('Verifique', 'alert', 'Seleccione un destino<br> Intente nuevamente..');
    } else if (!this.goDate) {
      this.mys.alertShow('Verifique', 'alert', 'Seleccione una Fecha de Ida<br> Intente nuevamente..');
    } else if (this.backDate && (moment(this.backDate).isSameOrBefore(moment(this.goDate)))) {
      this.mys.alertShow('Verifique', 'alert', 'Fecha de ida debe ser <br> antes que <br>fecha de regreso<br> Intente nuevamente..');
    } else {

      this.mys.ticket = this.ticket;
      this.router.navigateByUrl('/ticket');
    }

  }


  teclaInput($event) {
    if ($event.target.value.length === 0) {
      this.inputFiltrado = this.inputFuente;
    } else {

      let filtradox = [];
      let minuscula1 = $event.target.value.toLowerCase().trim();
      this.inputFuente.forEach(element => {
        let minuscula2 = element.nombre.toLowerCase().trim();
        minuscula2.includes(minuscula1) ? filtradox.push(element) : null;
      });
      this.inputFiltrado = filtradox;
    }

  }

  btnSelecccionarOrigen() {
    this.inputFuente = this.allOrigin;
    this.inputFiltrado = this.allOrigin;
    this.mySelection = 'origin';
    this.showSelection = true;
  }

  btnSelecccionarDestino() {
    this.showSelection = true;
    this.mySelection = 'destiny';
  }

  seleccion(item) {
    if (this.mySelection === 'origin') {
      this.showSelection = false;
      this.mySelection = '';
      this.myOrigin = item;
      this.getCityDestination(item.codigo);
    } else {
      this.showSelection = false;
      this.mySelection = '';
      this.myDestiny = item;
    }
    this.cambioOrigenDestinoIda();
  }

  atras() {
    console.log('this.inputFuente', this.inputFuente);
    console.log('this.inputFiltrado', this.inputFiltrado);

    if (this.showSelection) {
      this.showSelection = false;
      this.mySelection = '';
      this.promociones = null;
    } else {
      this.showSelection = false;
      this.mySelection = '';
      this.router.navigateByUrl('/home');
    }
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
    this.mys.temporalComprasCarrito = this.comprasDetalles;
    const popoverCart = await this.popoverCtrl.create({
      component: PopCartComponent,
      event,
      mode: 'ios',
      backdropDismiss: true,
      cssClass: 'popCart'
    });
    await popoverCart.present();

    const { data } = await popoverCart.onDidDismiss();
    console.log('data en padre desde popover', data);

  }


  cambioFechaIda() {
    if (!this.backDate) {
      // caso que NO exista fecha de regreso definida
      // se define fecha minima y maxima de fecha de regreso
      this.minbackDate = this.goDate;
      this.maxbackDate = moment(this.goDate).add(1, 'y').format();
    } else if (moment(this.goDate).isAfter(this.backDate)) {
      // caso que SI exista fecha de regreso definida
      // se define fecha minima y maxima de fecha de regreso
      this.backDate = null;
      this.minbackDate = this.goDate;
      this.maxbackDate = moment(this.goDate).add(1, 'y').format();
    }
    this.cambioOrigenDestinoIda();
  }


  cambioOrigenDestinoIda() {
    if (this.myOrigin && this.myDestiny && this.goDate) {
      let params = {
        origen: this.myOrigin.codigo,
        destino: this.myDestiny.codigo,
        fechaSalida: moment(this.goDate).format('YYYYMMDD'),
        etapa: 1,
      };
      this.loading = true;
      this.integradorService.buscaCaluga(params).subscribe(resp => {
        this.loading = false;
        this.promociones = resp;
      });
    }
  }


}