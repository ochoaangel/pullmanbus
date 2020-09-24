import { Component, OnInit } from '@angular/core';
import { MyserviceService } from 'src/app/service/myservice.service';
import { IntegradorService } from 'src/app/service/integrador.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { PopoverController } from '@ionic/angular';
import { PopMenuComponent } from 'src/app/components/pop-menu/pop-menu.component';
import { PopCartComponent } from 'src/app/components/pop-cart/pop-cart.component';

@Component({
  selector: 'app-ticket-management',
  templateUrl: './ticket-management.page.html',
  styleUrls: ['./ticket-management.page.scss'],
})
export class TicketManagementPage implements OnInit {
  compra;
  existeBoleto;
  loading = 0;

  usuario = null;
  estadoUsuario = null;

  valor = 0;

  ionActualDate;
  ionLimitTravelDate;
  ionTravelTime;
  statusTimeDate: boolean;

  myData = {
    email: '',
    rut: '',
    fecha: '',
    hora: '',
    boleto: '',
    acuerdo: false,
  };

  constructor(
    private mys: MyserviceService,
    private integrador: IntegradorService,
    private router: Router,
    private popoverCtrl: PopoverController
  ) {
    this.compra = 'ventanilla'; //  internet ó ventanilla
    this.existeBoleto = null;
  }

  ngOnInit() {

  }
  ionViewWillEnter(){
    this.mys.checkIfExistUsuario().subscribe((res1) => {
      if (res1) {
        this.mys.getUser().subscribe((usuario) => {
          console.log('usuario Logueado');
          this.usuario = usuario;                    
          this.estadoUsuario = usuario.usuario.estado;
          console.log(this.estadoUsuario)
        });
      }
      else{
        this.estadoUsuario = null;
        console.log('sin usuario Logueado');
      }
    });
  }

  consultar() {

    this.existeBoleto = null;

    if (this.myData.boleto) {
      this.loading++;
      this.integrador
        .canjeValidar({ boleto: this.myData.boleto + '' })
        .subscribe((validado: any) => {
          this.loading--;

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

  cambiar(forma) {
    let ventanilla = this.compra === 'ventanilla' ? true : false;

    if (
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.myData.email)
    ) {
      this.mys.alertShow(
        'Error!!',
        'alert',
        'Verifique el correo e intente nuevamente.'
      );
    } else if (!/^[0-9]+[-|-]{1}[0-9kK]{1}$/.test(this.myData.rut)) {
      this.mys.alertShow(
        'Error!!',
        'alert',
        'Verifique el rut e intente nuevamente.'
      );
    } else if (!this.myData.fecha && ventanilla) {
      this.mys.alertShow(
        'Error!!',
        'alert',
        'Debe ingresar una fecha válida.. intente de nuevo..'
      );
    } else if (!this.myData.hora && ventanilla) {
      this.mys.alertShow(
        'Error!!',
        'alert',
        'Debe ingresar una hora válida.. Intente de nuevo..'
      );
    } else if (!this.myData.acuerdo) {
      this.mys.alertShow(
        'Error!!',
        'alert',
        'Debe aceptar los términos y condiciones de compras para continuar..'
      );
    } else {
      let validadaFecha = false;
      if (ventanilla) {
        let inFecha = moment(this.myData.fecha).format('DD/MM/YYYY');
        let inHora = moment(this.myData.hora).format('HH:mm');
        let inAllingresado = `${inFecha} ${inHora}`;

        let embarcacion = `${this.existeBoleto.fechaEmbarcacion} ${this.existeBoleto.horaEmbarcacion}`;

        if (inAllingresado === embarcacion) {
          validadaFecha = true;
        } else {
          this.mys.alertShow(
            'Error!!',
            'alert',
            'No se puede cambiar el boleto,<br> la fecha u hora ingresada no coincide con la del boleto..'
          );
          let validadaFecha = false;
        }
      } else {
        // por internet
        validadaFecha = true;
      }

      if (validadaFecha) {
        let dataPost = {
          boleto: this.myData.boleto,
          email: this.myData.email,
          usuario: this.myData.email,
          rut: this.myData.rut,
        };
        this.integrador.canjeBoleto(dataPost).subscribe((res: any) => {
          console.log('res', res);
          if (res.exito) {
            let codigo = res.mensaje ? `<br>Nuevo código: ${res.mensaje}` : ``;

            this.mys.alertShow(
              'Éxito!!',
              'checkmark-circle',
              'Su boleto ha sido cambiado..' + codigo
            );
            this.existeBoleto = null;
            this.myData.boleto = '';
          } else {
            this.mys.alertShow(
              'Error!!',
              'alert',
              'No se pudo cambiar el boleto.. intente de nuevo..'
            );
          }
        });
      }
    }

  }

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

}
