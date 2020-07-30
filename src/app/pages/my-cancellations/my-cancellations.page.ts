import { Component, OnInit } from '@angular/core';
import { MyserviceService } from 'src/app/service/myservice.service';
import { IntegradorService } from 'src/app/service/integrador.service';
import { Router } from '@angular/router';
import { PopoverController, AlertController } from '@ionic/angular';
import { PopMenuComponent } from 'src/app/components/pop-menu/pop-menu.component';
import { PopCartComponent } from 'src/app/components/pop-cart/pop-cart.component';
import * as moment from 'moment';


@Component({
  selector: 'app-my-cancellations',
  templateUrl: './my-cancellations.page.html',
  styleUrls: ['./my-cancellations.page.scss'],
})
export class MyCancellationsPage implements OnInit {

  boletosAll = [];
  transaccionesAll = [];
  usuario;
  loading = 0;
  nBoletosSeleccionados = 0;

  tipoDeCuentaOptions = { header: 'Tipo de Cuenta' };
  bancoOptions = { header: 'Banco' };

  myData = {
    tiposDeCuentas: [
      {
        codigo: 'CuentaCorriente',
        nombre: 'Cuenta Corriente'
      },
      {
        codigo: 'CuentaVista',
        nombre: 'Cuenta Vista'
      }
    ],
    tipoDeCuenta: '',
    codigoBoletoAconsultar: '',
    numeroDeCuenta: '',
    bancos: [
      {
        codigo: 'Banco BICE',
        nombre: 'Banco BICE'
      },
      {
        codigo: 'BBVA',
        nombre: 'BBVA'
      },
      {
        codigo: 'Banco Btg Pactual Chile',
        nombre: 'Banco Btg Pactual Chile'
      },
      {
        codigo: 'Banco Consorcio',
        nombre: 'Banco Consorcio'
      },
      {
        codigo: 'Banco de Chile',
        nombre: 'Banco de Chile'
      },
      {
        codigo: 'BCI',
        nombre: 'BCI'
      },
      {
        codigo: 'Banco Estado',
        nombre: 'Banco Estado'
      },
      {
        codigo: 'Banco do Brasil S.A.',
        nombre: 'Banco do Brasil S.A.'
      },
      {
        codigo: 'Banco Falabella',
        nombre: 'Banco Falabella'
      },
      {
        codigo: 'Banco Internacional',
        nombre: 'Banco Internacional'
      },
      {
        codigo: 'Banco Itaú Chile',
        nombre: 'Banco Itaú Chile'
      },
      {
        codigo: 'Banco Penta',
        nombre: 'Banco Penta'
      },
      {
        codigo: 'Banco Ripley',
        nombre: 'Banco Ripley'
      },
      {
        codigo: 'Banco Santander',
        nombre: 'Banco Santander'
      },
      {
        codigo: 'Banco Security',
        nombre: 'Banco Security'
      },
      {
        codigo: 'Corpbanca',
        nombre: 'Corpbanca'
      },
      {
        codigo: 'Deutsche Bank Chile',
        nombre: 'Deutsche Bank Chile'
      },
      {
        codigo: 'HSBC Bank Chile',
        nombre: 'HSBC Bank Chile'
      },
      {
        codigo: 'JP Morgan Chase Bank',
        nombre: 'JP Morgan Chase Bank'
      },
      {
        codigo: 'Rabobank Chile',
        nombre: 'Rabobank Chile'
      },
      {
        codigo: 'Scotiabank',
        nombre: 'Scotiabank'
      }
    ],
    rutTitular: '',
    banco: ''
  };
  constructor(
    private mys: MyserviceService,
    private integrador: IntegradorService,
    private router: Router,
    private popoverCtrl: PopoverController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.mys.getUser().subscribe(usuario => {
      this.usuario = usuario;
      console.log('usuario desde LocalStorage:', usuario);
      this.loading++;
      let data = { email: (usuario.usuario.email).toLowerCase() };

      this.integrador.buscarTransaccionPorEmail(data).subscribe(transacciones => {

        this.loading--;
        this.transaccionesAll = transacciones;

        if (transacciones.length < 1) {
          this.mys.alertShow('Sin Transacciones', 'alert', 'No hay transacciones registradas para mostrar');
          this.router.navigateByUrl('/my-cancellations');
        } else {
          this.transaccionesAll.forEach(transaccion => {
            // buscando cada boleto de cada transaccion
            this.boletosAll = [];
            this.loading++;
            // let myParams = { email: usuario.usuario.email, codigo: transaccion.codigo }
            let myParams = { codigo: transaccion.codigo };
            //console.log('myParams', myParams);
            this.integrador.buscarBoletoPorCodigo(myParams).subscribe(boletos => {
              this.loading--;
              //console.log('------------------boletos', boletos);

              // boletos.forEach(boleto => {
              //   if (boleto.estado === 'ACT') {
              //     boleto['selected'] = false
              //     this.boletosAll.push(boleto)
              //   }
              // });
              boletos.forEach(boleto => {
                let estadoBoleto = '';

                if (boleto.estado === 'NUL') {
                  estadoBoleto = 'ANULADO';
                } else if (boleto.estado === 'CAN') {
                  estadoBoleto = 'DEVUELTO';
                } else {
                  // posibles casos activos
                  let actualDate = moment();

                  let fechaSalida = moment(`${boleto.imprimeVoucher.fechaSalida} ${boleto.imprimeVoucher.horaSalida}`, 'DD/MM/YYYY HH:mm');
                  let fechaSalidaPlus4H = fechaSalida.add(4, 'hours').add(1, 'minute');
                  if (fechaSalida.isBefore(actualDate)) {
                    estadoBoleto = 'INACTIVO';
                  } else {
                    // caso de 4horas para anular 
                    fechaSalida.isBefore(fechaSalidaPlus4H) ? estadoBoleto = 'INACTIVO' : estadoBoleto = 'ACTIVO';
                  }
                }
                boleto['selected'] = false;
                boleto['myEstado'] = estadoBoleto;
                // this.boletosAll.push(boleto)
                // estadoBoleto === 'ACTIVO' ? this.boletosAll.push(boleto):this.boletosAll.push(boleto)
                estadoBoleto === 'ACTIVO' ? this.boletosAll.push(boleto) : null;
              });
              //console.log('this.boletosAll', this.boletosAll);
            });
          });

        }


      });
    });
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
    const popoverCart = await this.popoverCtrl.create({
      component: PopCartComponent,
      event,
      mode: 'ios',
      backdropDismiss: true,
      cssClass: 'popCart'
    });
    await popoverCart.present();

    // recibo la variable desde el popover y la guardo en data
    // const { data } = await popoverCart.onWillDismiss();
    // this.router.navigateByUrl(data.destino);
  }

