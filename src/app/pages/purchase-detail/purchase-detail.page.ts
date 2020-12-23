import { Component, OnInit } from "@angular/core";
import { MyserviceService } from "src/app/service/myservice.service";
import { Router } from "@angular/router";
import { PopMenuComponent } from 'src/app/components/pop-menu/pop-menu.component';
import { PopoverController } from '@ionic/angular';
import { PopCartComponent } from 'src/app/components/pop-cart/pop-cart.component';
import { IntegradorService } from 'src/app/service/integrador.service';
import * as _ from 'underscore';
import * as moment from 'moment';



@Component({
  selector: "app-purchase-detail",
  templateUrl: "./purchase-detail.page.html",
  styleUrls: ["./purchase-detail.page.scss"]
})
export class PurchaseDetailPage implements OnInit {
  listaTipoDocumento = [];
  listaNacionalidad = [];
  listaComuna = [];
  constructor(
    private router: Router,
    private mys: MyserviceService,
    private popoverCtrl: PopoverController,
    private integradorService: IntegradorService,
  ) {
    console.log(mys.ticket.comprasDetalles);
    this.mys.carritoEliminar.subscribe(eliminar => {
      // dejar cuando NOO tiene compraDetalles  
      this.mys.ticket.comprasDetalles = this.mys.ticket.comprasDetalles.filter(x => !(x.idServicio === eliminar.idServicio && x.asiento === eliminar.asiento));
      this.ticket.comprasDetalles = this.mys.ticket.comprasDetalles;

      let total_general = 0;
      this.ticket.comprasDetalles.forEach(element => {
        total_general = total_general + element.valor;
      });
      this.tarifaTotal = total_general;

      if (total_general === 0) {
        this.next = '/home';
      }

      this.mys.liberarAsientoDesdeHeader(eliminar);
    });

    this.integradorService.buscarListaTipoDocumento().subscribe(
      resp => this.listaTipoDocumento = resp,
      error => console.log(error),
      ()=>{
        console.log(this.listaTipoDocumento)
      }
    )
    this.integradorService.buscarListaNacionalidad().subscribe(
      resp => this.listaNacionalidad = resp,
      error => console.log(error),
      ()=>{
        console.log(this.listaNacionalidad)
      }
    )
    this.integradorService.obtenerListaCiudad().subscribe(
      resp => this.listaComuna = resp,
      error => console.log(error),
      ()=>{
        console.log(this.listaComuna)
      }
    )
  }

  ticket;
  way;
  tarifaTotal;
  eliminadoAsiento = false;
  loading = false;

  next;

  showPromocionModal = false;
  modalInfo = {
    image: '',
    titulo: '',
    contenido: '',
    tarifaTotal: '',
    pasaje: {},
  };


  ngOnInit() {
    this.ionViewWillEnter();
  }



  ionViewWillEnter() {
    console.log('this.mys.ticketWillEnter', this.mys.ticket);
    if (this.mys.ticket) {
      this.ticket = this.mys.ticket;
      this.way = this.mys.way;
      let total_general = 0;
      this.ticket.comprasDetalles.forEach(element => {
        total_general = total_general + element.valor;
      });
      this.tarifaTotal = total_general;
    }
    console.log('this.tarifaTotalWillEnter', this.tarifaTotal);

    //////////////////////////////////////////////////////////////

    if (this.tarifaTotal === 0) {
      this.next = '/home';
    } else if ((this.ticket.tripType === 'goBack' && this.way === 'back') || (this.ticket.tripType === 'goOnly')) {
      this.next = '/payment-methods';
    } else if (this.ticket.tripType === 'goBack' && this.way === 'go') {
      this.next = '/ticket';
    }

  }

  continuar(destino) {

    switch (destino) {
      case '/home':
        this.mys.ticket = null;
        break;

      case '/payment-methods':
        this.mys.total = this.tarifaTotal;
        localStorage.setItem('totalFinal', JSON.stringify(this.tarifaTotal));
        localStorage.setItem('ticket', JSON.stringify(this.ticket));
        this.mys.ticket = this.ticket;
        break;

      case '/ticket':
        this.way = 'back';
        this.mys.way = this.way;
        this.mys.ticket = this.ticket;
        break;

      default:
        break;
    }
    this.router.navigateByUrl(destino);
  }// fin continuar

