import { Injectable } from '@angular/core';
import { AlertController, PopoverController } from '@ionic/angular';

import * as _ from 'underscore';
import * as moment from 'moment';
import { PopMenuComponent } from '../components/pop-menu/pop-menu.component';

import { Router } from '@angular/router';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Platform } from '@ionic/angular';
import { Observable, Subscriber, Subject } from 'rxjs';
import { IntegradorService } from './integrador.service';


@Injectable({
  providedIn: 'root'
})
export class MyserviceService {

  way = '';       // para saber si el servicio y asientos es de ida o regreso  ('go' 'back')
  idioma = 'es';
  ticket;
  goTicket;
  BackTicket;
  // regresandoAticket = false;
  total = 0;
  temporalComprasCarrito;
  comprarMas = false;

  public carritoAgregar = new Subject<any>();  // PARA SUBSCIBIRSE
  public carritoEliminar = new Subject<any>();  // PARA SUBSCIBIRSE

  // variables par ainicio de pàginas
  initCouponResult;
  initCouponBuy;

  /////////////////////////////////////////////////
  // caso para acceder a confirmar un boleto que esta en promoción
  confirm = null;
  // confirm = {
  //   obtenerServicio: {
  //     destino: '02103424',
  //     fecha: '20200810',
  //     hora: '0000',
  //     idSistema: 1,
  //     origen: '02101007',
  //   },
  //   filtros: {
  //     // clase: 'SAL09',
  //     clase: 'SEM42',
  //     // clase: 'EJE40',
  //     empresa: '01',
  //   }
  // };

  confirmSelected = null;




  // pageMyDataAsRegister = true

  constructor(
    public alertController: AlertController,
    public popoverCtrl: PopoverController,
    public router: Router,
    private nativeStorage: NativeStorage,
    public platform: Platform,
    private integradorService: IntegradorService
  ) { }

  // trabaja en conjunto con variable carrito Dinamico
  actualizarCarritoAgregar(val) {
    this.carritoAgregar.next(val);
  }
  actualizarCarritoEliminar(val) {
    this.carritoEliminar.next(val);
  }