  anular() {
    // //console.log('this.boletosAll', this.boletosAll);
    // //console.log('',);
    if (!this.myData.rutTitular) {
      this.mys.alertShow('Verifique', 'alert', 'Ingrese rut del Titular');
    } else if (!/^[0-9]+[-|-]{1}[0-9kK]{1}$/.test(this.myData.rutTitular)) {
      this.mys.alertShow('Verifique', 'alert', 'Ingrese rut del Titular v�lido, sin puntos ni espacios');
    } else if (!this.myData.banco) {
      this.mys.alertShow('Verifique', 'alert', 'Seleccione un Banco');
    } else if (!this.myData.tipoDeCuenta) {
      this.mys.alertShow('Verifique', 'alert', 'Seleccione tipo de cuenta');
    } else if (!this.myData.numeroDeCuenta) {
      this.mys.alertShow('Verifique', 'alert', 'Ingrese un numero de cuenta');
    } else {

      // ver si hay boletos this.nBoletosSeleccionados.
      let seleccionados = this.boletosAll.filter(x => x.selected);
      if (seleccionados.length > 0) {
        this.presentAlertConfirmAnulacion();
      } else {
        this.mys.alertShow('Verifique', 'alert', `Seleccione boletos para anular.<br> Intente nuevamente..'}`);
      }


      // //console.log('listooooooxxxxx');
      // // this.ionViewWillEnter()
      // let contador = 0;
      // this.boletosAll.forEach(boleto => {
      //   // selecciona los seleccionado y activos
      //   if (boleto.selected) {
      //     contador++;
      //     let data = {
      //       boleto: boleto.boleto,
      //       codigoTransaccion: boleto.codigo,
      //       rutSolicitante: this.usuario.usuario.rut,
      //       usuario: `${this.usuario.usuario.nombre} ${this.usuario.usuario.apellidoPaterno}`,
      //       banco: this.myData.banco,
      //       tipoCuenta: this.myData.tipoDeCuenta,
      //       numeroCuenta: this.myData.numeroDeCuenta,
      //       rutTitular: this.myData.rutTitular,
      //       integrador: boleto.integrador
      //     };
      //     // alert(contador)
      //     //console.log('dataEnviadoParaAnular', contador, data);
      //     this.loading++;
      //     this.integrador.anularBoleto(data).subscribe((resultado: any) => {
      //       this.loading--;
      //       //console.log('resultado', resultado);
      //       if (resultado.exito) {
      //         this.mys.alertShow('¡Éxito!', 'done-all', `Boleto ${data.boleto}  <br> Fecha:${boleto.imprimeVoucher.fechaSalida} <br> Hora:${boleto.imprimeVoucher.horaSalida} <br> Asiento:${boleto.imprimeVoucher.asiento} <br> Boleto devuelto Exitosamente`);
      //         // alert(`Boleto ${data.boleto}  <br> Fecha:${boleto.imprimeVoucher.fechaSalida} <br> Hora:${boleto.imprimeVoucher.horaSalida} <br> Asiento:${boleto.imprimeVoucher.asiento} <br> Boleto devuelto Exitosamente`);
      //         console.log('enviando correo al email ', (this.usuario.usuario.email).toLowerCase());
      //         this.integrador.enviarMailAnulacion({ email: (this.usuario.usuario.email).toLowerCase() }).subscribe(email => {
      //           console.log('resp de enviarMailAnulacion: ', email);
      //         })

      //       } else {
      //         this.mys.alertShow('Verifique', 'alert', `Boleto ${data.boleto}  <br> Fecha: ${boleto.imprimeVoucher.fechaSalida} <br> Hora: ${boleto.imprimeVoucher.horaSalida} <br> Asiento: ${boleto.imprimeVoucher.asiento} <br> ${resultado.mensaje || 'Error al devolver el Boleto, Verifique los datos e intente nuevamente..'}`);
      //         // alert(`Boleto ${data.boleto}  <br> Fecha:${boleto.imprimeVoucher.fechaSalida} <br> Hora:${boleto.imprimeVoucher.horaSalida} <br> Asiento:${boleto.imprimeVoucher.asiento} <br> ${resultado.mensaje || 'Error al devolver el Boleto, Verifique los datos e intente nuevamente..'}`);
      //       }
      //     });

      //     if (contador === this.nBoletosSeleccionados) {
      //       this.nBoletosSeleccionados = 0;
      //       this.ionViewWillEnter();
      //     }
      //   }
      // });
    }

  }