  eliminaBoleto(way, idServicio, asiento, y, x, piso){
    let pasajeAeliminar;
    if (this.ticket.comprasDetalles.length > 0) {
      pasajeAeliminar = this.ticket.comprasDetalles
        .filter(x => (x.idServicio === idServicio && x.asiento === asiento))[0];
      this.eliminarPasaje(pasajeAeliminar,way, idServicio, asiento, y, x, piso)
    }
    if(pasajeAeliminar.tipo === 'asociado'){
      let pasajeAeliminarMascota;
      pasajeAeliminarMascota = this.ticket.comprasDetalles
      .filter(x => (x.idServicio === idServicio && x.asiento === pasajeAeliminar.asientoAsociado))[0];
      this.eliminarPasaje(pasajeAeliminarMascota,way, idServicio, pasajeAeliminarMascota.asiento, pasajeAeliminarMascota.fila, pasajeAeliminarMascota.columna, piso)
    }    
  }
  eliminarPasaje(pasajeAeliminar, way, idServicio, asiento, y, x, piso) {
    let asientoToDelete = {
      servicio: pasajeAeliminar.idServicio,
      fecha: pasajeAeliminar.service.fechaSalida,
      origen: pasajeAeliminar.service.idTerminalOrigen,
      destino: pasajeAeliminar.service.idTerminalDestino,
      asiento: pasajeAeliminar.asiento,
      integrador: pasajeAeliminar.service.integrador
    };
    this.loading = true;
    this.integradorService.liberarAsiento(asientoToDelete).subscribe(resp => {
      this.loading = false;
    });
    console.log('this.ticket.comprasDetallesAntes', this.ticket.comprasDetalles);

    this.ticket.comprasDetalles = this.ticket.comprasDetalles
      .filter(x => !(x.idServicio === idServicio && x.asiento === asiento));

    console.log('this.ticket.comprasDetallesDespues', this.ticket.comprasDetalles);

    let total_general = 0;
    this.ticket.comprasDetalles.forEach(element => {
      total_general = total_general + element.valor;
    });
    this.tarifaTotal = total_general;

    this.mys.ticket = this.eliminarAsientoDeTicketCompras(this.ticket, way, idServicio, asiento, y, x, piso);
    this.eliminadoAsiento = true;


    if (total_general === 0) {
      this.next = '/home';
    }

  }

  volver() {
    this.router.navigateByUrl('/ticket');
  }

  eliminarAsientoDeTicketCompras(ticket, way, idServicio, asiento, y, x, piso) {
    let texto = way + '_' + idServicio + '_' + asiento;
    if (way === 'go') {
      ticket.goAllService.forEach(item => {
        if (item.idServicio === idServicio) {
          if(item.my_Bus != undefined){
            if(item.my_Bus[piso][y][x]['tipo'] === 'pet')            
              item.my_Bus[piso][y][x]['estado'] = 'pet-free';
            else
              item.my_Bus[piso][y][x]['estado'] = 'libre';          
            let index3 = item.my_comprasByService.indexOf(texto);
            if (index3 !== -1) { 
              item.my_comprasByService.splice(index3, 1); 
            }
          }
        }
      });
      let index3 = ticket.goCompras.indexOf(texto);
      if (index3 !== -1) { ticket.goCompras.splice(index3, 1); }
    } else {
      ticket.backAllService.forEach(item => {
        if (item.idServicio === idServicio) {
          if(item.my_Bus != undefined){
            if(item.my_Bus[piso][y][x]['tipo'] === 'pet')            
              item.my_Bus[piso][y][x]['estado'] = 'pet-free';
            else
              item.my_Bus[piso][y][x]['estado'] = 'libre';  
            let index3 = item.my_comprasByService.indexOf(texto);
            if (index3 !== -1) { 
              item.my_comprasByService.splice(index3, 1); 
            }
          }
        }
      });
      let index3 = ticket.backCompras.indexOf(texto);
      if (index3 !== -1) { ticket.backCompras.splice(index3, 1); }
    }
    return ticket;
  }

