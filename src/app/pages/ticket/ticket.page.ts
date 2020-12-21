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
  loadingSeat = 0;

  allServices = [];
  allServicesResp = [];
  serviceSelectedNumber;
  serviceSelected;

  piso1 = true;          // true=piso1  ;  false=piso2
  tarifaPiso1: number;
  tarifaPiso2: number;
  tarifaTotal: number = 0;

  nItemsCart = 7;
  // todas ida o  todas vueltaf
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
  // tomarAsientoPromocion = {
  //   piso: '',
  //   y: 0,
  //   x: 0,
  //   promocionTarifaTotal: 0
  // }


  promoEtapa2;
  // promoEtapa2 = {
  //   fechaInicio: '11/05/2020',
  //   fechaTermino: '31/12/2020',
  //   titulo: 'PROMOCION',
  //   colorTitulo: '#c3c3c3',
  //   sizeTitulo: 24,
  //   fondo: null,
  //   contenido: 'AGREGA TU BOLETO DE REGRESO POR ${1}, QUIERES AGREGARLO?',
  //   colorContenido: '#c3c3c3',
  //   sizeContenido: 14,
  //   tarifas: '13.500',
  //   colorTarifa: '#ffffff',
  //   sizeTarifa: 14,
  //   fondoTarifa: '#FF621D',
  //   urlImagen: 'http://pullman.cl/imagenes/Caluga_etapa_2.jpg',
  //   tipoServicio: 'SALON CAMA'
  // }




  orderSelected = '';
  orderShowActive = false;
  orderWindowsDetail: any = { header: 'Ordenar servicios por:' };

  filterSelected = '';
  filterShowActive = false;
  filterWindowsDetail: any = { header: 'Filtrar servicios por:' };




  popupPetFriendly = false;
  petSeat = {
    piso: null,
    y:null,
    x:null
  }
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private mys: MyserviceService,
    private integradorService: IntegradorService,
    private popoverCtrl: PopoverController,

  ) {
    this.mys.carritoEliminar.subscribe(eliminar => {
      console.log('Eliminado desde dentro de tickets', eliminar);

      console.log('comprasDetalles Antes de Resultado', this.comprasDetalles);
      this.comprasDetalles = this.comprasDetalles.filter(x => !(x.idServicio === eliminar.idServicio && x.asiento === eliminar.asiento));
      console.log('nowService', this.nowService);
      if (this.nowService && this.nowService.idServicio === eliminar.idServicio) {
        console.log('es el servicio abierto en este momento');
        if(this.bus[eliminar.piso][eliminar.fila][eliminar.columna]['tipo'] === 'pet')
          this.bus[eliminar.piso][eliminar.fila][eliminar.columna]['estado'] = 'pet-free';
        else{
          this.bus[eliminar.piso][eliminar.fila][eliminar.columna]['estado'] = 'libre';
        }
      } else {
        console.log('NO es el servicio abierto en este momento');
        let indexService = this.allServices.findIndex(x => x.idServicio === eliminar.idServicio);
        console.log('antes Bus', this.allServices[indexService]['my_Bus']);
        if(this.allServices[indexService]['my_Bus'][eliminar.piso][eliminar.fila][eliminar.columna]['tipo'] === 'pet')
          this.allServices[indexService]['my_Bus'][eliminar.piso][eliminar.fila][eliminar.columna]['estado'] = 'pet-free';
        else
          this.allServices[indexService]['my_Bus'][eliminar.piso][eliminar.fila][eliminar.columna]['estado'] = 'libre';
        console.log('Despues Bus', this.allServices[indexService]['my_Bus']);
      }

      // calculo la tarifa total
      let total_general = 0;
      this.comprasDetalles.forEach(element => {
        total_general = total_general + element.valor;
      });
      this.tarifaTotal = total_general;

      // siempre vá para eliminar en el server, es asincrono
      this.mys.liberarAsientoDesdeHeader(eliminar);

    });
  }

  ngOnInit() {
    if (this.promoEtapa2 && this.promoEtapa2.contenido) {
      this.promoEtapa2.contenido = this.promoEtapa2.contenido.replace('{1}', this.promoEtapa2.tarifas);
    }

  }

  ionViewWillEnter() {

    if (this.mys.ticket) {
      this.ticket = this.mys.ticket;
      this.way = this.mys.way;

      if (this.way === 'go') {

        if (this.mys.comprarMas) {
          this.compras = [];
          this.getServicesAndBus('go');
          this.mys.comprarMas = false;
        } else {
          this.compras = this.ticket.goCompras || [];
          this.allServices = this.ticket.goAllService || this.getServicesAndBus('go');
        }

        console.log('this.mys.ticket en GO', this.mys.ticket);

      } else {
        if (this.mys.comprarMas) {
          this.compras = [];
          this.getServicesAndBus('back');
          this.mys.comprarMas = false;
        } else {
          this.compras = this.ticket.backCompras || [];
          this.allServices = this.ticket.backAllService || this.getServicesAndBus('back');
        }
        console.log('this.mys.ticket en BACK', this.mys.ticket);
      }

      this.comprasDetalles = this.ticket.comprasDetalles || [];
      this.comprasDetallesPosicion = this.ticket.comprasDetallesPosicion || [];

      let total_general = 0;
      this.comprasDetalles.forEach(element => {
        total_general = total_general + element.valor;
      });
      this.tarifaTotal = total_general;

      console.log('this.comprasDetalles leave WillEnter', this.comprasDetalles);

    } else {
      this.getServicesAndBus('go');
      this.ticket = {
        origin: { nombre: 'ALTO HOSPICIO', codigo: '01101002', region: null },
        destiny: { nombre: 'CABRERO', codigo: '08303194', region: null },
        tripType: 'goBack',
        goDate: '2019-12-28T22:34:20.295-04:00',
        backDate: '2019-12-29T22:36:28.833-04:00'
      };
      this.way = 'go';

    }


    console.log('this.comprasDetallesIniciooo', this.comprasDetalles);
    this.goDate = moment(this.ticket.goDate).format('DD/MM/YYYY');
    this.backDate = moment(this.ticket.backDate).format('DD/MM/YYYY');
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
      this.allServicesResp = [...this.allServices]
      if(this.mys.ticket.petService){   
        this.filterSelected = 'pet'     
        this.allServices = this.allServices.filter(x => x.mascota === '1')      
      }

      this.loadingService = false;
      this.allServices.forEach(servicio => {


        this.comprasDetalles.forEach(compra => {
          if (servicio.idServicio === compra.idServicio) {
            servicio['my_comprasByService'] = compra['my_comprasByService'];
            // servicio['my_comprasByServiceData'] = compra['my_comprasByServiceData']
          }
        });

        if (servicio.promocion) {
          servicio.idaVueltaPisoUno ? servicio['aviablePromocionP1'] = true : servicio['aviablePromocionP1'] = false;
          servicio.idaVueltaPisoDos ? servicio['aviablePromocionP2'] = true : servicio['aviablePromocionP2'] = false;
        } else {
          servicio['aviablePromocionP1'] = false;
          servicio['aviablePromocionP2'] = false;
        }

      });


    });

  }




  myServiceSelection(nServiceSeleccion: number) {
    console.log("desplega sevicio", nServiceSeleccion);
    // setTimeout(() => {
    let estadoPrevio = this.allServices[nServiceSeleccion]['checked'];
    this.allServices.forEach(element => {
      element['checked'] = false;
    });
    this.allServices[nServiceSeleccion]['checked'] = estadoPrevio;
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
        'integrador': this.allServices[nServiceSeleccion].integrador,
        'clasePiso1':this.allServices[nServiceSeleccion].idClaseBusPisoUno
      };
      setTimeout(() => {
        this.integradorService.getPlanillaVertical(servicio).subscribe(myBusFromApi => {
          console.log('myBusFromApi', myBusFromApi);
          // agrego bus y sumo 20 a cada asiento de piso 2

          let estadoPrevio = this.allServices[nServiceSeleccion]['checked'];
          this.allServices.forEach(element => {
            element['checked'] = false;
          });
          this.allServices[nServiceSeleccion]['checked'] = estadoPrevio;

          // this.allServices[nServiceSeleccion]['my_Bus'] = this.sumar20piso2(myBusFromApi);
          this.allServices[nServiceSeleccion]['my_Bus'] = myBusFromApi;

          this.allServices[nServiceSeleccion].checked = true;
          this.comprasByService = this.allServices[nServiceSeleccion]['my_comprasByService'];
          this.serviceSelectedNumber = nServiceSeleccion;
          this.serviceSelected = this.allServices[nServiceSeleccion];
          this.bus = this.allServices[this.serviceSelectedNumber].my_Bus;
          // verificar si se ha comprado en este servicio
          let nowIdService = this.allServices[nServiceSeleccion]['idServicio'];
          let nowDateService = this.allServices[nServiceSeleccion]['fechaServicio'];
          this.comprasDetalles.forEach(element => {
            if (element.idServicio === nowIdService && element.service.fechaServicio === nowDateService) {
              this.bus = element.bus;
            }
          });
          // preparando tarifas
          this.allServices[nServiceSeleccion].tarifaPrimerPisoInternet ? this.tarifaPiso1 = parseInt(this.allServices[nServiceSeleccion].tarifaPrimerPisoInternet.replace('.', '')) : this.tarifaPiso1 = null;
          this.allServices[nServiceSeleccion].tarifaSegundoPisoInternet ? this.tarifaPiso2 = parseInt(this.allServices[nServiceSeleccion].tarifaSegundoPisoInternet.replace('.', '')) : this.tarifaPiso2 = null;
          this.tarifaPiso1 ? this.piso1 = true : this.piso1 = false;
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
  buscaCantidadAsientos(){
    let i = 0
    this.comprasDetalles.forEach(compra =>{
      if(compra.way === this.way){
        i++
      }
    })
    return i;
  }
  presionadoAsiento(piso: string, y: number, x: number) {
    console.log(this.bus[piso][y][x])
    if(this.bus[piso][y][x].tipo === 'asociado'){
      if(this.bus[piso][y][x].estado === 'libre'){
        if (this.buscaCantidadAsientos() < 3){
          this.petSeat.piso = piso;
          this.petSeat.y = y;
          this.petSeat.x = x;
          this.popupPetFriendly = true;
        }else{
          this.mys.alertShow('¡Verifique!', 'alert', 'No puede tomar este asiento.');
        }        
      }else{
        this.presionadoAsientoAccion(piso, y, x)
      }      
    }else{
      this.presionadoAsientoAccion(piso, y, x)
    }
  }

  presionadoAsientoAccion(piso: string, y: number, x: number) {
    console.log("piso : " + piso + ", y : " + y + ", x : " + x);
    if (this.bus[piso][y][x]['estado'] === 'libre' && this.buscaCantidadAsientos() > 3) {
      if(this.way === 'go') this.mys.alertShow('¡Verifique!', 'alert', 'Máximo número de asientos permitidos de ida son 4');
      if(this.way === 'back') this.mys.alertShow('¡Verifique!', 'alert', 'Máximo número de asientos permitidos de regreso son 4');      
    } else {
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
          this.takeSeat(asiento, piso, y, x);
          if(this.bus[piso][y][x].tipo === 'asociado'){
            let asientoMascota = {
              'servicio': this.serviceSelected.idServicio,
              'fecha': this.serviceSelected.fechaSalida,
              'origen': this.serviceSelected.idTerminalOrigen,
              'destino': this.serviceSelected.idTerminalDestino,
              'asiento': this.bus[piso][y][x].asientoAsociado,
              'integrador': this.serviceSelected.integrador
            };
            let z = 0;
            if(this.bus[piso][y][x-1].tipo === 'pet') z = x-1;
            if(this.bus[piso][y][x+1].tipo === 'pet') z = x+1;
            this.takeSeat(asientoMascota, piso, y, z);
          }
        } else if (this.bus[piso][y][x]['estado'] === 'seleccionado') {
          this.freeSeat(asiento, piso, y, x);
          if(this.bus[piso][y][x].tipo === 'asociado'){
            let asientoMascota = {
              'servicio': this.serviceSelected.idServicio,
              'fecha': this.serviceSelected.fechaSalida,
              'origen': this.serviceSelected.idTerminalOrigen,
              'destino': this.serviceSelected.idTerminalDestino,
              'asiento': this.bus[piso][y][x].asientoAsociado,              
              'integrador': this.serviceSelected.integrador
            };
            let z = 0;
            if(this.bus[piso][y][x-1].tipo === 'pet') z = x-1;
            if(this.bus[piso][y][x+1].tipo === 'pet') z = x+1;            
            this.freeSeat(asientoMascota, piso, y, z);
          }
        }
        // guardo en this.allServices
        this.allServices[this.serviceSelectedNumber].my_Bus = this.bus;        
        this.allServices[this.serviceSelectedNumber].my_comprasByService = this.comprasByService;
        console.log('this.comprasDetallesPresionadoD', this.comprasDetalles);
      } 
    }
  } 

  takeSeat(asiento, piso, y, x){
    this.loadingSeat += 1;
    this.integradorService.validarAsiento(asiento).subscribe(disponible => {
      this.loadingSeat += 1;
      if (disponible == 0) {
        this.integradorService.tomarAsiento(asiento).subscribe(resp => {
          this.loadingSeat -= 2;
          if (resp === 0) {
            this.mys.alertShow('¡Verifique!', 'alert', 'Error al tomar asiento.');
          } else {
            // verificando si el asiento tiene promociòn o no
            if (
              this.serviceSelected.promocion &&
              (
                (this.serviceSelected.idaVueltaPisoDos && !this.piso1)
                ||
                (this.serviceSelected.idaVueltaPisoUno && this.piso1)
              )
            ) {
              //////////////////////////////////  Asiento CON promoción  //////////////////////////////////////
              // variable para la api buscaCaluga
              let myData = {
                origen: this.mys.ticket.origin.codigo,
                destino: this.mys.ticket.destiny.codigo,
                fechaSalida: moment(this.mys.ticket.goDate).format("YYYYMMDD"),
                etapa: 2
              };
              console.log('myData', myData);
              this.integradorService.buscaCaluga(myData).subscribe(respuestaBuscaCaluga => {
                // definiendo variables de tarifas
                let tarifaTotalNumero;
                let tarifaNormalNumero;
                let tarifaDiferencia;
                if (this.piso1) {
                  tarifaTotalNumero = parseInt(this.serviceSelected.idaVueltaPisoUno.tarifaTotal.replace('.', ''));
                  tarifaNormalNumero = this.serviceSelected.tarifaPrimerPisoInternet.replace('.', '');
                } else {
                  tarifaTotalNumero = parseInt(this.serviceSelected.idaVueltaPisoDos.tarifaTotal.replace('.', ''));
                  tarifaNormalNumero = this.serviceSelected.tarifaSegundoPisoInternet.replace('.', '');
                }
                // calculando diferencia
                tarifaDiferencia = tarifaTotalNumero - tarifaNormalNumero;
                // Mostrando el mensaje para seleccionar si está de acuerdo o no al darle valor a promocionEtapa2
                this.promoEtapa2 = respuestaBuscaCaluga[0];
                // console.log('this.promoEtapa2', this.promoEtapa2);
                this.promoEtapa2['contenido'] = this.promoEtapa2['contenido'].replace('{1}', tarifaDiferencia.toLocaleString('de-DE'));
                console.log('this.promoEtapa2', this.promoEtapa2);

                // almaceno variables para cuanso el el modal presione SI , ya tener los datos necesarios almacenados
                this.tomarAsientoPromocion = { piso, y, x, promocionTarifaTotal: tarifaTotalNumero };
              });
            } else {              
              this.tomarAsiento(piso, y, x);
            }
          }
        });
      } else {
        this.loadingSeat -= 2;
        this.mys.alertShow('¡Verifique!', 'alert', 'Asiento no disponible, está siendo reservado por otro cliente.');        
        if(this.bus[piso][y][x].tipo === 'pet')
          this.bus[piso][y][x]['estado'] = 'pet-busy';
        else
          this.bus[piso][y][x]['estado'] = 'ocupado';
      }
    });
  }

  freeSeat(asiento, piso, y, x){
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

  liberarAsiento(piso, y, x, asiento) {
    console.log('LIBERAR ASIENTOOOOOO', piso, y, x, asiento);

    // caso asiento ya seleccionado
    if(this.bus[piso][y][x].tipo === 'pet')
      this.bus[piso][y][x]['estado'] = 'pet-free';
    else
      this.bus[piso][y][x]['estado'] = 'libre';


    let tarifa;
    let texto = this.way + '_' + this.serviceSelected.idServicio + '_' + this.bus[piso][y][x]['asiento'];
    let index3 = this.comprasByService.indexOf(texto);
    if (index3 !== -1) { this.comprasByService.splice(index3, 1); }

    // elimino el asiento de this.comprasDetalles
    if (this.comprasDetalles.length > 0) {
      this.comprasDetalles = this.comprasDetalles.filter(x => !(x.idServicio === asiento.servicio && x.asiento === asiento.asiento));
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
    if(this.bus[piso][y][x].tipo === 'pet')
    this.bus[piso][y][x]['estado'] = 'pet-taken';
      else
    this.bus[piso][y][x]['estado'] = 'seleccionado';

    // verifico si tiene promoción pongo la tarifa recibida, sino, pongo las normales}
    let tarifa;
    if (promocionTarifaTotal) {
      tarifa = promocionTarifaTotal;
    } else if (piso === '1') {
      tarifa = this.tarifaPiso1;
    } else {
      tarifa = this.tarifaPiso2;
    }

    let tarifaNormal;
    if (piso === '1') {
      tarifaNormal = this.serviceSelected.tarifaPrimerPiso;
    } else {
      tarifaNormal = this.serviceSelected.tarifaSegundoPiso;
    }

    console.log("Servicio", this.serviceSelected);
    console.log("tarifaNormal", tarifaNormal);
    let resumen = {
      nService: this.serviceSelectedNumber,
      idServicio: this.serviceSelected.idServicio,
      asiento: this.bus[piso][y][x]['asiento'],
      piso: parseInt(piso),
      valor: parseInt(tarifa),
      valorNormal: parseInt(tarifaNormal.replace(".", "")),
      fila: y,
      columna: x,
      way: this.way,
      service: this.serviceSelected,
      bus: this.bus,
      promocion: promocionTarifaTotal ? true : false,
      piso1: this.bus['1'] || null,
      piso2: this.bus['2'] || null,
      goDate: this.goDate,
      backDate: this.backDate,
      aviablePromocionP1: this.serviceSelected.aviablePromocionP1,
      aviablePromocionP2: this.serviceSelected.aviablePromocionP2,
      pasajero:{ 
        "validForm" : false ,
        "tipoDocumento" : "R",
        "documento": "",
        "comuna": "",
        "direccion": "",
        "email": "",
        "materno": "",
        "nacionalidad": "",
        "nombres": "",
        "paterno": "",
        "telefono": "",
        "telefonoEmergencia":"",
        "terms":false,
        "dialog":false 
      },
      tipo: this.bus[piso][y][x]['tipo'],
      asientoAsociado: this.bus[piso][y][x]['asientoAsociado'],
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


  continuar() {

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
    this.serviceSelectedNumber = null;

    // Guardo todos los cambios locales al service
    this.mys.ticket = this.ticket;
    this.mys.way = this.way;

    if (this.mys.way === 'go' && this.ticket.tripType === 'goBack') {
      this.mys.way = 'back';
      this.ticket = null;
      this.ionViewWillEnter();

    } else {
      this.router.navigateByUrl('/purchase-detail');
    }

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
    this.allServices = [...this.allServicesResp]
    if(this.filterSelected === 'pet'){
      this.allServicesResp = [...this.allServices]
      this.allServices = this.allServices.filter(x => x.mascota === '1')  
      return
    }
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
    );
  }

  btnEtapa2No() {
    this.promoEtapa2 = null;
    this.tomarAsiento(
      this.tomarAsientoPromocion.piso,
      this.tomarAsientoPromocion.y,
      this.tomarAsientoPromocion.x,
    );
  }


  str2number(str: string) {
    return parseInt(str.replace('.', ''));
  }



  async popMenu(event) {
    //console.log('event', event);
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

  getItinerario(idServicio) {
    console.log('idServicio', idServicio);
    this.loadingBus = true;
    setTimeout(() => {
      this.loadingBus = false;
    }, 1000);
    this.mys.showItinerario(idServicio);
  }

  btnSiServicePet() {
    this.popupPetFriendly = false;
    this.presionadoAsientoAccion(this.petSeat.piso, this.petSeat.y, this.petSeat.x)
    this.petSeat.piso = null;
    this.petSeat.y = null;
    this.petSeat.x = null;    
  }

  btnNoServicePet() {
    this.popupPetFriendly = false;
    this.petSeat.piso = null;
    this.petSeat.y = null;
    this.petSeat.x = null;  
  }

}// fin Ticket


