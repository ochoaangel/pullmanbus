import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import * as _ from 'underscore';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { MyserviceService } from 'src/app/service/myservice.service';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.page.html',
  styleUrls: ['./ticket.page.scss'],
})
export class TicketPage implements OnInit {

  ticket = {
    origin: { nombre: "ALTO HOSPICIO", codigo: "01101002", region: null },
    destiny: { nombre: "CABRERO", codigo: "08303194", region: null },
    tripType: "goBack",
    dateGo: "2019-12-28T22:34:20.295-04:00",
    dateBack: "2019-12-29T22:36:28.833-04:00"
  };


  allServices = [];
  // showServices = [];
  page = 0;


  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private mys: MyserviceService,
  ) { }

  ngOnInit() {
    this.getServices();
    if (this.mys.way === 'go') {
      delete this.mys.ticket['serviceGo'];
    } else {
      delete this.mys.ticket['serviceBack'];
    }
    // this.ticket = this.mys.ticket;
  }




  getServices() {
    this.httpClient.get<any>('assets/json/obtenerServici.json').subscribe(data => {

      data.forEach(element => {
        element['checked'] = false;
      });

      console.log('data', data);
      this.allServices = data;
      // this.showServices = data;
    });
  }


  myseleccion(myseleccion: number) {
    setTimeout(() => {

      this.allServices.forEach(element => {
        element['checked'] = false;
      });
      this.allServices[myseleccion]['checked'] = true;
    });

    if (this.mys.way === 'go') {
      this.mys.ticket['serviceGo'] = this.allServices[myseleccion];
    } else {
      this.mys.ticket['serviceBack'] = this.allServices[myseleccion];

    }
  }


  continuar() {

    if (this.mys.way === 'go' && !this.mys.ticket['serviceGo']) {
      this.mys.alertShow('verifique', 'alert', 'Debe seleccionar un Servicio para continuar..');
    } else if (this.mys.way === 'back' && !this.mys.ticket['serviceBack']) {
      this.mys.alertShow('verifique', 'alert', 'Debe seleccionar un Servicio para continuar..');
    } else {
      console.log('this.mys.ticket', this.mys.ticket);
      console.log('this.mys.way', this.mys.way);
      this.router.navigateByUrl('/seat-selection');
    }

  } // fin continuar


}// fin Ticket
