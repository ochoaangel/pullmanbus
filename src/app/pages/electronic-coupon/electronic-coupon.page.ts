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
  selector: 'app-electronic-coupon',
  templateUrl: './electronic-coupon.page.html',
  styleUrls: ['./electronic-coupon.page.scss'],
})
export class ElectronicCouponPage implements OnInit {

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

    // this.mys.carritoEliminar.subscribe(eliminar => {
    //   console.log('Eliminado desde dentro de tickets', eliminar);

    //   // dejar cuando tien compra detalles
    //   if (this.comprasDetalles.length < 2) {
    //     this.comprasDetalles = [];
    //   } else {
    //     this.comprasDetalles = this.comprasDetalles.filter(x => !(x.idServicio === eliminar.idServicio && x.asiento === eliminar.asiento));
    //   }
    //   this.mys.temporalComprasCarrito = this.comprasDetalles;
    // });
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
    // this.comprasDetalles = this.mys.ticket && this.mys.ticket.comprasDetalles ? this.mys.ticket.comprasDetalles : null;
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


  // checkChangeGoOnly() {
  //   this.goOnly ? this.goBack = false : this.goBack = true;
  // }

  // checkChangeGoBack() {
  //   this.goBack ? this.goOnly = false : this.goOnly = true;
  // }

  // noBack() { this.backDate = null; }


  btnSearch() {


    // Verifico datos requeridos y redirijo a "pasaje ida"
    if (!this.myOrigin) {
      this.mys.alertShow('Verifique', 'alert', 'Seleccione un origen<br> Intente nuevamente..');
    } else if (!this.myDestiny) {
      this.mys.alertShow('Verifique', 'alert', 'Seleccione un destino<br> Intente nuevamente..');
    } else {
      this.ticket = {};

      this.ticket['origen'] = this.myOrigin.codigo;
      this.ticket['destino'] = this.myDestiny.codigo;
      this.ticket['idSistema'] = 1;
      console.log('this.ticket', this.ticket);

      // guardo variable de inicio y redirijo
      this.mys.initCouponResult = this.ticket;
      this.router.navigateByUrl('/coupon-result');
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

    if (this.showSelection) {
      this.showSelection = false;
      this.mySelection = '';
      this.promociones = null;
    } else {
      this.showSelection = false;
      this.mySelection = '';
      this.router.navigateByUrl('/ticket-management');
    }
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