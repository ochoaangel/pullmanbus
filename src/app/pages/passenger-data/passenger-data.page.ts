import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import * as _ from 'underscore';
import { Router } from '@angular/router';
import { MyserviceService } from 'src/app/service/myservice.service';
import { IntegradorService } from 'src/app/service/integrador.service';

@Component({
  selector: 'app-passenger-data',
  templateUrl: './passenger-data.page.html',
  styleUrls: ['./passenger-data.page.scss'],
})
export class PassengerDataPage implements OnInit {
  boleto = '';
  verBoleto = false;
  loading = false;
  pasajero = {
    validForm: false,
    tipoDocumento: 'R',
    documento: '',
    comuna: '',
    direccion: '',
    email: '',
    materno: '',
    nacionalidad: '',
    nombres: '',
    paterno: '',
    telefono: '',
    numeroDocumento:'',
    nombre:'',
    apellido:'',
    telefonoEmergencia:'',
    comunaOrigen:'',
    comunaOrigenDescripcion:'',
    comunaDestino:'',
    comunaDestinoDescripcion:''
  }
  listaTipoDocumento = [];
  listaNacionalidad = [];
  listaComuna = [];
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    public mys: MyserviceService,
    private integradorService: IntegradorService  
  ) {
    this.loading = false;
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

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.boleto = '';
    this.verBoleto = false;
    this.limpiarDatosPasajero('ALL')
  }

  buscarDatosBoleto(){
    if(this.boleto != ''){
      let data : any;
      this.integradorService.buscarRegistroPasajero(this.boleto).subscribe(
        resp => data = resp,
        error => console.log(error),
        ()=>{
          if(data.mensaje.exito){
            this.pasajero = {...data.registro}
            this.pasajero.numeroDocumento = this.pasajero.documento
            this.listaComuna.forEach(comuna => {
              if(comuna.codigo === this.pasajero.comunaOrigen){
                this.pasajero.comunaOrigenDescripcion = comuna.nombre;
              }
              if(comuna.codigo === this.pasajero.comunaDestino){
                this.pasajero.comunaDestinoDescripcion = comuna.nombre;
              }
            })
            this.verBoleto = true;
          }else{
            this.mys.alertShow(
              'Error!!',
              'alert',
              data.mensaje.mensaje
            );
          }
        }
      )
    }else{
      this.mys.alertShow(
        'Error!!',
        'alert',
        'Debe ingresar Boleto.'
      );
    }
  }
  datosPasajero(pasaje){
    pasaje.checked = !pasaje.checked;
  }
  buscarDatosPasajero(){
    let datoPasajero:any;
    let passenger = {
      tipoDocumento: this.pasajero.tipoDocumento,
      documento: this.pasajero.documento.replace(/\./gi, '')
    }
    console.log("buscarDatosPasajero ", passenger)
    this.integradorService.buscarPasajero(passenger).subscribe(
      resp => datoPasajero = resp,
      error => console.log(error),
      ()=>{
        console.log(datoPasajero);
        if (datoPasajero.documento != null) {
          this.pasajero.numeroDocumento = datoPasajero.documento
          this.pasajero.nombre = datoPasajero.nombres
          this.pasajero.apellido = datoPasajero.paterno + ' ' + datoPasajero.materno
          this.pasajero.nacionalidad = datoPasajero.nacionalidad
          this.pasajero.email = datoPasajero.email
          this.pasajero.comunaOrigen = datoPasajero.comuna
          this.listaComuna.forEach(comuna => {
            if(comuna.codigo === datoPasajero.comuna){
              this.pasajero.comunaOrigenDescripcion = comuna.nombre;
            }
          })
          this.pasajero.telefono = datoPasajero.telefono
          this.pasajero.comunaDestino = undefined
          this.pasajero.direccion = datoPasajero.direccion
          this.pasajero.telefonoEmergencia = undefined
        }
      }
    )
  }
  atras() {
    if (this.showSelection) {
      this.showSelection = false;
    }
  }
  volver() {
    this.router.navigateByUrl('/ticket-management');
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
  guardarDatosPasajero(){
    let passenger = {
      boleto : this.boleto,
      comunaDestino : this.pasajero.comunaDestino,
      comunaOrigen : this.pasajero.comunaOrigen,
      documento : this.pasajero.numeroDocumento,
      email : this.pasajero.email,
      nacionalidad : this.pasajero.nacionalidad,
      nombre : this.pasajero.nombre,
      apellido : this.pasajero.apellido,
      telefono : this.pasajero.telefono,
      telefonoEmergencia : this.pasajero.telefonoEmergencia,
      tipoDocumento : this.pasajero.tipoDocumento
    }
    let data : any;
    this.integradorService.modificarRegistroPasajero(passenger).subscribe(
      resp => data = resp,
      error => console.log(error),
      ()=>{
        if(data.exito){
          this.mys.alertShow('Éxito!! ', 'alert', 'Datos modificados correctamente');
          this.limpiarDatosPasajero('ALL');
          this.verBoleto = false;
          window.scroll(0, 0)
        }else{
          this.mys.alertShow('Error!!','alert','Error al modificar datos.');
        }
      }
    )
  }
  limpiarDatosPasajero(option) {
    console.log("limpiar", this.pasajero)
    if (option === 'ALL') {
      this.pasajero.tipoDocumento = 'R'
      this.pasajero.numeroDocumento = ''
      this.pasajero.documento = ''
    }
    this.pasajero.nombre = ''
    this.pasajero.apellido = ''
    this.pasajero.nacionalidad = ''
    this.pasajero.email = ''
    this.pasajero.comunaOrigen = ''
    this.pasajero.comunaOrigenDescripcion = ''
    this.pasajero.telefono = ''
    this.pasajero.telefonoEmergencia = ''
    this.pasajero.comunaDestino = ''
    this.pasajero.comunaDestinoDescripcion = ''
  }

  showSelection = false;
  listaComunaFiltrada;
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
      this.pasajero.comunaOrigen = item.codigo;
      this.pasajero.comunaOrigenDescripcion = item.nombre;
      console.log('Origen : ' + item)
    } else if(this.type  === 'destino') {
      this.showSelection = false;      
      console.log('Destino : ' + item)
      this.pasajero.comunaDestino = item.codigo;
      this.pasajero.comunaDestinoDescripcion = item.nombre;
    }  
  }

  btnSelecccionar(type) {  
    this.type = type
    this.listaComunaFiltrada = this.listaComuna
    this.showSelection = true;
  }
}