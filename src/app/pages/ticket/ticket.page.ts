import { Component, OnInit, ViewChild, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import * as _ from 'underscore';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { MyserviceService } from 'src/app/service/myservice.service';
import { IonContent } from '@ionic/angular';
import { IntegradorService } from 'src/app/service/integrador.service';
import { CompileMetadataResolver } from '@angular/compiler';
// import { Content } from '@angular/compiler/src/render3/r3_ast';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.page.html',
  styleUrls: ['./ticket.page.scss']
})

export class TicketPage implements OnInit {

  @ViewChild(IonContent, { static: false }) content: IonContent;
  @ViewChildren('divServicio') divServicio: QueryList<ElementRef>;


  loadingService = false;
  loadingBus = false;

  allServices = [];
  serviceSelectedNumber;
  serviceSelected;

  piso1 = true;          // true=piso1  ;  false=piso2
  tarifaPiso1: number;
  tarifaPiso2: number;
  tarifaTotal: number = 0;

  nItemsCart = 7
  // todas ida o  todas vuelta
  compras = [];
  total;

  comprasDetalles = [];
  comprasDetallesPosicion = [];

  comprasByService = [];
  comprasByServiceData = [];
  totalByService = [];

  ticket;
  way;
  goDate;
  backDate;

  nowService;
  bus;



  orderSelected = ''
  orderShowActive = false
  orderWindowsDetail: any = { header: 'Ordenar servicios por:' };