  /**
   * Obtiene todos los post que existen en la api
   */
  checkIfExistUsuario(): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {

      let plt = this.platform.platforms();



      if (plt.includes('mobileweb') || plt.includes('desktop')) {
        // //console.log('tiene mobilweb');

        if (localStorage.getItem('usuario')) {
          observer.next(true);
          observer.complete();
        } else {
          observer.next(false);
          observer.complete();
        }


      } else {
        //console.log('No tiene mobilweb');

        this.nativeStorage.getItem('usuario')
          .then(
            data => {
              if (data) {
                observer.next(true);
                observer.complete();
              } else {
                observer.next(false);
                observer.complete();
              }
            },
            error => {
              observer.next(false);
              observer.complete();
              console.error('error al leer el LocalSorage:::', error);
            }
          );
      }



    });
  } // 


  /**
 * Obtiene todos los post que existen en la api
 */
  getUser(): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {

      let plt = this.platform.platforms();
      if (plt.includes('mobileweb') || plt.includes('desktop')) {
        //console.log('tiene mobilweb');
        let usuariox = localStorage.getItem('usuario');

        if (usuariox) {
          observer.next(JSON.parse(usuariox));
          observer.complete();
        } else {
          observer.next();
          observer.complete();
        }


      } else {
        // //console.log('No tiene mobilweb');

        this.nativeStorage.getItem('usuario')
          .then(
            data => {
              if (data) {
                observer.next(data);
                observer.complete();
              } else {
                observer.next(data);
                observer.complete();
              }
            },
            error => { console.error('error al leer el LocalSorage:', error); }
          );
      }



    });
  } // 
  /**
 * Obtiene todos los post que existen en la api
 */

  closeSessionUser(): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {

      let plt = this.platform.platforms();
      //console.log('plt', plt);
      if (plt.includes('mobileweb') || plt.includes('desktop')) {

        localStorage.removeItem('usuario');

        //console.log('tiene mobilweb');
        let usuariox = localStorage.getItem('usuario');
        //console.log('tiene mobilweb2');

        if (usuariox) {
          //console.log('tiene mobilweb3');
          observer.next(false);
          observer.complete();
        } else {
          //console.log('tiene mobilweb4');
          observer.next(true);
          observer.complete();
        }


      } else {
        // //console.log('No tiene mobilweb');

        this.nativeStorage.remove('usuario')
          .then(
            data => {
              if (data) {
                observer.next(true);
                observer.complete();
              } else {
                observer.next(true);
                observer.complete();
              }
            },
            error => { console.error('error al leer el LocalSorage:', error); }
          );
      }

    });
  } // 



  /**
   * Obtiene todos los post que existen en la api
   */
  saveUsuario(datosUsuario): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {

      let plt = this.platform.platforms();
      if (plt.includes('mobileweb') || plt.includes('desktop')) {
        // //console.log('tiene mobilweb');

        localStorage.setItem('usuario', JSON.stringify(datosUsuario));

        if (localStorage.getItem('usuario')) {
          observer.next(true);
          observer.complete();
        } else {
          observer.next(false);
          observer.complete();
        }


      } else {
        // //console.log('No tiene mobilweb');


        this.nativeStorage.setItem('usuario', datosUsuario)
          .then(
            data => {
              // Verificando que si se guard{o}
              //console.log('Stored first item!', data)

              this.nativeStorage.getItem('usuario')
                .then(
                  data => {
                    if (data) {
                      observer.next(true);
                      observer.complete();
                    } else {
                      observer.next(false);
                      observer.complete();
                    }
                  },
                  error => { console.error('error al leer el LocalSorage:', error); }
                );

            },
            error => console.error('Error storing item', error)
          );



      }



    });
  } // 






  async alertShow(titulo: string, icon: string, mensajeHTML: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: `<ion-icon name="${icon}"></ion-icon><br>${mensajeHTML}`,
      mode: 'ios',
      buttons: [
        {
          text: 'Ok',
          role: 'ok',
          handler: () => {
          }
        }
      ]
    });
    await alert.present();
  }

  async alertShowItinerario(titulo: string, mensajeHTML: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: `<br>${mensajeHTML}`,
      mode: 'ios',
      cssClass: 'alertItinerario',
      buttons: [
        {
          text: 'Ok',
          role: 'ok',
          handler: () => {
          }
        }
      ]
    });
    await alert.present();
  }


  /////////////////////////////////////////////////////////////
  // fechas
  dateToString(date: any, idioma: string): any {
    let diaL = moment(date).format('e');
    let diaN = moment(date).format('D');
    let mesL = moment(date).format('MM');
    let mesN = moment(date).format('M');
    let anoN = moment(date).format('YYYY');
    let horaH = moment(date).format('HH:mm');
    let horaM = moment(date).format('LT');


    switch (diaL) {
      case '0':
        if (idioma === 'es') { diaL = 'Domingo'; }
        if (idioma === 'en') { diaL = 'Sunday'; }
        if (idioma === 'br') { diaL = 'Domingo'; }
        break;
      case '1':
        if (idioma === 'es') { diaL = 'Lunes'; }
        if (idioma === 'en') { diaL = 'Monday'; }
        if (idioma === 'br') { diaL = 'Segunda-feira'; }
        break;
      case '2':
        if (idioma === 'es') { diaL = 'Martes'; }
        if (idioma === 'en') { diaL = 'Tuesday'; }
        if (idioma === 'br') { diaL = 'Terça-feira'; }
        break;
      case '3':
        if (idioma === 'es') { diaL = 'Miercoles'; }
        if (idioma === 'en') { diaL = 'Wednesday'; }
        if (idioma === 'br') { diaL = 'Quarta-feira'; }
        break;
      case '4':
        if (idioma === 'es') { diaL = 'Jueves'; }
        if (idioma === 'en') { diaL = 'Thursday'; }
        if (idioma === 'br') { diaL = 'Quinta-feira'; }
        break;
      case '5':
        if (idioma === 'es') { diaL = 'Viernes'; }
        if (idioma === 'en') { diaL = 'Friday'; }
        if (idioma === 'br') { diaL = 'Quinta-feira'; }
        break;
      case '6':
        if (idioma === 'es') { diaL = 'Sábado'; }
        if (idioma === 'en') { diaL = 'Saturday'; }
        if (idioma === 'br') { diaL = 'Sabado'; }
        break;

      default:
        break;
    }

    switch (mesL) {
      case '01':
        if (idioma === 'es') { mesL = 'Enero'; }
        if (idioma === 'en') { mesL = 'Monday'; }
        if (idioma === 'br') { mesL = 'Segunda-feira'; }
        break;
      case '02':
        if (idioma === 'es') { mesL = 'Febrero'; }
        if (idioma === 'en') { mesL = 'Tuesday'; }
        if (idioma === 'br') { mesL = 'Terça-feira'; }
        break;
      case '03':
        if (idioma === 'es') { mesL = 'Marzo'; }
        if (idioma === 'en') { mesL = 'Wednesday'; }
        if (idioma === 'br') { mesL = 'Quarta-feira'; }
        break;
      case '04':
        if (idioma === 'es') { mesL = 'Abril'; }
        if (idioma === 'en') { mesL = 'Thursday'; }
        if (idioma === 'br') { mesL = 'Quinta-feira'; }
        break;
      case '05':
        if (idioma === 'es') { mesL = 'Mayo'; }
        if (idioma === 'en') { mesL = 'Friday'; }
        if (idioma === 'br') { mesL = 'Quinta-feira'; }
        break;
      case '06':
        if (idioma === 'es') { mesL = 'Junio'; }
        if (idioma === 'en') { mesL = 'Saturday'; }
        if (idioma === 'br') { mesL = 'Sabado'; }
        break;
      case '07':
        if (idioma === 'es') { mesL = 'Julio'; }
        if (idioma === 'en') { mesL = 'Sunday'; }
        if (idioma === 'br') { mesL = 'Domingo'; }
        break;
      case '08':
        if (idioma === 'es') { mesL = 'Agosto'; }
        if (idioma === 'en') { mesL = 'Sunday'; }
        if (idioma === 'br') { mesL = 'Domingo'; }
        break;
      case '09':
        if (idioma === 'es') { mesL = 'Septiembre'; }
        if (idioma === 'en') { mesL = 'Sunday'; }
        if (idioma === 'br') { mesL = 'Domingo'; }
        break;
      case '10':
        if (idioma === 'es') { mesL = 'Octubre'; }
        if (idioma === 'en') { mesL = 'Sunday'; }
        if (idioma === 'br') { mesL = 'Domingo'; }
        break;
      case '11':
        if (idioma === 'es') { mesL = 'Noviembre'; }
        if (idioma === 'en') { mesL = 'Sunday'; }
        if (idioma === 'br') { mesL = 'Domingo'; }
        break;
      case '12':
        if (idioma === 'es') { mesL = 'Diciembre'; }
        if (idioma === 'en') { mesL = 'Sunday'; }
        if (idioma === 'br') { mesL = 'Domingo'; }
        break;
      default:
        break;
    }

    return { diaL, mesL, diaN, mesN, anoN, horaH, horaM };
  }



  // liberar asiento desde el header ("elimimar" es el objeto del asiento de compraDetalles del carrito que se elimina)
  liberarAsientoDesdeHeader(eliminar) {
    // preparo el asiento a eliminar
    let asiento = {
      'asiento': eliminar.asiento,
      'servicio': eliminar.idServicio,
      'fecha': eliminar.service.fechaSalida,
      'origen': eliminar.service.idTerminalOrigen,
      'destino': eliminar.service.idTerminalDestino,
      'integrador': eliminar.service.integrador
    };

    this.integradorService.liberarAsiento(asiento).subscribe(resp => {
      if (resp == 0) {
        // this.mys.alertShow('¡Verifique!', 'alert', 'Error al liberar asiento.');
        console.warn('Error al liberar asiento.');
      } else {
        console.log('Liberado Asiento Exitosamente:', asiento);
      }
    });

  }


  showItinerario(idServicio) {
    console.log('idServicioDsdMyS', idServicio);
    this.integradorService.buscarItinerario({ idServicio }).subscribe(resp => {
      console.log('resp', resp);
      if (resp && resp.length > 0) {

        let tabla = '<table><tr><th>Ciudad</th><th>Terminal</th><th>Hora Salida</th></tr>';
        resp.forEach(ruta => {
          let HoraSalida = moment(ruta.horaSalida, 'HHmm').format('hh:mm a');
          tabla = tabla + `<tr><td>${ruta.ciudadSalida.toLowerCase()}</td><td>${ruta.terminalSalida.toLowerCase()}</td><td>${HoraSalida}</td></tr>`;
        });
        tabla = tabla + '</table>';
        this.alertShowItinerario('Itinerario', tabla);

      }
    });
  }

}
