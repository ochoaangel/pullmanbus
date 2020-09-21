import { Component, OnInit } from '@angular/core';
import { MyserviceService } from 'src/app/service/myservice.service';
import { IntegradorService } from 'src/app/service/integrador.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { PopoverController } from '@ionic/angular';
import { PopMenuComponent } from 'src/app/components/pop-menu/pop-menu.component';
import { PopCartComponent } from 'src/app/components/pop-cart/pop-cart.component';
import { info } from 'console';

@Component({
  selector: 'app-ticket-change',
  templateUrl: './ticket-change.page.html',
  styleUrls: ['./ticket-change.page.scss'],
})
export class TicketChangePage implements OnInit {
  compra;
  existeBoleto;
  loading = 0;

  usuario = null;

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
    this.mys.checkIfExistUsuario().subscribe((res1) => {
      if (res1) {
        this.mys.getUser().subscribe((usuario) => {
          this.usuario = usuario;
          this.myData.rut = this.usuario.usuario.rut;
          this.myData.email = this.usuario.usuario.email;
        });
      } else {
        console.warn('no hay  usuario registrado');
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

          console.log('res_canjeValidar', validado);

          if (validado.resultado.exito) {
            let infoBoleto = validado.boleto;
            console.log('infoBoleto', infoBoleto);
            this.mys.termConditionChange = infoBoleto.condiciones;
            if (infoBoleto.estadoActual === 'IDA' || infoBoleto.estadoActual === 'ENT' || infoBoleto.estadoActual === 'CON') {
              /////////////////////////////////////
              // let actual = moment.utc()
              let embarcacionFecha = `${infoBoleto.fechaEmbarcacion} ${infoBoleto.horaEmbarcacion}`;

              let today = moment().format('DD/MM/YYYY'); // para quitar las horas y munutos..

              // fecha embarque
              let filtroEmbarque = moment(embarcacionFecha, 'DD/MM/YYYY HH:mm').format('DD/MM/YYYY');
              let unixEmbarque = moment(filtroEmbarque, 'DD/MM/YYYY').unix();

              // referencia a hoy menos 3 dias
              let unixTope = moment(today, 'DD/MM/YYYY').subtract(3, 'days').unix();

              if (unixEmbarque > unixTope) {
                this.existeBoleto = infoBoleto;
                this.valor = parseInt(infoBoleto.valor);
                this.compra = infoBoleto.tipoCompra === 'INT' ? 'internet' : 'ventanilla';
              } else {
                this.mys.alertShow('Error!!', 'alert', 'El boleto, no puede ser cambiado, superó el límite de fecha..');
              }
            } else {
              this.mys.alertShow('Error!!', 'alert', validado.mensaje || 'El boleto no es de ida o no se ha entregado..');
            }
          } else {
            this.mys.alertShow('Error!!', 'alert', 'Este Boleto No puede ser cambiado..');
          }
        });
    } else {
      this.mys.alertShow('Error!!', 'alert', 'Ingrese in boleto válido para consultar..');
    }
  }

  cambiar(forma) {
    let ventanilla = this.compra === 'ventanilla' ? true : false;

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.myData.email)) {
      this.mys.alertShow('Error!!', 'alert', 'Verifique el correo e intente nuevamente.');
    } else if (!/^[0-9]+[-|-]{1}[0-9kK]{1}$/.test(this.myData.rut.replace(/\./gi, ''))) {
      this.mys.alertShow('Error!!', 'alert', 'Verifique el rut e intente nuevamente.');
    } else if (!this.myData.fecha && ventanilla) {
      this.mys.alertShow('Error!!', 'alert', 'Debe ingresar una fecha válida.. intente de nuevo..');
    } else if (!this.myData.hora && ventanilla) {
      this.mys.alertShow('Error!!', 'alert', 'Debe ingresar una hora válida.. Intente de nuevo..');
    } else if (!this.myData.acuerdo) {
      this.mys.alertShow('Error!!', 'alert', 'Debe aceptar los términos y condiciones de compras para continuar..');
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
          this.mys.alertShow('Error!!', 'alert', 'No se puede cambiar el boleto,<br> la fecha u hora ingresada no coincide con la del boleto..');
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
          idIntegrador:1001
        };
        this.integrador.canjeBoleto(dataPost).subscribe((res: any) => {
          console.log('res_canjeBoleto', res);
          if (res.resultado.exito) {
            this.existeBoleto = null;
            this.myData.boleto = '';
            this.mys.ticketChange = res;
            this.router.navigateByUrl('/voucher-change');          
          } else {
            this.mys.alertShow('Error!!', 'alert', 'No se pudo cambiar el boleto.. intente de nuevo..');
          }
        });
      }
    }
  }

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
          exist ? this.router.navigateByUrl('/user-panel') : this.router.navigateByUrl('/login');
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

  rutFunction(rawValue) {
    const numbers = rawValue.match(/[0-9kKeE]/g);
    let numberLength = 0;
    if (numbers) {
      numberLength = numbers.join('').length;
    }
    if (numberLength > 8) {
      return [/[1-9]/, /[0-9]/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /[0-9KkEe]/];
    } else {
      return [/[1-9]/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /[0-9KkEe]/];
    }
  }

  irAterminos() {
    this.router.navigateByUrl('/terms-conditions-change');
  }
}
