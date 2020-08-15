import { Component, OnInit } from '@angular/core';
import { MyserviceService } from 'src/app/service/myservice.service';
import { IntegradorService } from 'src/app/service/integrador.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { PopoverController } from '@ionic/angular';
import { PopMenuComponent } from 'src/app/components/pop-menu/pop-menu.component';
import { PopCartComponent } from 'src/app/components/pop-cart/pop-cart.component';

@Component({
  selector: 'app-ticket-confirmation',
  templateUrl: './ticket-confirmation.page.html',
  styleUrls: ['./ticket-confirmation.page.scss'],
})
export class TicketConfirmationPage implements OnInit {

  compra;
  existeBoleto;
  loading = 0;

  usuario = null;

  valor = 0;

  ionActualDate;
  ionLimitTravelDate;
  ionTravelTime;
  statusTimeDate: boolean;


  minDate;
  maxDate;

  myData = {
    fecha: '',
    boleto: '',
    email: '',
    email2: '',
  };

  confirmed = null;
  exito = false;

  constructor(
    private mys: MyserviceService,
    private integrador: IntegradorService,
    private router: Router,
    private popoverCtrl: PopoverController
  ) {
    this.compra = 'ventanilla'; //  internet ó ventanilla
    this.existeBoleto = null;
  }

  ionViewWillEnter() {

    let currentDate = moment();
    this.minDate = currentDate.toISOString();
    this.maxDate = currentDate.add('1', 'years').toISOString();

    if (this.mys.confirmSelected) {
      console.log('Caso de Seguimiento de boleto por confirmar');
      this.confirmed = this.mys.confirmSelected;
      this.mys.confirmSelected = null;

      // preparo el dato a enviar a la api
      let dataToSend = {
        boleto: this.confirmed.init.form.boleto,
        clase: this.confirmed.init.filtros.clase,
        empresa: this.confirmed.init.filtros.empresa,
        asiento: this.confirmed.asiento,
        idServicio: this.confirmed.idServicio,

        fechaServicio: moment(
          this.confirmed.service.fechaServicio,
          'DD/MM/YYYY',
        ).format('YYYYMMDD'),

        fechaSalida: moment(
          `${this.confirmed.service.fechaSalida}-${this.confirmed.service.horaSalida}`,
          'DD/MM/YYYY-HH:mm',
        ).format('YYYYMMDDHHmm'),

        idOrigen: this.confirmed.service.idTerminalOrigen,
        idDestino: this.confirmed.service.idTerminalDestino,
        piso: this.confirmed.piso,
        email: this.confirmed.init.form.email
      }

      this.loading++;
      this.integrador.confirmarBoleto(dataToSend).subscribe((resp: any) => {
        this.loading--;
        console.log('resp de api ConfirmarBoleto', resp);
        this.confirmed['pdf'] = resp;
        console.log('this.confirmed', this.confirmed);

        if (resp.resultado.exito) {
          this.exito = true;
        } else {
          this.exito = false;
        }

      });


    } else {
      console.log('Ingresando a ticket-confirm SIN asiento seleccionado');
      this.confirmed = null;
    }
  }

  ngOnInit() { }

  consultar() {

    this.existeBoleto = null;

    if (this.myData.boleto) {
      this.loading++;
      this.integrador
        .canjeValidar({ boleto: this.myData.boleto + '' })
        .subscribe((validado: any) => {
          this.loading--;
          // console.log('validado', validado);

          if (validado.exito) {
            this.loading++;
            this.integrador
              .canjeBuscarInfoBoleto({ boleto: this.myData.boleto + '' })
              .subscribe((infoBoleto: any) => {
                this.loading--;

                let estado = infoBoleto.estadoActualDescripcion;
                console.log('infoBoleto', infoBoleto);

                if (estado === 'IDA' || estado === 'ENTREGADO') {
                  /////////////////////////////////////
                  // let actual = moment.utc()
                  let embarcacionFecha = `${infoBoleto.fechaEmbarcacion} ${infoBoleto.horaEmbarcacion}`;

                  let today = moment.utc().format('DD/MM/YYYY'); // para quitar las horas y munutos..

                  // fecha embarque
                  let filtroEmbarque = moment
                    .utc(embarcacionFecha, 'DD/MM/YYYY HH:mm')
                    .format('DD/MM/YYYY');
                  let unixEmbarque = moment
                    .utc(filtroEmbarque, 'DD/MM/YYYY')
                    .unix();

                  // referencia a hoy menos 3 dias
                  let unixTope = moment
                    .utc(today, 'DD/MM/YYYY')
                    .subtract(3, 'days')
                    .unix();

                  if (unixEmbarque > unixTope) {
                    /////// final
                    this.existeBoleto = infoBoleto;
                    this.valor = parseInt(infoBoleto.valor);
                    this.compra =
                      infoBoleto.tipoCompra === 'INT'
                        ? 'internet'
                        : 'ventanilla';
                  } else {
                    this.mys.alertShow(
                      'Error!!',
                      'alert',
                      'El boleto, no puede ser cambiado, superó el límite de fecha..'
                    );
                  }
                } else {
                  this.mys.alertShow(
                    'Error!!',
                    'alert',
                    validado.mensaje ||
                    'El boleto no es de ida o no se ha entregado..'
                  );
                }
              });
          } else {
            this.mys.alertShow(
              'Error!!',
              'alert',
              'Este Boleto No puede ser cambiado..'
            );
          }
        });
    } else {
      this.mys.alertShow(
        'Error!!',
        'alert',
        'Ingrese in boleto válido para consultar..'
      );
    }
  }

