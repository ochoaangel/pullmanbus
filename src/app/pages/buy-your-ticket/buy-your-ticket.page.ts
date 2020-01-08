import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import * as _ from 'underscore';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { MyserviceService } from 'src/app/service/myservice.service';



@Component({
  selector: 'app-buy-your-ticket',
  templateUrl: './buy-your-ticket.page.html',
  styleUrls: ['./buy-your-ticket.page.scss']
})

export class BuyYourTicketPage implements OnInit {

  ticket;

  allOrigin = [];
  allDestiny = [];

  selectOrigin;
  selectDestiny;

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

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private mys: MyserviceService,


  ) { }

  ngOnInit() {
    this.getCityOrigin();
    this.mingoDate = moment().format();
    this.maxgoDate = moment().add(1, 'y').format();
    this.minbackDate = moment().format();
    this.maxbackDate = moment().add(1, 'y').format();





    // setInterval(()=> {
    //   this.show = !this.show;
    // } ,1000);
  }

  getCityOrigin() {
    this.httpClient.get<any>('assets/json/ciudades-codigo2.json').subscribe(data => {
      this.allOrigin = data;
    });
  }


  getCityDestination(value: string) {
    // Falta el uso de value como ciudad de origen
    this.httpClient.get<any>('assets/json/ciudades-codigo2.json').subscribe(data => {
      this.allDestiny = data;
    });
  }


  changeOrigin(value: string) {
    this.allDestiny = [];
    this.getCityDestination(value);
    // coloco placeholder vacio en Destino
    this.selectDestiny = null;
  }


  checkChangeGoOnly() {
    this.goOnly ? this.goBack = false : this.goBack = true;
  }

  checkChangeGoBack() {
    this.goBack ? this.goOnly = false : this.goOnly = true;
  }

  dateChangeGo() { }

  dateChangeBack() { }

  noBack() { this.backDate = null; }



  btnSearch() {

    // PREPARO VARIABLES para guardarlas en el service
    let item;
    this.ticket = {};

    // obtengo el origen completo
    this.allOrigin.forEach(element => {
      if (this.selectOrigin === element.codigo) { item = element; }
    });
    this.ticket['origin'] = item;

    // obtengo el Destino completo
    this.allDestiny.forEach(element => {
      if (this.selectDestiny === element.codigo) { item = element; }
    });
    this.ticket['destiny'] = item;

    // guardo el tipo de viaje
    if (this.backDate) {
      this.ticket['tripType'] = 'goBack'
      this.ticket['goDate'] = this.goDate;
      this.ticket['backDate'] = this.backDate;
    } else {
      this.ticket['tripType'] = 'goOnly';
      this.ticket['goDate'] = this.goDate;
    }

    // iniciando la compra
    this.mys.way = 'go';

    // Verifico datos requeridos y redirijo a "pasaje ida"
    if (!this.selectOrigin) {
      this.mys.alertShow('Verifique', 'alert', 'Seleccione un origen<br> Intente nuevamente..');
    } else if (!this.selectDestiny) {
      this.mys.alertShow('Verifique', 'alert', 'Seleccione un destino<br> Intente nuevamente..');
    } else if (!this.goDate) {
      this.mys.alertShow('Verifique', 'alert', 'Seleccione una Fecha de Ida<br> Intente nuevamente..');
    } else if (this.backDate && (moment(this.backDate).isSameOrBefore(moment(this.goDate)))) {
      this.mys.alertShow('Verifique', 'alert', 'Fecha de ida debe ser <br> antes que <br>fecha de regreso<br> Intente nuevamente..');
    } else {

      this.mys.ticket = this.ticket;
      console.log('this.mys.ticket(saliendo de buy-yout-ticket)', this.mys.ticket);
      this.router.navigateByUrl('/ticket');
    }

  }


}
