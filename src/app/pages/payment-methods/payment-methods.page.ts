import { Component, OnInit, ɵisDefaultChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { MyserviceService } from 'src/app/service/myservice.service';
import { IntegradorService } from 'src/app/service/integrador.service';
import { PopMenuComponent } from 'src/app/components/pop-menu/pop-menu.component';
import { PopoverController } from '@ionic/angular';
import { PopCartComponent } from 'src/app/components/pop-cart/pop-cart.component';

@Component({
  selector: 'app-payment-methods',
  templateUrl: './payment-methods.page.html',
  styleUrls: ['./payment-methods.page.scss'],
})
export class PaymentMethodsPage implements OnInit {
  listaConvenio = [];
  listaMedioPago = [];
  listaDetalleConvenio = [];
  datosConvenio: any;
  loading;
  leaveOnExit;
  showPopCart;
  // rutShow = false

  constructor(
    private mys: MyserviceService,
    private router: Router,
    private integradorService: IntegradorService,
    private popoverCtrl: PopoverController,

  ) {
    this.loading = 2;

    this.integradorService.getListConvenio().subscribe(convenio => {
      this.listaConvenio = convenio;
      this.loading -= 1;
    });

    this.datosConvenio = null;
    this.integradorService.getListMedioPago().subscribe(medioPago => {
      this.loading -= 1;
      medioPago.Convenio.forEach(pago => {
        if (pago.BotonPago == 'SI') {
          pago.Imagen = pago.Imagen != '' ? 'data:image/jpeg;base64,' + pago.Imagen : '';
          this.listaMedioPago.push(pago);
        }
      });
    });



  }

  mostrarTarifaAtachada = false;

  totalSinDscto: number;
  totalFinal: number;

  acuerdo = { acuerdo: false };
  ticket = {
    comprasDetalles : []
  }
  usuario;
  registrado: boolean;

  compraDetalles = [];

  DatosFormulario = {
    convenioUp: null,
    convenioDown: null,
    acuerdo: null,
    rut: null,
    v_rut: false,
    codigo: '+56',
    v_codigo: false,
    telefono: null,
    v_telefono: false,
    email: null,
    v_email: false,
    email2: null,
    v_email2: false,
    validandoConRut: false
  };

  public maskCodigo = {
    guide: false,
    showMask: false,
    mask: ['+', /\d/, /\d/, /\d/, /\d/]

  };


  ngOnInit() {
    if (this.mys.ticket === undefined) {
      //this.showPopCart.dismiss();
      this.router.navigateByUrl('/buy-your-ticket');
      return;
    }
    this.compraDetalles = [];
    this.ionViewWillEnter();
    this.mys.carritoEliminar.subscribe(x => {
      console.log('xxxxxxxxxxxxxxxxx', x);
      this.compraDetalles = this.compraDetalles.filter(compras => !(x.asiento === compras.asiento && x.idServicio === compras.idServicio))
      console.log('this.compraDetalles', this.compraDetalles);
      if (this.compraDetalles.length < 1) {
        this.showPopCart.dismiss();
        this.router.navigateByUrl('/buy-your-ticket');
        // this.mys.alertShow('¡Verifique!', 'alert', 'No hay Boletos para pagar, inicie el proceso de compra..');
      } else {
        // caso cuando hay que calcular totales
        let total = 0;
        this.compraDetalles.forEach(element => {
          total = total + element.valor;
        });
        console.log('totalCalculado', total);
        this.mys.ticket.comprasDetalles = this.compraDetalles;
        this.mys.total = total;
        // caso cuando hay descuentos
        if (this.mostrarTarifaAtachada) {
          this.validarDatosConvenio();

        } else {
          this.totalFinal = total;
        }

      }
    });
  }

  ionViewWillEnter() {
    console.log("ionViewWillEnter");    
    this.compraDetalles = this.mys.ticket.comprasDetalles;
    console.log('this.compraDetalles', this.compraDetalles);    
    this.mys.getUser().subscribe(usuario => {
      if (usuario) {
        this.usuario = usuario;
        this.registrado = true;

        this.DatosFormulario.rut = this.usuario.usuario.rut;
        this.DatosFormulario.telefono = this.usuario.usuario.telefono;
        this.DatosFormulario.email = this.usuario.usuario.email;
        this.DatosFormulario.email2 = '';

      } else {
        this.usuario = null;
        this.registrado = false;
      }
    });
    let info = localStorage.getItem('ticket');
    if (info) {
      this.totalFinal = JSON.parse(localStorage.getItem('totalFinal'));
      this.ticket = JSON.parse(localStorage.getItem('ticket'));
      this.mys.total = this.totalFinal;
      this.mys.ticket = this.ticket;
    } else {
      this.totalFinal = this.mys.total;
      this.ticket = this.mys.ticket;
      localStorage.setItem('totalFinal', JSON.stringify(this.totalFinal));
      localStorage.setItem('ticket', JSON.stringify(this.ticket));
    }
    
  }


  seleccionadoConvenioUp(convenio) {
    this.totalFinal = this.mys.total;
    this.mostrarTarifaAtachada = false;
    if (convenio != 'BCNSD') {
      this.DatosFormulario.convenioDown = 'WBPAY';
    }
    this.loading += 1;
    this.integradorService.getDetalleConvenio({ 'convenio': convenio }).subscribe(detalleConvenio => {
      this.loading -= 1;
      this.listaDetalleConvenio = detalleConvenio;
      this.listaDetalleConvenio.forEach(item => {
        item.Placeholder = item.Valor;
      });

    }, erro => this.loading -= 1);
  }

  seleccionadoMedioPago(medioPago) {
    this.DatosFormulario.convenioDown = medioPago;
    if (this.DatosFormulario.convenioDown === 'BCNSD') {
      this.DatosFormulario.convenioUp = '';
      this.seleccionadoConvenioUp(medioPago);
    } else {
      if (this.DatosFormulario.convenioUp == undefined || this.DatosFormulario.convenioUp === '') {
        this.totalFinal = this.mys.total;
        this.mostrarTarifaAtachada = false;
        this.listaDetalleConvenio = [];
      }
    }
  }

  pagar() {

    if (!this.DatosFormulario.email) {
      this.mys.alertShow('¡Verifique!', 'alert', 'Debe ingresar un email válido para continuar con el pago');
    } else if (!this.DatosFormulario.email2) {
      this.mys.alertShow('¡Verifique!', 'alert', 'Debe re-ingresar un email válido para continuar con el pago');
    } else if (this.DatosFormulario.email.toLowerCase() !== this.DatosFormulario.email2.toLowerCase()) {
      this.mys.alertShow('¡Verifique!', 'alert', 'Verifique Los emails no coinciden, para continuar con el pago');
    } else if (!this.DatosFormulario.convenioDown) {
      this.mys.alertShow('¡Verifique!', 'alert', 'Debe seleccionar un método de pago para continuar');
    } else if (!this.DatosFormulario.acuerdo) {
      this.mys.alertShow('¡Verifique!', 'alert', 'Debe aceptar el acuerdo y condiciones de compra para continuar con el pago');
    } else {
      // this.mys.alertShow('¡Verifique!', 'alert', 'Todo correcto');
      let guardarTransaccion = {
        email: this.DatosFormulario.email,
        rut: this.usuario ? this.usuario.rut : '',
        medioDePago: this.DatosFormulario.convenioDown,
        puntoVenta: 'PUL',
        montoTotal: this.totalFinal,
        idSistema: 5,
        listaCarrito: []
      };
      this.mys.ticket.comprasDetalles.forEach(boleto => {
        let valor;
        if (this.datosConvenio != null && this.datosConvenio.mensaje == 'OK') {
          let fecha = boleto.service.fechaSalida.split('/');
          valor = this.datosConvenio.listaBoleto.find(boleto2 =>
            boleto.service.idServicio == boleto2.idServicio &&
            boleto.asiento == boleto2.asiento &&
            (fecha[2] + fecha[1] + fecha[0]) == boleto2.fechaSalida
          );
        }


        let end = {
          servicio: boleto.service.idServicio,
          fechaServicio: boleto.service.fechaServicio,
          fechaPasada: boleto.service.fechaSalida,
          fechaLlegada: boleto.service.fechaLlegada,
          horaSalida: boleto.service.horaSalida,
          horaLlegada: boleto.service.horaLlegada,
          asiento: boleto.asiento,
          origen: boleto.service.idTerminalOrigen,
          destino: boleto.service.idTerminalDestino,
          monto: valor ? valor.valor : boleto.valor,
          precio: valor ? valor.pago : boleto.valor,
          descuento: valor ? valor.descuento : 0,
          empresa: boleto.service.empresa,
          clase: boleto.piso == '1' ? boleto.service.idClaseBusPisoUno : boleto.service.idClaseBusPisoDos,
          convenio: this.datosConvenio != null ? this.datosConvenio.idConvenio : '',
          datoConvenio: this.datosConvenio != null ? this.datosConvenio.listaAtributo[0].valor : '',
          bus: boleto.piso == '1' ? boleto.service.busPiso1 : boleto.service.busPiso2,
          piso: boleto.piso,
          integrador: boleto.service.integrador,
          pasajero : {
            comunaDestino : boleto.pasajero.comunaDestino,
            comunaOrigen : boleto.pasajero.comunaOrigen,
            documento : boleto.pasajero.numeroDocumento,
            email : boleto.pasajero.email,
            nacionalidad : boleto.pasajero.nacionalidad,
            nombre : boleto.pasajero.nombre,
            apellido : boleto.pasajero.apellido,
            telefono : boleto.pasajero.telefono,
            telefonoEmergencia : boleto.pasajero.telefonoEmergencia,
            tipoDocumento : boleto.pasajero.tipoDocumento
          }
        }

        if (boleto.promocion) {
          end['idaVuelta'] = true;
        }
        guardarTransaccion.listaCarrito.push(end);

      });
      this.loading += 1;

      console.log('guardarTransaccion', guardarTransaccion.listaCarrito.length, guardarTransaccion.listaCarrito);
      this.integradorService.guardarTransaccion(guardarTransaccion).subscribe(resp => {
        console.log('respuesta de "guardarTransacción"', resp);
        this.loading -= 1;
        let valor: any = resp;
        if (valor.exito) {
          formularioTBKWS(valor.url, valor.token);
        } else {
          this.mys.alertShow('¡Verifique!', 'alert', valor.mensaje || 'Error, Verifique los datos ingresados..');
        }
      });
    }

    function formularioTBKWS(urltbk, token) {
      var f = document.createElement('form');
      f.setAttribute('method', 'post');
      f.setAttribute('action', urltbk);
      var i = document.createElement('input');
      i.setAttribute('type', 'text');
      i.setAttribute('name', 'TBK_TOKEN');
      i.setAttribute('value', token);
      f.appendChild(i.cloneNode());
      f.style.display = 'none';
      document.body.appendChild(f);
      f.submit();
      document.body.removeChild(f);
    }
  }

  aceptarAcuerdo() {
    if (this.acuerdo.acuerdo) { this.DatosFormulario.acuerdo = true; } else { this.DatosFormulario.acuerdo = false; }
  }

  setFocus(siguiente) {
  }


  nameMask(rawValue: string): RegExp[] {
    const mask = /[A-Za-z]/;
    const strLength = String(rawValue).length;
    const nameMask: RegExp[] = [];
    for (let i = 0; i <= strLength; i++) {
      nameMask.push(mask);
    }
    return nameMask;
  }

  rutFunction(rawValue) {
    let numbers = rawValue.match(/[0-9kKeE]/g);
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

  telefonoFunction(rawValue) {
    let numbers = rawValue.match(/\d/g);
    let numberLength = 0;
    if (numbers) {
      numberLength = numbers.join('').length;
    }

    if (numberLength > 10) {
      return ['(', /[1-9]/, /[1-9]/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    } else {
      return ['(', /[1-9]/, /[1-9]/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    }
  }

  validarDatosConvenio() {
    let validarConvenio = {
      'descuento': '0'
      , 'idConvenio': this.listaDetalleConvenio[0].Convenio
      , 'listaAtributo': []
      , 'listaBoleto': []
      , 'mensaje': ''
      , 'montoTotal': '0'
      , 'totalApagar': '0'
    };
    let re = /\./gi;
    this.listaDetalleConvenio.forEach(item => {
      validarConvenio.listaAtributo.push({ 'idCampo': item.Placeholder.trim(), 'valor': this.DatosFormulario.rut.replace(re, '') });
    });
    console.log("Carro de compras : ", this.mys.ticket.comprasDetalles);
    this.mys.ticket.comprasDetalles.forEach(boleto => {
      let fecha = boleto.service.fechaSalida.split('/');

      validarConvenio.listaBoleto.push({
        'clase': boleto.piso == 1 ? boleto.service.idClaseBusPisoUno : boleto.service.idClaseBusPisoDos
        , 'descuento': ''
        , 'destino': boleto.service.idTerminalDestino
        , 'fechaSalida': fecha[2] + fecha[1] + fecha[0]
        , 'idServicio': boleto.idServicio
        , 'origen': boleto.service.idTerminalOrigen
        , 'pago': boleto.valor
        , 'piso': boleto.piso
        , 'valor': boleto.valorNormal
        , 'asiento': boleto.asiento
        , 'promocion': boleto.promocion ? '1' : '0'
      });
      //validarConvenio.totalApagar = Number(validarConvenio.totalApagar) + Number(boleto.valor) + '';
    });
    //validarConvenio.montoTotal = validarConvenio.totalApagar;
    this.loading += 1;
    console.log("Validacion : ", validarConvenio);
    this.integradorService.getDescuentoConvenio(validarConvenio).subscribe(data => {

      this.loading -= 1;
      this.datosConvenio = data;
      console.log(this.datosConvenio);
      if (this.datosConvenio.mensaje && this.datosConvenio.mensaje === 'OK') {
        const withPromo = this.mys.ticket.comprasDetalles.filter(item => item.promocion)
        if (withPromo.length > 0) {
          this.mys.alertShow('¡Confirmado!', 'done-all', 'RUT con descuento para el convenio seleccionado. Los descuentos por convenios estarán desactivados para los asientos con promoción de boleto de regreso.');
        } else {
          this.mys.alertShow('¡Confirmado!', 'done-all', 'RUT con descuento para el convenio seleccionado.');
        }
        this.totalSinDscto = this.mys.total;
        this.totalFinal = Number(this.datosConvenio.totalApagar);
        this.mostrarTarifaAtachada = true;
      } else {

        switch (data.mensaje) {
          case 'RUT SIN DESCUENTO':
            this.mys.alertShow('¡Verifique!', 'alert', 'RUT sin descuento para el convenio seleccionado.');
            break;

          default:
            this.mys.alertShow('¡Verifique!', 'alert', 'RUT No válido para el convenio seleccionado.');
            break;
        }

        this.datosConvenio = null;
      }
    }, error => this.loading -= 1);
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
    console.log('event DsPayM', event);
    this.mys.temporalComprasCarrito = this.mys.ticket.comprasDetalles;
    this.showPopCart = await this.popoverCtrl.create({
      component: PopCartComponent,
      event,
      mode: 'ios',
      backdropDismiss: true,
      cssClass: 'popCart'
    });
    await this.showPopCart.present();
  }

  irAterminos() {
    this.router.navigateByUrl('/terms-conditions');
  }

}