  validar(forma) {
    if (forma.controls.nombre.errors) {
      this.mys.alertShow('Verifique!! ', 'alert', 'Introduzca un nombre válido');
    } else if (forma.controls.email.errors) {
      this.mys.alertShow('Verifique!! ', 'alert', 'Introduzca un email válido');
    } else if (forma.controls.descripcion.errors) {
      this.mys.alertShow('Verifique!! ', 'alert', 'Introduzca una ciudad válida para continuar.');
    } else {
      console.log('this.myData', this.myData);
    }
  } // fin validar


  async popMenu(event) {
    const popoverMenu = await this.popoverCtrl.create({
      component: PopMenuComponent,
      event,
      mode: 'ios',
      backdropDismiss: true,
      cssClass: 'popMenu',
    });
    await popoverMenu.present();

    // recibo la variable desde el popover y la guardo en data
    const { data } = await popoverMenu.onWillDismiss();
    if (data && data.destino) {
      if (data.destino === '/login') {
        this.mys.checkIfExistUsuario().subscribe((exist) => {
          exist
            ? this.router.navigateByUrl('/user-panel')
            : this.router.navigateByUrl('/login');
        });
      } else {
        this.router.navigateByUrl(data.destino);
      }
    }
  }

  async popCart(event) {
    const popoverCart = await this.popoverCtrl.create({
      component: PopCartComponent,
      event,
      mode: 'ios',
      backdropDismiss: true,
      cssClass: 'popCart',
    });
    await popoverCart.present();
  }

  pruebaBorrar() {
    this.mys.alertShow(
      'En desarrollo..',
      'timer',
      'En desarrollo..',
    );
  }



  confirmarOtro() {
    this.confirmed = null;
    this.mys.confirm = null;
    this.mys.confirmSelected = null;
    this.exito = false;
  }

  consultarBoleto() {

    if (!moment(this.myData.fecha).isValid()) {
      console.log('fecha válida');
      this.mys.alertShow(
        'Notificación',
        'alert',
        'Debe ingresar un fecha válida.<br>Intente nuevamente..'
      );
    } else if (this.myData.boleto.length < 5 || this.myData.boleto.length > 15) {
      this.mys.alertShow(
        'Notificación',
        'alert',
        'Debe ingresar un Boleto válido.<br>Intente nuevamente..'
      );

    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.myData.email)) {
      this.mys.alertShow(
        'Notificación',
        'alert',
        'Debe ingresar un email válido.<br>Intente nuevamente..'
      );
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.myData.email2)) {
      this.mys.alertShow(
        'Notificación',
        'alert',
        'Debe re-ingresar un email válido.<br>Intente nuevamente..'
      );
    } else if (this.myData.email2 !== this.myData.email) {
      this.mys.alertShow(
        'Notificación',
        'alert',
        'Los correos no coinciden.<br>Intente nuevamente..'
      );
    } else {
      console.log('Validado Formulario');

      this.loading++
      this.integrador.confirmarBuscarBoleto({ boleto: this.myData.boleto }).subscribe((resp: any) => {
        this.loading--
        console.log('resp', resp);

        if (resp.resultado.exito) {
          // caso que el boleto si sea válido

          let paraConfirmarBoleto = {
            form: this.myData,
            obtenerServicio: {
              destino: resp.ciudadDestino,
              fecha: moment(this.myData.fecha).format('YYYYMMDD'),
              hora: '0000',
              idSistema: 1,
              origen: resp.ciudadOrigen,
            },
            filtros: {
              // clase: 'SAL09',
              clase: resp.clase,
              // clase: 'EJE40',
              empresa: resp.empresa,
            }
          }

          console.log('paraConfirmarBoleto desdeticketConfirmation', paraConfirmarBoleto);

          this.mys.confirm = paraConfirmarBoleto;
          this.mys.confirmSelected = null;
          this.router.navigateByUrl('/confirm-seat');



        } else {
          // Caso que el boleto no sea válido
          this.mys.alertShow(
            'Notificación',
            'alert',
            resp.resultado.mensaje + '<br>Intente nuevamente..'
          );
        }
      })
    }

  }

  downloadPDF() {
    const linkSource = 'data:application/pdf;base64,' + this.confirmed.pdf.archivo.archivo;
    const downloadLink = document.createElement("a");
    const fileName = this.confirmed.pdf.archivo.nombre;
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }

}