  ionViewWillLeave() {
    this.boletosAll = [];
  }

  checkboxChanged() {
    //console.log('CHANGED_this.boletosAll', this.boletosAll);
    let nSelected = 0;
    this.boletosAll.forEach(element => {
      element.selected ? nSelected++ : null;
    });
    this.nBoletosSeleccionados = nSelected;
    //console.log('nSelected', nSelected);
  }

  actualizar() {
    this.ionViewWillEnter();
  }


  async presentAlertConfirmAnulacion() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirmar acción',
      mode: 'ios',
      message: ' <ion-icon  name="information-circle"></ion-icon> <br >¿Esta seguro de devolver boleto(s) seleccionado(s)?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Si, Continuar',
          handler: () => {
            console.log('Confirm Okay');

            //console.log('listooooooxxxxx');
            // this.ionViewWillEnter()
            let contador = 0;
            this.boletosAll.forEach(boleto => {
              // selecciona los seleccionado y activos
              if (boleto.selected) {
                contador++;
                let data = {
                  boleto: boleto.boleto,
                  codigoTransaccion: boleto.codigo,
                  rutSolicitante: this.usuario.usuario.rut,
                  usuario: `${this.usuario.usuario.nombre} ${this.usuario.usuario.apellidoPaterno}`,
                  banco: this.myData.banco,
                  tipoCuenta: this.myData.tipoDeCuenta,
                  numeroCuenta: this.myData.numeroDeCuenta,
                  rutTitular: this.myData.rutTitular,
                  integrador: boleto.integrador
                };
                // alert(contador)
                //console.log('dataEnviadoParaAnular', contador, data);
                this.loading++;
                this.integrador.anularBoleto(data).subscribe((resultado: any) => {
                  this.loading--;
                  //console.log('resultado', resultado);
                  if (resultado.exito) {
                    this.mys.alertShow('¡Éxito!', 'done-all', `Boleto ${data.boleto}  <br> Fecha:${boleto.imprimeVoucher.fechaSalida} <br> Hora:${boleto.imprimeVoucher.horaSalida} <br> Asiento:${boleto.imprimeVoucher.asiento} <br> Boleto devuelto Exitosamente`);
                    // alert(`Boleto ${data.boleto}  <br> Fecha:${boleto.imprimeVoucher.fechaSalida} <br> Hora:${boleto.imprimeVoucher.horaSalida} <br> Asiento:${boleto.imprimeVoucher.asiento} <br> Boleto devuelto Exitosamente`);
                    console.log('enviando correo al email ', (this.usuario.usuario.email).toLowerCase());
                    this.integrador.enviarMailAnulacion({ email: (this.usuario.usuario.email).toLowerCase() }).subscribe(email => {
                      console.log('resp de enviarMailAnulacion: ', email);
                    });

                  } else {
                    this.mys.alertShow('Verifique', 'alert', `Boleto ${data.boleto}  <br> Fecha: ${boleto.imprimeVoucher.fechaSalida} <br> Hora: ${boleto.imprimeVoucher.horaSalida} <br> Asiento: ${boleto.imprimeVoucher.asiento} <br> ${resultado.mensaje || 'Error al devolver el Boleto, Verifique los datos e intente nuevamente..'}`);
                    // alert(`Boleto ${data.boleto}  <br> Fecha:${boleto.imprimeVoucher.fechaSalida} <br> Hora:${boleto.imprimeVoucher.horaSalida} <br> Asiento:${boleto.imprimeVoucher.asiento} <br> ${resultado.mensaje || 'Error al devolver el Boleto, Verifique los datos e intente nuevamente..'}`);
                  }
                });

                if (contador === this.nBoletosSeleccionados) {
                  this.nBoletosSeleccionados = 0;
                  this.ionViewWillEnter();
                }
              }
            });

          }
        }
      ]
    });

    await alert.present();
  }


}