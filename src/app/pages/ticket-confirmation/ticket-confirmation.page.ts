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


  respBuscarBoleto = {
    resultado: {
      exito: true,
      mensaje: 'Boleto puede ser confirmado',
      id: null
    },
    ciudadOrigen: '04101037',
    ciudadDestino: '13101420',
    clase: 'SAL09',
    empresa: '01',
    boleto: 'INT00074911'
  }

  confirmed = null;
  exito = false;
  // confirmed = 1;

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
      console.log('Ingresando a ticket-confirm CON asiento seleccionado');
      console.log('Asiento seleccionado :this.confirmed ', this.confirmed);
      console.log('fser', this.confirmed.service.fechaServicio);
      console.log('fsal', `${this.confirmed.service.fechaSalida}-${this.confirmed.service.horaSalida}`);

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
        // fechaServicio: "20200720",

        fechaSalida: moment(
          `${this.confirmed.service.fechaSalida}-${this.confirmed.service.horaSalida}`,
          'DD/MM/YYYY-HH:mm',
        ).format('YYYYMMDDHHmm'),
        // fechaSalida: "202007201730",

        idOrigen: this.confirmed.init.obtenerServicio.origen,
        idDestino: this.confirmed.init.obtenerServicio.destino,
        piso: this.confirmed.piso,
        email: this.confirmed.init.form.email
      }

      console.log('*****Paso Final envío a ConfirmarBoleto', dataToSend);

      this.loading++;
      this.integrador.confirmarBoleto(dataToSend).subscribe((resp: any) => {
        this.loading--;
        console.log('resp de api definitiva ConfirmarBoleto', resp);



      })






    } else {
      console.log('Ingresando a ticket-confirm SIN asiento seleccionado');
      this.confirmed = null;
    }
  }



  ngOnInit() {
    // this.mys.checkIfExistUsuario().subscribe((res1) => {
    //   if (res1) {
    //     this.mys.getUser().subscribe((usuario) => {
    //       console.log('usuario Logueado');
    //       this.usuario = usuario;
    //       // console.log('usuario', usuario);

    //       // this.myData.rut = this.usuario.usuario.rut;
    //       // this.myData.ruti = this.usuario.usuario.rut
    //       // this.myData.email = this.usuario.usuario.email;
    //       // this.myData.emaili = this.usuario.usuario.email
    //     });
    //   }
    //   // else {
    //   //   console.warn('no hay  usuario registrado');
    //   //   this.router.navigateByUrl('/home');
    //   //   this.mys.alertShow(
    //   //     'Error!!',
    //   //     'alert',
    //   //     'El usuario debe haber Iniciado Sesión'
    //   //   );
    //   // }
    // });
  }

  consultar() {
    // console.log('this.myData', this.myData);

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
                  // console.log('es IDA o entregado');

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
    // console.log('forma', forma);
    // console.log('this.myData.fechaNacimiento', this.myData.fechaNacimiento);

    // if ((this.myData.rut.length > 12 || this.myData.rut.length < 11)) {
    // this.mys.alertShow('Verifique!! ', 'alert', 'Introduzca un RUT válido');
    // } else if (this.myData.documentoO && (this.myData.rut.length > 15 || this.myData.rut.length < 7)) {
    //   this.mys.alertShow('Verifique!! ', 'alert', 'Introduzca un RUT válido');
    // } else
    if (forma.controls.nombre.errors) {
      this.mys.alertShow('Verifique!! ', 'alert', 'Introduzca un nombre válido');
    } else if (forma.controls.email.errors) {
      this.mys.alertShow('Verifique!! ', 'alert', 'Introduzca un email válido');
      // } else if (forma.controls.celular.errors && this.myData.celular !== '+56') {
      //   this.mys.alertShow('Verifique!! ', 'alert', 'Verifique el celular e intente nuevamente..<br> ingrese de 6 a 10 caracteres sin código de país');
      // } else if ((this.myData.documentoC && this.myData.documentoO) || (!this.myData.documentoC && !this.myData.documentoO)) {
      //   this.mys.alertShow('Verifique!! ', 'alert', 'Introduzca el tipo de documento adecuado.');
    } else if (forma.controls.descripcion.errors) {
      this.mys.alertShow('Verifique!! ', 'alert', 'Introduzca una ciudad válida para continuar.');
    } else {


      console.log('this.myData', this.myData);

      // let objetoAenviar = {
      //   tipoSolicitud: 1,
      //   solicitante: this.myData.nombre,
      //   rut: this.myData.rut.replace(/\./g, ''),
      //   telefono: this.myData.celular,
      //   email: this.myData.email,
      //   descripcion: this.myData.descripcion,
      //   estado: '1',
      //   // fechaSolicitud: '2020-04-01T03:00:00.000+0000',
      //   fechaSolicitud: moment().format('YYYY-MM-DDTHH:mm:00.000+0000'),
      //   responsable: 'null'
      // }


      // // console.log('objetoAenviar', objetoAenviar);

      // this.integrador.guardarSolicitud(objetoAenviar).subscribe((x: any) => {
      //   if (x.exito) {
      //     this.mys.alertShow('Éxito!! ', 'alert', 'Solicitud enviada exitosamente');
      //     this.router.navigateByUrl('/home');

      //   } else {
      //     this.mys.alertShow('Verifique!! ', 'alert', 'Intente nuevamente..');

      //   }
      // });


    }
  } // fin validar


  async popMenu(event) {
    // console.log('event', event);
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

    // recibo la variable desde el popover y la guardo en data
    // const { data } = await popoverCart.onWillDismiss();
    // this.router.navigateByUrl(data.destino);
  }

  pruebaBorrar() {
    this.mys.alertShow(
      'En desarrollo..',
      'timer',
      'En desarrollo..',
    );
  }

  cambioFecha() {
    // console.log('cambio de fecha', this.myData);
  }


  confirmarOtro() {
    this.confirmed = null;
    this.mys.confirm = null;
    this.mys.confirmSelected = null;
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

      // '/confirm-seat'
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
}