  async popMenu(event) {
    // console.log('event', event);
    const popoverMenu = await this.popoverCtrl.create({
      component: PopMenuComponent,
      event,
      mode: 'ios',
      backdropDismiss: true,
      cssClass: "popMenu"
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
    this.mys.temporalComprasCarrito = this.ticket.comprasDetalles;
    const popoverCart = await this.popoverCtrl.create({
      component: PopCartComponent,
      event,
      mode: 'ios',
      backdropDismiss: true,
      cssClass: "popCart"
    });
    await popoverCart.present();
  }

  comprarMasPasajes() {
    this.mys.comprarMas = true;
    this.router.navigateByUrl('/buy-your-ticket');
  }

  getItinerario(idServicio) {
    console.log('idServicio', idServicio);
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 1000);
    this.mys.showItinerario(idServicio);
  }

  agregarPromo(pasaje) {
    console.log('pasaje', pasaje);

    // variable para la api buscaCaluga
    let myData = {
      origen: this.mys.ticket.origin.codigo,
      destino: this.mys.ticket.destiny.codigo,
      fechaSalida: moment(this.mys.ticket.goDate).format("YYYYMMDD"),
      etapa: 2
    };
    console.log('myData', myData);

    this.loading = true;
    this.integradorService.buscaCaluga(myData).subscribe(respuestaBuscaCaluga => {

      // definiendo variables de tarifas
      let tarifaTotalNumero;
      let tarifaNormalNumero;
      let tarifaDiferencia;

      if (pasaje.piso === 1) {
        tarifaTotalNumero = parseInt(pasaje.service.idaVueltaPisoUno.tarifaTotal.replace('.', ''));
        tarifaNormalNumero = pasaje.service.tarifaPrimerPisoInternet.replace('.', '');
      } else {
        tarifaTotalNumero = parseInt(pasaje.service.idaVueltaPisoDos.tarifaTotal.replace('.', ''));
        tarifaNormalNumero = pasaje.service.tarifaSegundoPisoInternet.replace('.', '');
      }

      // calculando diferencia
      tarifaDiferencia = tarifaTotalNumero - tarifaNormalNumero;

      // Mostrando el mensaje para seleccionar si está de acuerdo o no al darle valor a promocionEtapa2
      let promoEtapa2 = respuestaBuscaCaluga[0];


      this.modalInfo.contenido = promoEtapa2['contenido'].replace('{1}', tarifaDiferencia.toLocaleString('de-DE'));
      this.modalInfo.image = promoEtapa2.urlImagen;
      this.modalInfo.titulo = promoEtapa2.titulo;
      this.modalInfo.pasaje = pasaje;
      this.modalInfo.tarifaTotal = tarifaTotalNumero;
      this.showPromocionModal = true;

      this.loading = false;
      console.log('modalInfo', this.modalInfo);
    });
  }


  btnEtapa2Si() {
    console.log('btn SI');
    this.showPromocionModal = false;

    this.mys.ticket.comprasDetalles.forEach(element => {
      if (element.idServicio === this.modalInfo.pasaje['idServicio'] && element.asiento === this.modalInfo.pasaje['asiento']) {
        element['valor'] = this.modalInfo.tarifaTotal;
        element['promocion'] = true;
      }
    });
    this.ionViewWillEnter();
  }

  btnEtapa2No() {
    console.log('btn NO');
    this.showPromocionModal = false;
    this.modalInfo = {
      image: '',
      titulo: '',
      contenido: '',
      tarifaTotal: '',
      pasaje: {},
    };
  }

  datosPasajero(pasaje){
    pasaje.checked = !pasaje.checked;
  }
  buscarDatosPasajero(pasajero){
    let datoPasajero:any;
    let passenger = {
      tipoDocumento: pasajero.tipoDocumento,
      documento: pasajero.documento.replace(/\./gi, '')
    }
    console.log("buscarDatosPasajero ", passenger)
    this.integradorService.buscarPasajero(passenger).subscribe(
      resp => datoPasajero = resp,
      error => console.log(error),
      ()=>{
        console.log(datoPasajero);
        if (datoPasajero.documento != null) {
          pasajero.numeroDocumento = datoPasajero.documento
          pasajero.nombre = datoPasajero.nombres
          pasajero.apellido = datoPasajero.paterno + ' ' + datoPasajero.materno
          pasajero.nacionalidad = datoPasajero.nacionalidad
          pasajero.email = datoPasajero.email
          pasajero.comunaOrigen = datoPasajero.comuna
          this.listaComuna.forEach(comuna => {
            if(comuna.codigo === datoPasajero.comuna){
              pasajero.comunaOrigenDescripcion = comuna.nombre;
            }
          })
          pasajero.telefono = datoPasajero.telefono
          pasajero.comunaDestino = undefined
          pasajero.direccion = datoPasajero.direccion
          pasajero.terms = false;
          pasajero.telefonoEmergencia = undefined
        }else{
          this.limpiarDatosPasajero(pasajero,'');
        }
      }
    )
  }
  guardarDatosPasajero(pasajero){
    let mensaje : any;
    console.log(pasajero)
    if(this.validarForm(pasajero)){
      this.integradorService.guardarRelacionPasajero(pasajero).subscribe(
        resp => mensaje = resp,
        error => console.log(error),
        ()=>{
          if(mensaje.exito){
            this.mys.alertShow(
              'Éxito!!',
              'checkmark-circle',
              mensaje.mensaje
            );
          }else{
            this.mys.alertShow(
              'Error!!',
              'alert',
              mensaje.mensaje
            );
          }
        }
      )
    }
  }

  validarForm(pasajero){
    if(pasajero.tipoDocumento === ""){
      this.mys.alertShow(
        'Error!!',
        'alert',
        'Debe ingresar tipo de documento del pasajero.'
      );
      return false;
    }
    if(pasajero.documento === ""){
      this.mys.alertShow(
        'Error!!',
        'alert',
        'Debe ingresar numero de documento del pasajero.'
      );
      return false;
    }
    pasajero.numeroDocumento = pasajero.documento.replace(/\./gi, '');
    if(pasajero.nombre === ""){
      this.mys.alertShow(
        'Error!!',
        'alert',
        'Debe ingresar nombre del pasajero.'
      );
      return false;
    }
    if(pasajero.apellido === ""){
      this.mys.alertShow(
        'Error!!',
        'alert',
        'Debe ingresar apellido del pasajero.'
      );
      return false;
    }
    return true;
  }

  limpiarDatosPasajero(pasajero, option) {
    console.log("limpiar", pasajero)
    if (option === 'ALL') {
      pasajero.tipoDocumento = 'R'
      pasajero.numeroDocumento = ''
      pasajero.documento = ''
    }
    pasajero.nombre = ''
    pasajero.apellido = ''
    pasajero.nacionalidad = ''
    pasajero.email = ''
    pasajero.comunaOrigen = ''
    pasajero.comunaOrigenDescripcion = ''
    pasajero.telefono = ''
    pasajero.telefonoEmergencia = ''
    pasajero.comunaDestino = ''
    pasajero.comunaDestinoDescripcion = ''
    pasajero.terms = false;
  }

  rutFunction(rawValue) {
    let numbers = rawValue.match(/\d|k|K/g);
    let numberLength = 0;
    if (numbers) {
      numberLength = numbers.join('').length;
    }
    if (numberLength > 8) {
      return [
        /[1-9]/,
        /\d/,
        '.',
        /\d/,
        /\d/,
        /\d/,
        '.',
        /\d/,
        /\d/,
        /\d/,
        '-',
        /[0-9|k|K]/,
      ];
    } else {
      return [
        /[1-9]/,
        '.',
        /\d/,
        /\d/,
        /\d/,
        '.',
        /\d/,
        /\d/,
        /\d/,
        '-',
        /[0-9|k|K]/,
      ];
    }
  }
  validar(tecla, tipo) {
    let patron
    switch (tipo) {
      case 'rut':
        patron = /[\dKk-]/
        break //Solo acepta n�meros, K y guion
      case 'telefono':
        patron = /[\d+]/
        break //Solo acepta números y punto
    }
    var charCode = tecla.which ? tecla.which : tecla.keyCode
    if (charCode != 8) {
      let aux = String.fromCharCode(charCode)
      console.log(patron.test(aux))
      if (patron.test(aux)) {
        return true
      } else {
        tecla.preventDefault()
      }
    } else {
      return true
    }
  }

  showSelection = false;
  listaComunaFiltrada;
  pasajeroEdit:any;
  type=''

  teclaInput($event) {
    if ($event.target.value.length === 0) {
      this.listaComunaFiltrada = this.listaComuna;
    } else {
      let filtradox = [];
      let minuscula1 = $event.target.value.toLowerCase().trim();
      this.listaComuna.forEach(element => {
        let minuscula2 = element.nombre.toLowerCase().trim();
        minuscula2.includes(minuscula1) ? filtradox.push(element) : null;
      });
      this.listaComunaFiltrada = filtradox;
    }
  }

  seleccion(item) {
    if (this.type  === 'origen') {
      this.showSelection = false;      
      this.pasajeroEdit.comunaOrigen = item.codigo;
      this.pasajeroEdit.comunaOrigenDescripcion = item.nombre;
      console.log('Origen : ' + item)
    } else if(this.type  === 'destino') {
      this.showSelection = false;      
      console.log('Destino : ' + item)
      this.pasajeroEdit.comunaDestino = item.codigo;
      this.pasajeroEdit.comunaDestinoDescripcion = item.nombre;
    }  
  }

  btnSelecccionar(type,pasajero) {  
    this.type = type
    this.pasajeroEdit = pasajero;  
    this.listaComunaFiltrada = this.listaComuna
    this.showSelection = true;
  }

  atras() {
    if (this.showSelection) {
      this.showSelection = false;
    }
  }
}
