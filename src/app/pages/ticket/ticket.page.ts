import { Component, OnInit, ViewChild, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import * as _ from 'underscore';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { MyserviceService } from 'src/app/service/myservice.service';
import { IonContent } from '@ionic/angular';
// import { Content } from '@angular/compiler/src/render3/r3_ast';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.page.html',
  styleUrls: ['./ticket.page.scss'],
})
export class TicketPage implements OnInit {

  @ViewChild(IonContent, { static: false }) content: IonContent;
  // @ViewChild('aca', { static: false }) aca: ElementRef;
  @ViewChildren('divServicio') divServicio: QueryList<ElementRef>;
  // @ViewChildren('divServicio', { static: false }) divServicio: QueryList;



  allServices = [];
  serviceSelected;

  piso1 = true;          // true=piso1  ;  false=piso2
  tarifaPiso1: number;
  tarifaPiso2: number;
  tarifaTotal: number = 0;

  compras = [];

  ticket;
  way;

  nowService;
  bus;

  busOriginal = {
    "1": [
      [{ "asiento": "B2", "estado": "sinasiento" }, { "asiento": "B1", "estado": "sinasiento" }, { "asiento": "", "estado": "pasillo" }, { "asiento": "", "estado": "sinasiento" }, { "asiento": "%", "estado": "sinasiento" }],
      [{ "asiento": "1", "estado": "libre" }, { "asiento": "2", "estado": "ocupado" }, { "asiento": "", "estado": "pasillo" }, { "asiento": "", "estado": "sinasiento" }, { "asiento": "3", "estado": "ocupado" }],
      [{ "asiento": "4", "estado": "ocupado" }, { "asiento": "5", "estado": "libre" }, { "asiento": "", "estado": "pasillo" }, { "asiento": "", "estado": "sinasiento" }, { "asiento": "6", "estado": "ocupado" }],
      [{ "asiento": "7", "estado": "libre" }, { "asiento": "8", "estado": "libre" }, { "asiento": "", "estado": "pasillo" }, { "asiento": "", "estado": "sinasiento" }, { "asiento": "9", "estado": "ocupado" }]
    ],
    "2": [
      [{ "asiento": "1", "estado": "libre" }, { "asiento": "2", "estado": "libre" }, { "asiento": "", "estado": "pasillo" }, { "asiento": "3", "estado": "libre" }, { "asiento": "4", "estado": "ocupado" }],
      [{ "asiento": "5", "estado": "ocupado" }, { "asiento": "6", "estado": "libre" }, { "asiento": "", "estado": "pasillo" }, { "asiento": "7", "estado": "ocupado" }, { "asiento": "8", "estado": "libre" }],
      [{ "asiento": "9", "estado": "ocupado" }, { "asiento": "10", "estado": "libre" }, { "asiento": "", "estado": "pasillo" }, { "asiento": "11", "estado": "libre" }, { "asiento": "12", "estado": "libre" }],
      [{ "asiento": "13", "estado": "libre" }, { "asiento": "14", "estado": "libre" }, { "asiento": "", "estado": "pasillo" }, { "asiento": "15", "estado": "libre" }, { "asiento": "16", "estado": "ocupado" }],
      [{ "asiento": "17", "estado": "libre" }, { "asiento": "18", "estado": "libre" }, { "asiento": "", "estado": "pasillo" }, { "asiento": "19", "estado": "libre" }, { "asiento": "20", "estado": "libre" }],
      [{ "asiento": "21", "estado": "libre" }, { "asiento": "22", "estado": "libre" }, { "asiento": "", "estado": "pasillo" }, { "asiento": "23", "estado": "ocupado" }, { "asiento": "24", "estado": "libre" }],
      [{ "asiento": "25", "estado": "libre" }, { "asiento": "26", "estado": "ocupado" }, { "asiento": "", "estado": "pasillo" }, { "asiento": "27", "estado": "libre" }, { "asiento": "28", "estado": "libre" }],
      [{ "asiento": "29", "estado": "libre" }, { "asiento": "30", "estado": "libre" }, { "asiento": "", "estado": "pasillo" }, { "asiento": "31", "estado": "ocupado" }, { "asiento": "32", "estado": "ocupado" }],
      [{ "asiento": "33", "estado": "libre" }, { "asiento": "34", "estado": "libre" }, { "asiento": "", "estado": "pasillo" }, { "asiento": "35", "estado": "libre" }, { "asiento": "36", "estado": "libre" }],
      [{ "asiento": "37", "estado": "ocupado" }, { "asiento": "38", "estado": "ocupado" }, { "asiento": "", "estado": "pasillo" }, { "asiento": "39", "estado": "libre" }, { "asiento": "40", "estado": "ocupado" }],
      [{ "asiento": "41", "estado": "libre" }, { "asiento": "42", "estado": "libre" }, { "asiento": "", "estado": "pasillo" }, { "asiento": "B2", "estado": "sinasiento" }, { "asiento": "B1", "estado": "sinasiento" }]
    ]
  };

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private mys: MyserviceService,
  ) { }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.getServices();

    if (this.mys.ticket) {
      this.ticket = this.mys.ticket;
      this.way = this.mys.way;
      if (this.way === 'back') {
        this.tarifaTotal = this.ticket.goTotal
      }
      this.compras = [];

    } else {
      // solo pruebas
      console.log('Ejecutando con datos de PRUEBAS');
      this.ticket = {
        origin: { nombre: "ALTO HOSPICIO", codigo: "01101002", region: null },
        destiny: { nombre: "CABRERO", codigo: "08303194", region: null },
        tripType: "goBack",
        dateGo: "2019-12-28T22:34:20.295-04:00",
        dateBack: "2019-12-29T22:36:28.833-04:00"
      };
      this.way = 'go';

    }

    this.busOriginal = this.sumar20piso2(this.busOriginal);
    // console.log('this.ticket(iniciando ticket)', this.ticket);
    // console.log('this.way(iniciando ticket)', this.way);
  }

  getServices() {
    this.httpClient.get<any>('assets/json/obtenerServici.json').subscribe(data => {

      data.forEach(element => {
        element['checked'] = false;
      });

      this.allServices = data;
    });
  }


  myServiceSelection(myseleccion: number) {
    console.log('this.allServices', this.allServices);

    // if (this.allServices[myseleccion]['checked']) {
    //   // caso true

    // } else {
    //   // caso false

    // }
    // console.log('-------',this.divServicio['_results'][myseleccion].nativeElement.offsetTop);

    this.serviceSelected = myseleccion;
    // console.log('this.tarifaTotal(antes)',this.tarifaTotal);



    //  inicio con bus limpio
    this.bus = this.busOriginal;
    this.compras = [];

    if (this.ticket.goTotal) {
      this.tarifaTotal = this.ticket.goTotal;
    } else {
      this.tarifaTotal = 0;

    }

    this.bus['1'].forEach(fila => {
      fila.forEach(asiento => {
        asiento.estado === 'seleccionado' ? asiento.estado = 'libre' : null;
      });
    });

    this.bus['2'].forEach(fila => {
      fila.forEach(asiento => {
        asiento.estado === 'seleccionado' ? asiento.estado = 'libre' : null;
      });
    });

    // preparando tarifas
    this.allServices[myseleccion].tarifaPrimerPiso ? this.tarifaPiso1 = parseInt(this.allServices[myseleccion].tarifaPrimerPiso.replace('.', '')) : this.tarifaPiso1 = null;
    this.allServices[myseleccion].tarifaSegundoPiso ? this.tarifaPiso2 = parseInt(this.allServices[myseleccion].tarifaSegundoPiso.replace('.', '')) : this.tarifaPiso2 = null;
    // this.tarifaTotal = 0;
    !this.tarifaPiso2 ? this.piso1 = true : this.piso1 = false;

    this.nowService = this.allServices[myseleccion];
    setTimeout(() => {
      let estadoPrevio = this.allServices[myseleccion]['checked'];
      this.allServices.forEach(element => {
        element['checked'] = false;
      });
      this.allServices[myseleccion]['checked'] = estadoPrevio;
    });
    setTimeout(() => {
      this.content.scrollToPoint(0, this.divServicio['_results'][myseleccion].nativeElement.offsetTop, 100);
    });
    // console.log('this.tarifaTotal(despues)',this.tarifaTotal);

  }


  presionado(piso: string, y: number, x: number) {
    let tarifa;

    if (this.bus[piso][x][y]['estado'] === 'libre') {
      // caso asiento No seleccionado
      this.bus[piso][x][y]['estado'] = 'seleccionado';
      if (piso === '1') {
        // sumando para piso1
        this.tarifaTotal = this.tarifaTotal + this.tarifaPiso1;
        tarifa = this.tarifaPiso1;
      } else {
        // sumando para piso2
        this.tarifaTotal = this.tarifaTotal + this.tarifaPiso2;
        tarifa = this.tarifaPiso2;
      }
      // this.compras.push(`piso_${piso}/fila_${x}/columna_${y}/asiento_${this.bus[piso][x][y]['asiento']}/precio_${tarifa}`);
      this.compras.push(this.bus[piso][x][y]['asiento']);

    } else if (this.bus[piso][x][y]['estado'] === 'seleccionado') {
      // caso asiento ya seleccionado
      this.bus[piso][x][y]['estado'] = 'libre';
      if (piso === '1') {
        // restando para piso1
        this.tarifaTotal = this.tarifaTotal - this.tarifaPiso1;
        tarifa = this.tarifaPiso1;

      } else {
        // restando para piso2
        this.tarifaTotal = this.tarifaTotal - this.tarifaPiso2;
        tarifa = this.tarifaPiso2;
      }
      // creo el texto a eliminar de la compra
      // let texto = `piso_${piso}/fila_${x}/columna_${y}/asiento_${this.bus[piso][x][y]['asiento']}/precio_${tarifa}`;
      let texto = this.bus[piso][x][y]['asiento']
      let index = this.compras.indexOf(texto);
      if (index !== -1) this.compras.splice(index, 1);
    }
  } // fin presionado


  cambiarPiso(piso: number) {
    this.piso1 ? (piso === 2 ? this.piso1 = !this.piso1 : null) : (piso === 1 ? this.piso1 = !this.piso1 : null);
  }

  sumar20piso2(bus: any): any {
    // sumando 20 a los asientos de 2do piso
    bus['2'].forEach(fila => {
      fila.forEach(asiento => {
        !isNaN(parseInt(asiento.asiento)) ? asiento.asiento = parseInt(asiento.asiento) + 20 + '' : null;
      });
    });
    return bus
  }


  continuar() {
    // console.log('this.compras',this.compras);
    if (this.compras.length === 0 && this.way === 'go') {
      this.mys.alertShow('¡Verifique!', 'alert', 'Debe seleccionar al menos un asiento de un servicio para continuar..');
    } else if (this.compras.length > 4 && this.way === 'go') {
      this.mys.alertShow('¡Verifique!', 'alert', 'Máximo número de asientos permitidos de ida son 4');
    } else if (this.compras.length > 4 && this.way === 'back') {
      this.mys.alertShow('¡Verifique!', 'alert', 'Máximo número de asientos permitidos de Regreso son 4');
    } else {

      // Guardo todos los cambios en local
      if (this.way === 'go') {
        this.ticket['goCompras'] = this.compras;
        this.ticket['goTotal'] = this.tarifaTotal;
        this.ticket['goService'] = this.nowService;
      } else {
        this.ticket['backCompras'] = this.compras;
        this.ticket['backTotal'] = this.tarifaTotal;
        this.ticket['backService'] = this.nowService;
      }

      // Guardo todos los cambios locales al service
      this.mys.ticket = this.ticket;
      this.mys.way = this.way;
      // console.log('this.mys.ticket(saliendo de ticket)', this.mys.ticket);
      // console.log('this.way(saliendo de ticket)', this.way);
      this.router.navigateByUrl('/purchase-detail');
    }
  }


  prueba() {
    // console.log('cdddsdvdffffffffffffffffffffffff',this.divServicio['_results'][5].nativeElement.offsetTop);
    // this.content.scrollToPoint(0,this.aca.nativeElement.offsetTop,100);
    // console.log(this.aca.nativeElement.offsetTop);

    //   this.divServicio.toArray().forEach(el => {
    //     el.nativeElement;
    // });

  }

}// fin Ticket