  filterSelected = ''
  filterShowActive = false
  filterWindowsDetail: any = { header: 'Filtrar servicios por:' };





  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private mys: MyserviceService,
    private integradorService: IntegradorService
  ) { }

  ngOnInit() {
    console.log(this.mys.ticket);
  }

  ionViewWillEnter() {
    console.log('ticket Iiciando', this.mys.ticket);
    if (this.mys.ticket) {
      console.log('con valores iniciales......................................');
      this.ticket = this.mys.ticket;
      this.way = this.mys.way;

      if (this.way === 'go') {
        this.compras = this.ticket.goCompras || [];
        this.allServices = this.ticket.goAllService || this.getServicesAndBus('go');
        console.log('GOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO');
        console.log('this.ticket', this.ticket);
        console.log('this.compras', this.compras);
        console.log('this.allServices', this.allServices);
        console.log('finGOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO');

      } else {
        this.compras = this.ticket.backCompras || [];
        this.allServices = this.ticket.backAllService || this.getServicesAndBus('back');
        console.log('BACKKKKKKKKKKKKKKKKKKKKKKKKKKK');
        console.log('this.ticket', this.ticket);
        console.log('this.compras', this.compras);
        console.log('this.allServices', this.allServices);
        console.log('finBACKKKKKKKKKKKKKKKKKKKKKKKKKKK');
      }

      console.log('');

      this.comprasDetalles = this.ticket.comprasDetalles || [];
      this.comprasDetallesPosicion = this.ticket.comprasDetallesPosicion || [];

      let total_general = 0;
      this.comprasDetalles.forEach(element => {
        total_general = total_general + element.valor;
      });
      this.tarifaTotal = total_general;

      console.log('this.compras', this.compras);
      console.log('this.allServices', this.allServices);
      console.log('this.compras', this.compras);
      console.log('this.ticket', this.ticket);
      console.log('this.way', this.way);
      console.log('total_general', total_general);


    } else {
      // solo pruebas
      console.log('Ejecutando con datos de PRUEBAS');
      this.getServicesAndBus('go');
      this.ticket = {
        origin: { nombre: "ALTO HOSPICIO", codigo: "01101002", region: null },
        destiny: { nombre: "CABRERO", codigo: "08303194", region: null },
        tripType: "goBack",
        goDate: "2019-12-28T22:34:20.295-04:00",
        backDate: "2019-12-29T22:36:28.833-04:00"
      };
      this.way = 'go';

    }



    this.goDate = moment(this.ticket.goDate).format('DD/MM/YYYY');
    this.backDate = moment(this.ticket.backDate).format('DD/MM/YYYY');

    console.log('this.ticket', this.ticket);
    console.log('this.goDate', this.goDate);
    console.log('this.backDate', this.backDate);
    console.log('this.way', this.way);
    console.log('this.allServices', this.allServices);

    // this.busOriginal = this.sumar20piso2(this.busOriginal);

    // console.log('this.ticket(iniciando ticket)', this.ticket);
    // console.log('this.way(iniciando ticket)', this.way);
    // console.log('this.allServices', this.allServices);
  }


  getServicesAndBus(wayNow: string) {
    let findService;
    this.loadingService = true;
    if (wayNow === 'back') {
      findService = {
        "origen": this.mys.ticket.destiny.codigo,
        "destino": this.mys.ticket.origin.codigo,
        "fecha": moment(this.ticket.backDate).format('YYYYMMDD'),
        "hora": "0000",
        "idSistema": 1
      }
    } else {
      findService = {
        "origen": this.mys.ticket.origin.codigo,
        "destino": this.mys.ticket.destiny.codigo,
        "fecha": moment(this.ticket.goDate).format('YYYYMMDD'),
        "hora": "0000",
        "idSistema": 1
      }

    }

    console.log(findService);
    this.integradorService.getService(findService).subscribe(data => {
      this.allServices = data;
      this.loadingService = false;
      console.log(wayNow, 'this.allServices', data);



      this.allServices.forEach(servicio => {
        this.comprasDetalles.forEach(compra => {
          if (servicio.idServicio === compra.idServicio) {
            console.log('iguales servicio.idServicio === compra.idServicio', compra.idServicio);
            servicio['my_comprasByService'] = compra['my_comprasByService']
            servicio['my_comprasByServiceData'] = compra['my_comprasByServiceData']
          }
        });
      });


    })

  }

  // getBusFromService() {
  //   console.log('Entrando a getBusFromService');
  //   console.log('this.allServiceDsdBus1', this.allServices);
  //   // this.loadingBus = true;
  //   this.allServices.forEach(element => {
  //     this.httpClient.get<any>('assets/json/planillaVertical').subscribe(myBus => {
  //       element['bus'] = this.sumar20piso2(myBus);
  //       element['my_comprasByService'] = [];
  //       element['my_comprasByServiceData'] = [];
  //       // this.loadingBus = false;

  //     });
  //   });

  // }



  myServiceSelection(nServiceSeleccion: number) {
    // setTimeout(() => {
    let estadoPrevio = this.allServices[nServiceSeleccion]['checked'];
    this.allServices.forEach(element => {
      element['checked'] = false;
    });
    this.loadingBus = true;
    this.allServices[nServiceSeleccion]['checked'] = estadoPrevio;
    // });
    console.log(nServiceSeleccion);
    if (this.serviceSelectedNumber !== nServiceSeleccion) {
      let servicio = {
        "idServicio": this.allServices[nServiceSeleccion].idServicio,
        "idOrigen": this.allServices[nServiceSeleccion].idTerminalOrigen,
        "idDestino": this.allServices[nServiceSeleccion].idTerminalDestino,
        "tipoBusPiso1": this.allServices[nServiceSeleccion].busPiso1,
        "tipoBusPiso2": this.allServices[nServiceSeleccion].busPiso2,
        "fechaServicio": this.allServices[nServiceSeleccion].fechaServicio,
        "integrador": this.allServices[nServiceSeleccion].integrador
      }
      console.log(servicio);

      setTimeout(() => {
        this.integradorService.getPlanillaVertical(servicio).subscribe(myBusFromApi => {
          // agrego bus y sumo 20 a cada asiento de piso 2
          // console.log(myBusFromApi["1"]);
          // console.log(myBusFromApi["2"]);
          console.log('this.bus_RECIBIDO', myBusFromApi);
          this.loadingBus = false;

          // setTimeout(() => {
          //   let estadoPrevio = this.allServices[nServiceSeleccion]['checked'];
          //   this.allServices.forEach(element => {
          //     element['checked'] = false;
          //   });
          //   this.allServices[nServiceSeleccion]['checked'] = estadoPrevio;
          // });

          this.allServices[nServiceSeleccion]['my_Bus'] = this.sumar20piso2(myBusFromApi);
          this.allServices[nServiceSeleccion]['my_comprasByService'] = [];
          this.allServices[nServiceSeleccion]['my_comprasByServiceData'] = [];

          this.allServices[nServiceSeleccion].checked = true;
          this.comprasByService = this.allServices[nServiceSeleccion]['my_comprasByService'];
          this.comprasByServiceData = this.allServices[nServiceSeleccion]['my_comprasByServiceData'];
          this.serviceSelectedNumber = nServiceSeleccion;
          this.serviceSelected = this.allServices[nServiceSeleccion];

          this.bus = this.allServices[this.serviceSelectedNumber].my_Bus;



          // this.compras = [];
          console.log('this.bus_PROCESADO', this.bus);
          // verificar si se ha comprado en este servicio
          let nowIdService = this.allServices[nServiceSeleccion]['idServicio']

          this.comprasDetalles.forEach(element => {
            if (element.idServicio === nowIdService) {
              this.bus = element.bus
            }
          });

          console.log(' this.allServices[nServiceSeleccion][idServicio]', this.allServices[nServiceSeleccion]['idServicio']);
          console.log('this.comprasDetalles', this.comprasDetalles);
          console.log('this.comprasDetallesPosicion', this.comprasDetallesPosicion);




          // if (this.ticket.goTotal) {
          //   this.tarifaTotal = this.ticket.goTotal;
          // } else {
          //   this.tarifaTotal = 0;
          // }

          // preparando tarifas
          this.allServices[nServiceSeleccion].tarifaPrimerPiso ? this.tarifaPiso1 = parseInt(this.allServices[nServiceSeleccion].tarifaPrimerPiso.replace('.', '')) : this.tarifaPiso1 = null;
          this.allServices[nServiceSeleccion].tarifaSegundoPiso ? this.tarifaPiso2 = parseInt(this.allServices[nServiceSeleccion].tarifaSegundoPiso.replace('.', '')) : this.tarifaPiso2 = null;
          !this.tarifaPiso2 ? this.piso1 = true : this.piso1 = false;

          this.nowService = this.allServices[nServiceSeleccion];



          setTimeout(() => {
            this.content.scrollToPoint(0, this.divServicio['_results'][nServiceSeleccion].nativeElement.offsetTop, 100);
          });
        });

      }, 1000);



    } else {
      this.allServices[this.serviceSelectedNumber]['checked'] = !this.allServices[this.serviceSelectedNumber]['checked'];
      // console.log('CASO AISLADO');
    }

  }


  presionadoAsiento(piso: string, y: number, x: number) {
    console.log('this.way', this.way);

    if (this.compras.length >= 4 && this.way === 'go' && this.bus[piso][x][y]['estado'] === 'libre') {
      this.allServices.forEach(element => {
        element['checked'] = false;
      });
      this.mys.alertShow('¡Verifique!', 'alert', 'Máximo número de asientos permitidos de ida son 4');
    } else if (this.compras.length >= 4 && this.way === 'back' && this.bus[piso][x][y]['estado'] === 'libre') {
      this.allServices.forEach(element => {
        element['checked'] = false;
      });
      this.mys.alertShow('¡Verifique!', 'alert', 'Máximo número de asientos permitidos de Regreso son 4');
    } else {
      console.log('__this.comprasByService', this.comprasByService);
      console.log('__this.compras', this.compras);
      console.log('__this.comprasByService', this.comprasByService);
      console.log('__this.comprasDetalles', this.comprasDetalles);
      console.log('__this.allServices', this.allServices);

      let asiento = {
        "servicio": this.serviceSelected.idServicio,
        "fecha": this.serviceSelected.fechaSalida,
        "origen": this.serviceSelected.idTerminalOrigen,
        "destino": this.serviceSelected.idTerminalDestino,
        "asiento": this.bus[piso][x][y].asiento,
        "integrador": this.serviceSelected.integrador
      }
      console.log(asiento);

      if (this.bus[piso][x][y]['estado'] === 'libre') {


        this.integradorService.validarAsiento(asiento).subscribe(disponible => {
          if (disponible == 0) {
            this.integradorService.tomarAsiento(asiento).subscribe(resp => {
              if (resp == 0) {
                this.mys.alertShow('¡Verifique!', 'alert', 'Error al tomar asiento.');
              } else {
                this.tomarAsiento(piso, x, y);
              }
            })
          } else {
            this.mys.alertShow('¡Verifique!', 'alert', 'Asiento no disponible, está siendo reservado por otro cliente.');
            this.bus[piso][x][y]['estado'] = 'ocupado';
          }
        })



      } else if (this.bus[piso][x][y]['estado'] === 'seleccionado') {


        this.integradorService.liberarAsiento(asiento).subscribe(resp => {
          if (resp == 0) {
            this.mys.alertShow('¡Verifique!', 'alert', 'Error al liberar asiento.');
          } else {
            this.liberarAsiento(piso, x, y);
          }
        })


      }
      // guardo en this.allServices
      this.allServices[this.serviceSelectedNumber].my_Bus = this.bus;
      this.allServices[this.serviceSelectedNumber].my_comprasByService = this.comprasByService;
      this.allServices[this.serviceSelectedNumber].my_comprasByServiceData = this.comprasByServiceData;

      // // calculo la tarifa total
      // let total_general = 0;
      // this.comprasDetalles.forEach(element => {
      //   total_general = total_general + element.valor;
      // });
      // this.tarifaTotal = total_general;

      console.log('this.compras', this.compras);
      console.log('this.comprasByService', this.comprasByService);
      console.log('this.comprasDetalles', this.comprasDetalles);
      console.log('this.allServices', this.allServices);
    } // fin de numeros asientos permitidos
  } // fin presionado


  liberarAsiento(piso, x, y) {
    let tarifa;
    // caso asiento ya seleccionado
    this.bus[piso][x][y]['estado'] = 'libre';

    // creo el texto a eliminar de la compra
    // let texto = `piso_${piso}/fila_${x}/columna_${y}/asiento_${this.bus[piso][x][y]['asiento']}/precio_${tarifa}`;
    let texto = this.way + '_' + this.serviceSelected.idServicio + '_' + this.bus[piso][x][y]['asiento'];

    // variables totales
    console.log('Verificandoooooooooooooooooooooooooooooooooo');
    console.log('texto a buscar:', texto);
    console.log('this.compras', this.compras);
    console.log('this.comprasDetalles', this.comprasDetalles);
    console.log('this.comprasDetallesPosicion', this.comprasDetallesPosicion);
    console.log('this.comprasByService', this.comprasByService);
    console.log('this.comprasByServiceData', this.comprasByServiceData);
    console.log('-------------------------------------------------');
    let index = this.compras.indexOf(texto);
    if (index !== -1) { this.compras.splice(index, 1); this.comprasDetalles.splice(index, 1); this.comprasDetallesPosicion.splice(index, 1); }
    else {
      let index = this.comprasDetallesPosicion.indexOf(texto);
      if (index !== -1) { this.comprasDetallesPosicion.splice(index, 1); this.comprasDetalles.splice(index, 1); }


     }

    // variables por servicio
    let index2 = this.comprasByService.indexOf(texto)
    if (index2 !== -1) { this.comprasByService.splice(index2, 1); this.comprasByServiceData.splice(index2, 1); }

    console.log('texto a buscar:', texto);
    console.log('this.compras', this.compras);
    console.log('this.comprasDetalles', this.comprasDetalles);
    console.log('this.comprasDetallesPosicion', this.comprasDetallesPosicion);
    console.log('this.comprasByService', this.comprasByService);
    console.log('this.comprasByServiceData', this.comprasByServiceData);


    // // calculo la tarifa total
    let total_general = 0;
    this.comprasDetalles.forEach(element => {
      total_general = total_general + element.valor;
    });
    this.tarifaTotal = total_general;

    console.log('finVerificandoooooooooooooooooooooooooooooooooo');
  }


  tomarAsiento(piso, x, y) {
    let tarifa;
    // caso asiento No seleccionado
    this.bus[piso][x][y]['estado'] = 'seleccionado';
    if (piso === '1') {
      // sumando para piso1
      // this.tarifaTotal = this.tarifaTotal + this.tarifaPiso1;
      tarifa = this.tarifaPiso1;
    } else {
      // sumando para piso2
      // this.tarifaTotal = this.tarifaTotal + this.tarifaPiso2;
      tarifa = this.tarifaPiso2;
    }
    // this.compras.push(`piso_${piso}/fila_${x}/columna_${y}/asiento_${this.bus[piso][x][y]['asiento']}/precio_${tarifa}`);
    // this.allServices[this.serviceSelectedNumber]['my_Total'] = this.tarifaTotal;

    this.compras.push(this.way + '_' + this.serviceSelected.idServicio + '_' + this.bus[piso][x][y]['asiento']);
    this.comprasByService.push(this.way + '_' + this.serviceSelected.idServicio + '_' + this.bus[piso][x][y]['asiento']);
    this.comprasByServiceData.push({ asiento: this.bus[piso][x][y]['asiento'], piso, x, y });
    // this.total


    this.comprasDetallesPosicion.push(this.way + '_' + this.serviceSelected.idServicio + '_' + this.bus[piso][x][y]['asiento']);
    this.comprasDetalles.push({
      nService: this.serviceSelectedNumber,
      idServicio: this.serviceSelected.idServicio,
      asiento: this.bus[piso][x][y]['asiento'],
      piso: parseInt(piso),
      valor: parseInt(tarifa),
      fila: x,
      columna: y,
      way: this.way,
      service: this.serviceSelected,
      bus: this.bus,
    });

    // // calculo la tarifa total
    let total_general = 0;
    this.comprasDetalles.forEach(element => {
      total_general = total_general + element.valor;
    });
    this.tarifaTotal = total_general;


  }

  cambiarPiso(piso: number) {
    this.piso1 ? (piso === 2 ? this.piso1 = !this.piso1 : null) : (piso === 1 ? this.piso1 = !this.piso1 : null);
  }

  sumar20piso2(bus: any): any {
    // sumando 20 a los asientos de 2do piso
    if (bus['2'] != undefined) {
      bus['2'].forEach(fila => {
        fila.forEach(asiento => {
          if (asiento != null)
            !isNaN(parseInt(asiento.asiento)) ? asiento.asiento = parseInt(asiento.asiento) + 20 + '' : null;
        });
      });
    }
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

      // ocultar asientos      
      this.allServices.forEach(element => {
        element['checked'] = false;
      });

      // Guardo todos los cambios en local
      if (this.way === 'go') {
        this.ticket['goCompras'] = this.compras;
        this.ticket['goTotal'] = this.tarifaTotal;
        this.ticket['goService'] = this.nowService;
        this.ticket['goAllService'] = this.allServices;
      } else {
        this.ticket['backCompras'] = this.compras;
        this.ticket['backTotal'] = this.tarifaTotal;
        this.ticket['backService'] = this.nowService;
        this.ticket['backAllService'] = this.allServices;
      }
      this.ticket['comprasDetalles'] = this.comprasDetalles;
      this.ticket['comprasDetallesPosicion'] = this.comprasDetallesPosicion;
      // this.bus=null;
      this.serviceSelectedNumber = null

      // Guardo todos los cambios locales al service
      this.mys.ticket = this.ticket;
      this.mys.way = this.way;
      console.log('this.mys.ticket(saliendo de ticket)', this.mys.ticket);
      console.log('this.way(saliendo de ticket)', this.way);

      // if (this.mys.way === 'go' && this.ticket.goCompras) {
      console.log('this.way', this.way);
      console.log('this.mys.way', this.mys.way);
      // if (this.mys.way === 'go' && this.ticket.triptype === 'goBack') {
      if (this.mys.way === 'go' && this.ticket.tripType === 'goBack') {
        console.log('redirigiendo a BACK y recarganto ticket');
        this.mys.way = 'back'
        this.ticket = null
        this.ionViewWillEnter()
        // } else if (this.mys.way === 'go' && this.ticket.triptype ==='goBack') {

      } else {
        this.router.navigateByUrl('/purchase-detail');
      }

    }
  }

  prueba() {
    console.log('this.allServices', this.allServices);
  }

  atras() {
    if (this.mys.way === 'back') {
      this.mys.way = 'go'
      this.serviceSelectedNumber = null
      this.ionViewWillEnter()
    } else {
      this.serviceSelectedNumber = null
      this.mys.ticket = null;
      this.router.navigateByUrl('/buy-your-ticket');
    }
  }

  // orderCancel() { this.orderShowActive = false }
  // filterCancel() { this.filterShowActive = false }




  orderCambio() {
    console.log('$event', this.orderSelected);
    switch (this.orderSelected) {

      case 'precioAsc':
        console.log('this.allServices_Asc1', this.allServices);
        this.allServices = _.sortBy(this.allServices, (element) => {
          // console.log(parseInt(element.tarifaPrimerPiso));
          console.log(parseInt(element.tarifaPrimerPiso.replace(/./g, '')));
          return element.tarifaPrimerPiso
        })
        console.log('this.allServices_Asc2', this.allServices);
        break;

      case 'precioDsc':
        console.log('this.allServices_Dsc1', this.allServices);
        this.allServices = _.sortBy(this.allServices, 'tarifaPrimerPiso').reverse()
        console.log('this.allServices_Dsc2', this.allServices);
        break;


      case 'origenAsc':
        this.allServices = _.sortBy(this.allServices, 'terminalSalida')
        break;
      case 'origenDsc':
        this.allServices = _.sortBy(this.allServices, 'terminalSalida').reverse()
        break;
      case 'destinoAsc':
        this.allServices = _.sortBy(this.allServices, 'terminaLlegada')
        break;
      case 'destinoDsc':
        this.allServices = _.sortBy(this.allServices, 'terminaLlegada').reverse()
        break;
      case 'horaAsc':
        this.allServices = _.sortBy(this.allServices, (item) => {
          return moment(`${item.horaSalida} ${item.fechaSalida}`, 'HH:mm DD/MM/YYYY').format()
        })
        break;
      case 'horaDsc':
        this.allServices = _.sortBy(this.allServices, (item) => {
          return moment(`${item.horaSalida} ${item.fechaSalida}`, 'HH:mm DD/MM/YYYY').format()
        })
        this.allServices = this.allServices.reverse()
        break;

      case 'empresaAsc':
        this.allServices = _.sortBy(this.allServices, 'empresa')
        break;
      case 'empresaDsc':
        this.allServices = _.sortBy(this.allServices, 'empresa').reverse()
        break;

      default:
        break;
    }
  }

}// fin Ticket
