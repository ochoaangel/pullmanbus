
import { Component, OnInit, ViewChild, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as _ from 'underscore';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { MyserviceService } from 'src/app/service/myservice.service';
import { IonContent, PopoverController } from '@ionic/angular';
import { IntegradorService } from 'src/app/service/integrador.service';
import { CompileMetadataResolver } from '@angular/compiler';
import { PopMenuComponent } from 'src/app/components/pop-menu/pop-menu.component';
import { PopCartComponent } from 'src/app/components/pop-cart/pop-cart.component';
import { SIGABRT } from 'constants';
import { timeStamp } from 'console';

@Component({
  selector: 'app-confirm-seat',
  templateUrl: './confirm-seat.page.html',
  styleUrls: ['./confirm-seat.page.scss'],
})

export class ConfirmSeatPage implements OnInit {

  @ViewChild(IonContent, { static: false }) content: IonContent;
  @ViewChildren('divServicio') divServicio: QueryList<ElementRef>;


  loadingService = false;
  loadingBus = false;
  loadingSeat = 0;
  loading = 0;

  allServices = [];
  serviceSelectedNumber;
  serviceSelected;

  piso1 = true;          // true=piso1  ;  false=piso2
  tarifaPiso1: number;
  tarifaPiso2: number;
  tarifaTotal: number = 0;

  nItemsCart = 7;
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

  tomarAsientoPromocion;

  promoEtapa2;

  empresa;
  clase;

  orderSelected = '';
  orderShowActive = false;
  orderWindowsDetail: any = { header: 'Ordenar servicios por:' };

  filterSelected = '';
  filterShowActive = false;
  filterWindowsDetail: any = { header: 'Filtrar servicios por:' };


  confirmFromticketConfirmation;

  sinServicios = false;

  info;
  claseFiltro : string[]

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private mys: MyserviceService,
    private integradorService: IntegradorService,
    private popoverCtrl: PopoverController,

  ) {
  }

  ngOnInit() { }

  ionViewWillEnter() {

    // obtengo la ingo de inicio
    let confirm = this.mys.confirm;

    if (confirm) {

      this.info = confirm;
      this.confirmFromticketConfirmation = this.mys.confirm;
      this.comprasDetalles = [];
      this.loading++;
      this.integradorService.getService(confirm.obtenerServicio).subscribe(data => {
        console.log("RESPUESTA ", data)
        this.loading--;

        // filtro los servicios con las caracteristicas deseadas
        this.clase = confirm.filtros.clase;
        this.empresa = confirm.filtros.empresa;

        console.log("clase", this.clase);
        console.log("empresa", this.empresa);
        console.log(confirm.filtros.claseFiltro);
        this.claseFiltro = confirm.filtros.claseFiltro
        let allServicesTemp = []
        confirm.filtros.claseFiltro.forEach(clase => {
          clase = clase.substring(0,3)
          allServicesTemp = []
          allServicesTemp= data.filter(x =>
            (
              (x.idClaseBusPisoUno != undefined ? x.idClaseBusPisoUno.substring(0,3) === clase : false) ||
              (x.idClaseBusPisoDos != undefined ? x.idClaseBusPisoDos.substring(0,3) === clase : false)
            )
          );
          this.allServices.push.apply(this.allServices, allServicesTemp)
        })
        if (this.allServices.length === 0) {
          this.sinServicios = true;
        }
      });

    } else {
      this.router.navigateByUrl('/ticket-confirmation');
      this.mys.confirm = null;
      this.mys.confirmSelected = null;
    }

  }


  getServicesAndBus(wayNow: string) {
    let findService;
    this.loadingService = true;
    if (wayNow === 'back') {
      findService = {
        'origen': this.mys.ticket.destiny.codigo,
        'destino': this.mys.ticket.origin.codigo,
        'fecha': moment(this.ticket.backDate).format('YYYYMMDD'),
        'hora': '0000',
        'idSistema': 1
      };
    } else {
      findService = {
        'origen': this.mys.ticket.origin.codigo,
        'destino': this.mys.ticket.destiny.codigo,
        'fecha': moment(this.ticket.goDate).format('YYYYMMDD'),
        'hora': '0000',
        'idSistema': 1
      };

    }

    this.integradorService.getService(findService).subscribe(data => {
      this.allServices = data;
      console.log('this.allServices', this.allServices);
      console.log('this.allServicesTRUE', this.allServices.filter(x => x.promocion));

      this.loadingService = false;
      this.allServices.forEach(servicio => {
        this.comprasDetalles.forEach(compra => {
          if (servicio.idServicio === compra.idServicio) {
            servicio['my_comprasByService'] = compra['my_comprasByService'];
          }
        });
      });
    });

  }




  myServiceSelection(nServiceSeleccion: number) {

    let estadoPrevio = this.allServices[nServiceSeleccion]['checked'];
    this.allServices.forEach(element => {
      element['checked'] = false;
    });
    this.allServices[nServiceSeleccion]['checked'] = estadoPrevio;
    this.muestraPiso(this.allServices[nServiceSeleccion]['idClaseBusPisoUno']) ? this.piso1 = true : this.piso1 = false;
    this.loadingBus = true;
    // });
    if (this.serviceSelectedNumber !== nServiceSeleccion) {
      let servicio = {
        'idServicio': this.allServices[nServiceSeleccion].idServicio,
        'idOrigen': this.allServices[nServiceSeleccion].idTerminalOrigen,
        'idDestino': this.allServices[nServiceSeleccion].idTerminalDestino,
        'tipoBusPiso1': this.allServices[nServiceSeleccion].busPiso1,
        'tipoBusPiso2': this.allServices[nServiceSeleccion].busPiso2,
        'fechaServicio': this.allServices[nServiceSeleccion].fechaServicio,
        'integrador': this.allServices[nServiceSeleccion].integrador
      };

      setTimeout(() => {
        this.loading++;
        this.integradorService.getPlanillaVertical(servicio).subscribe(myBusFromApi => {
          this.loading--;
          // agrego bus y sumo 20 a cada asiento de piso 2

          let estadoPrevio = this.allServices[nServiceSeleccion]['checked'];
          this.allServices.forEach(element => {
            element['checked'] = false;
          });
          this.allServices[nServiceSeleccion]['checked'] = estadoPrevio;
          console.log("myBusFromApi",myBusFromApi)
          this.allServices[nServiceSeleccion]['my_Bus'] = myBusFromApi;
          this.allServices[nServiceSeleccion].checked = true;
          this.comprasByService = this.allServices[nServiceSeleccion]['my_comprasByService'];
          this.serviceSelectedNumber = nServiceSeleccion;
          this.serviceSelected = this.allServices[nServiceSeleccion];

          this.bus = this.allServices[this.serviceSelectedNumber].my_Bus;



          // verificar si se ha comprado en este servicio
          let nowIdService = this.allServices[nServiceSeleccion]['idServicio'];

          // preparando tarifas
          this.allServices[nServiceSeleccion].tarifaPrimerPisoInternet ? this.tarifaPiso1 = parseInt(this.allServices[nServiceSeleccion].tarifaPrimerPisoInternet.replace('.', '')) : this.tarifaPiso1 = null;
          this.allServices[nServiceSeleccion].tarifaSegundoPisoInternet ? this.tarifaPiso2 = parseInt(this.allServices[nServiceSeleccion].tarifaSegundoPisoInternet.replace('.', '')) : this.tarifaPiso2 = null;


          this.nowService = this.allServices[nServiceSeleccion];

          setTimeout(() => {
            this.content.scrollToPoint(0, this.divServicio['_results'][nServiceSeleccion].nativeElement.offsetTop, 100);
          });

          this.loadingBus = false;

        });

      }, 1000);



    } else {
      this.allServices[this.serviceSelectedNumber]['checked'] = !this.allServices[this.serviceSelectedNumber]['checked'];
      this.loadingBus = false;
    }

  }


  presionadoAsiento(piso: string, y: number, x: number) {
    if (this.bus[piso][y][x]['estado'] === 'libre' && this.comprasDetalles.length > 0) {
      this.mys.alertShow('¡Verifique!', 'alert', 'Se debe seleccionar solo un asiento para confirmarlo.<br> Al estar seguro del asiento seleccionado, presione continuar..');

    }
    else {


      this.comprasByService ? null : this.comprasByService = [];

      if (this.compras.length >= 4 && this.way === 'go' && this.bus[piso][y][x]['estado'] === 'libre') {
        this.allServices.forEach(element => {
          element['checked'] = false;
        });
        this.mys.alertShow('¡Verifique!', 'alert', 'Máximo número de asientos permitidos de ida son 4');
      } else if (this.compras.length >= 4 && this.way === 'back' && this.bus[piso][y][x]['estado'] === 'libre') {
        this.allServices.forEach(element => {
          element['checked'] = false;
        });
        this.mys.alertShow('¡Verifique!', 'alert', 'Máximo número de asientos permitidos de Regreso son 4');
      } else {

        let asiento = {
          'servicio': this.serviceSelected.idServicio,
          'fecha': this.serviceSelected.fechaSalida,
          'origen': this.serviceSelected.idTerminalOrigen,
          'destino': this.serviceSelected.idTerminalDestino,
          'asiento': this.bus[piso][y][x].asiento,
          'integrador': this.serviceSelected.integrador
        };


        if (this.bus[piso][y][x]['estado'] === 'libre') {

          this.loadingSeat += 1;

          this.integradorService.validarAsiento(asiento).subscribe(disponible => {
            this.loadingSeat += 1;
            if (disponible == 0) {

              ////////////////////////////////////////////////////////////////////////////////////
              ////////////////////////////////////////////////////////////////////////////////////
              ////////////////////////////////////////////////////////////////////////////////////
              this.integradorService.tomarAsiento(asiento).subscribe(resp => {
                this.loadingSeat -= 2;
                if (resp === 0) {
                  this.mys.alertShow('¡Verifique!', 'alert', 'Error al tomar asiento.');
                } else {
                  this.tomarAsiento(piso, y, x);
                }
              });
              ////////////////////////////////////////////////////////////////////////////////////
              ////////////////////////////////////////////////////////////////////////////////////
              ////////////////////////////////////////////////////////////////////////////////////


            } else {
              this.loadingSeat -= 2;
              this.mys.alertShow('¡Verifique!', 'alert', 'Asiento no disponible, está siendo reservado por otro cliente.');
              this.bus[piso][y][x]['estado'] = 'ocupado';
            }
          });

        } else if (this.bus[piso][y][x]['estado'] === 'seleccionado') {
          this.loadingSeat += 1;

          this.integradorService.liberarAsiento(asiento).subscribe(resp => {
            this.loadingSeat -= 1;
            if (resp == 0) {
              this.mys.alertShow('¡Verifique!', 'alert', 'Error al liberar asiento.');
            } else {
              this.liberarAsiento(piso, y, x, asiento);
            }
          });

        }
        // guardo en this.allServices
        this.allServices[this.serviceSelectedNumber].my_Bus = this.bus;
        this.allServices[this.serviceSelectedNumber].my_comprasByService = this.comprasByService;
        console.log('this.comprasDetallesPresionadoD', this.comprasDetalles);

      } // fin de numeros asientos permitidos

    }
  } // fin presionado



  liberarAsiento(piso, y, x, asiento) {
    console.log('LIBERAR ASIENTOOOOOO', piso, y, x, asiento);

    // caso asiento ya seleccionado
    this.bus[piso][y][x]['estado'] = 'libre';


    let tarifa;
    let texto = this.way + '_' + this.serviceSelected.idServicio + '_' + this.bus[piso][y][x]['asiento'];
    let index3 = this.comprasByService.indexOf(texto);
    if (index3 !== -1) { this.comprasByService.splice(index3, 1); }

    // elimino el asiento de this.comprasDetalles
    if (this.comprasDetalles.length > 0) {
      this.comprasDetalles = this.comprasDetalles.filter(x => !(x.idServicio === asiento.servicio && x.asiento === asiento.asiento))
    }

    // variables totales
    let index = this.compras.indexOf(texto);

    if (index !== -1) {
      this.compras.splice(index, 1);
      this.comprasDetalles.splice(index, 1);
      this.comprasDetallesPosicion.splice(index, 1);
    }

    else {

      let index = this.comprasDetallesPosicion.indexOf(texto);
      if (index !== -1) {
        this.comprasDetallesPosicion.splice(index, 1);
        this.comprasDetalles.splice(index, 1);
      }


    }

    // variables por servicio
    let index2 = this.comprasByService.indexOf(texto);
    if (index2 !== -1) { this.comprasByService.splice(index2, 1); this.comprasByServiceData.splice(index2, 1); }



    // // calculo la tarifa total
    let total_general = 0;
    this.comprasDetalles.forEach(element => {
      total_general = total_general + element.valor;
    });
    this.tarifaTotal = total_general;

  }


  tomarAsiento(piso, y, x, promocionTarifaTotal?) {
    console.log('this.comprasDetalles Start Tomar Asiento', this.comprasDetalles);


    // cambio de estado, caso asiento No seleccionado
    this.bus[piso][y][x]['estado'] = 'seleccionado';

    // verifico si tiene promoci{on pongo la tarifa recibida, sino, pongo las normales}
    let tarifa;
    if (promocionTarifaTotal) {
      tarifa = promocionTarifaTotal;
    } else if (piso === '1') {
      tarifa = this.tarifaPiso1;
    } else {
      tarifa = this.tarifaPiso2;
    }


    let resumen = {
      nService: this.serviceSelectedNumber,
      idServicio: this.serviceSelected.idServicio,
      asiento: this.bus[piso][y][x]['asiento'],
      piso: parseInt(piso),
      valor: parseInt(tarifa),
      fila: y,
      columna: x,
      way: this.way,
      service: this.serviceSelected,
      bus: this.bus,
      promocion: promocionTarifaTotal ? true : false,
      piso1: this.bus['1'] || null,
      piso2: this.bus['2'] || null,
    };

    this.comprasDetalles.push(resumen);

    // // calculo la tarifa total
    let total_general = 0;
    this.comprasDetalles.forEach(element => {
      total_general = total_general + element.valor;
    });
    this.tarifaTotal = total_general;

    console.log('this.comprasDetallesDToma', this.comprasDetalles);

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
    return bus;
  }

  muestraPiso(clasePiso){
    let respuesta = false;
    if(clasePiso != undefined){
      this.claseFiltro.forEach(clase => {
        if(clasePiso.substring(0,3) === clase.substring(0,3) ){
          respuesta = true;
        }
      })
    }
    return respuesta;
  }

  continuar() {
    if (this.comprasDetalles.length > 0) {

      this.mys.confirmSelected = this.comprasDetalles[0];
      this.mys.confirmSelected['init'] = this.confirmFromticketConfirmation;

      // para que no elimine el asiento al salir de la pag ionviwillLEAVE
      this.comprasDetalles = [];
    } else {
      this.mys.confirmSelected = null;
    }

    console.log(this.mys.confirm);
    console.log(this.mys.confirmSelected);

    this.router.navigateByUrl('/ticket-confirmation');

  }

  prueba() {
  }

  atras() {
    console.log('this.comprasDetallesal presionar atras', this.comprasDetalles);
    this.mys.ticket.comprasDetalles = this.comprasDetalles;
    this.mys.ticket.comprasDetallesPosicion = this.comprasDetallesPosicion;
    console.log('this.mys.comprasDetalles al presionar atras', this.mys.ticket);
    if (this.mys.way === 'back') {
      this.mys.way = 'go';
      this.serviceSelectedNumber = null;
      this.ionViewWillEnter();
    } else {
      this.serviceSelectedNumber = null;
      // this.mys.ticket = null;
      this.router.navigateByUrl('/buy-your-ticket');
    }
  }





  orderCambio() {
    switch (this.orderSelected) {

      case 'precioAsc':
        this.allServices = _.sortBy(this.allServices, (element) => {
          return element.tarifaPrimerPisoInternet;
        });
        break;

      case 'precioDsc':
        this.allServices = _.sortBy(this.allServices, 'tarifaPrimerPisoInternet').reverse();
        break;


      case 'origenAsc':
        this.allServices = _.sortBy(this.allServices, 'terminalSalida');
        break;
      case 'origenDsc':
        this.allServices = _.sortBy(this.allServices, 'terminalSalida').reverse();
        break;
      case 'destinoAsc':
        this.allServices = _.sortBy(this.allServices, 'terminaLlegada');
        break;
      case 'destinoDsc':
        this.allServices = _.sortBy(this.allServices, 'terminaLlegada').reverse();
        break;
      case 'horaAsc':
        this.allServices = _.sortBy(this.allServices, (item) => {
          return moment(`${item.horaSalida} ${item.fechaSalida}`, 'HH:mm DD/MM/YYYY').format();
        });
        break;
      case 'horaDsc':
        this.allServices = _.sortBy(this.allServices, (item) => {
          return moment(`${item.horaSalida} ${item.fechaSalida}`, 'HH:mm DD/MM/YYYY').format();
        });
        this.allServices = this.allServices.reverse();
        break;

      case 'empresaAsc':
        this.allServices = _.sortBy(this.allServices, 'empresa');
        break;
      case 'empresaDsc':
        this.allServices = _.sortBy(this.allServices, 'empresa').reverse();
        break;

      default:
        break;
    }
  }


  btnEtapa2Si() {
    this.promoEtapa2 = null;
    this.tomarAsiento(
      this.tomarAsientoPromocion.piso,
      this.tomarAsientoPromocion.y,
      this.tomarAsientoPromocion.x,
      this.tomarAsientoPromocion.promocionTarifaTotal
    )
  }

  btnEtapa2No() {
    this.promoEtapa2 = null;
    this.tomarAsiento(
      this.tomarAsientoPromocion.piso,
      this.tomarAsientoPromocion.y,
      this.tomarAsientoPromocion.x,
    )
  }


  str2number(str: string) {
    return parseInt(str.replace('.', ''));
  }



  async popMenu(event) {
    const popoverMenu = await this.popoverCtrl.create({
      component: PopMenuComponent,
      event,
      mode: 'ios',
      backdropDismiss: true,
      cssClass: 'popMenu'
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


  pruebaBorrar() {
    console.log('this.comprasDetalles', this.comprasDetalles);
  }

  ionViewWillLeave() {
    if (this.comprasDetalles.length > 0) {
      // liberar asiento
      this.mys.liberarAsientoDesdeHeader(this.comprasDetalles[0]);
      this.comprasDetalles = [];
    }
    this.allServices = [];
  }


  regresar() {
    this.router.navigateByUrl('/ticket-confirmation');
  }

}// fin Ticket


