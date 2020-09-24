import { Component, OnInit } from '@angular/core';
import { element } from 'protractor';
import { MyserviceService } from 'src/app/service/myservice.service';
import * as _ from 'underscore';
import * as moment from 'moment';
import { IntegradorService } from 'src/app/service/integrador.service';
import { Router } from '@angular/router';
import { PopMenuComponent } from 'src/app/components/pop-menu/pop-menu.component';
import { PopCartComponent } from 'src/app/components/pop-cart/pop-cart.component';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-my-data',
  templateUrl: './my-data.page.html',
  styleUrls: ['./my-data.page.scss'],
})
export class MyDataPage implements OnInit {
  pageMyDataAsRegister = false;
  nombreUsuario = 'Usuario';
  usuario;
  loading = false;
  myData = {
    rut: '',
    email: '',
    nombre: '',
    apellidoMaterno: '',
    apellidoPaterno: '',
    estado: 'ACT',
    fechaCreacion: '',
    fechaNacimiento: '',
    fechaActivacion: '',
    password: '',
    clave: '',

    telefono: '',
    celular: '',
    region: '',
    ciudad: '',

    dia: '',
    mes: '',
    anio: '',
    genero: '',
  };

  ciudadesEspecificas = [];
  regionesAll;
  diaOptions = { header: 'Elige el día', mode: 'ios' };
  mesOptions = { header: 'Elige el mes', mode: 'ios' };
  anioOptions = { header: 'Elige el año', mode: 'ios' };
  regionOptions = { header: 'Elija su región', mode: 'ios' };
  cityOptions = { header: 'Elija su ciudad', mode: 'ios' };

  showBox = true;

  constructor(
    private mys: MyserviceService,
    private integrador: IntegradorService,
    private router: Router,
    private popoverCtrl: PopoverController
  ) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.integrador.buscarRegionesRegistroDeUsuario().subscribe((regiones) => {
      this.regionesAll = _.sortBy(regiones, 'descripcion');
    });

    this.myData = {
      rut: '',
      email: '',
      nombre: '',
      apellidoMaterno: '',
      apellidoPaterno: '',
      estado: 'ACT',
      fechaCreacion: '',
      fechaNacimiento: '',
      fechaActivacion: '',
      password: '',
      clave: '',

      telefono: '',
      celular: '',
      region: '',
      ciudad: '',

      dia: '',
      mes: '',
      anio: '',
      genero: '',
    };

    this.mys.checkIfExistUsuario().subscribe((existe) => {
      if (existe) {
        this.pageMyDataAsRegister = false;
        this.loading = true;
        this.mys.getUser().subscribe((usuario) => {
          this.loading = false;
          this.usuario = usuario;
          console.log(this.usuario)
          this.myData.email = usuario.usuario.email;

          this.myData.nombre = this.titleCase(usuario.usuario.nombre);
          this.myData.apellidoPaterno = this.titleCase(
            usuario.usuario.apellidoPaterno
          );
          this.myData.apellidoMaterno = this.titleCase(
            usuario.usuario.apellidoMaterno
          );          
          this.myData.estado = usuario.usuario.estado;
          this.myData.rut = usuario.usuario.rut;
          this.myData.dia = moment
            .utc(usuario.usuario.fechaNacimiento)
            .format('D');
          this.myData.mes = moment
            .utc(usuario.usuario.fechaNacimiento)
            .format('M');
          this.myData.anio = moment
            .utc(usuario.usuario.fechaNacimiento)
            .format('YYYY');
          this.myData.fechaNacimiento = moment
            .utc(usuario.usuario.fechaNacimiento)
            .toISOString();
          this.myData.fechaCreacion = moment
            .utc(usuario.usuario.fechaCreacion)
            .format('DD-MM-YYYY');
          this.myData.fechaActivacion = moment
            .utc(usuario.usuario.fechaActivacion)
            .format('DD-MM-YYYY');
          this.myData.genero = usuario.usuario.genero;
          this.myData.telefono = usuario.usuario.telefono || '';
          this.myData.celular = usuario.usuario.telefono || '';
          this.myData.ciudad = usuario.usuario.ciudadCodigo || '';
          this.myData.region = usuario.usuario.regionCodigo || '';

          this.cambioDeRegion();

          if (usuario.usuario.nombre && usuario.usuario.apellidoPaterno) {
            this.nombreUsuario =
              usuario.usuario.nombre + ' ' + usuario.usuario.apellidoPaterno;
          } else {
            this.nombreUsuario = 'Usuario';
          }
        });
      } else {
        this.pageMyDataAsRegister = true;
      }
    });
  }


  genero($event) { }

  validar(forma) {
    this.myData.fechaNacimiento = `${this.myData.dia}-${this.myData.mes}-${this.myData.anio}`;

    if (forma.controls.rut.errors) {
      this.mys.alertShow('Verifique!! ', 'alert', 'Introduzca un RUT válido'); // } else if (rut valido) {//console.log('rut valido');
    } else if (forma.controls.nombre.errors) {
      this.mys.alertShow(
        'Verifique!! ',
        'alert',
        'Introduzca un nombre válido'
      );
    } else if (forma.controls.apellidoPaterno.errors) {
      this.mys.alertShow(
        'Verifique!! ',
        'alert',
        'Introduzca un apellido Paterno válido'
      );
    } else if (forma.controls.apellidoMaterno.errors) {
      this.mys.alertShow(
        'Verifique!! ',
        'alert',
        'Introduzca un apellido materno válido'
      );
    } else if (
      !moment(
        this.myData.fechaNacimiento,
        ['DD-MM-YYYY', 'D-MM-YYYY', 'D-M-YYYY', 'DD-M-YYYY'],
        true
      ).isValid()
    ) {
      this.mys.alertShow(
        'Verifique!! ',
        'alert',
        'Verifique que la fecha de nacimiento sea válida'
      );
    } else if (forma.controls.email.errors) {
      this.mys.alertShow('Verifique!! ', 'alert', 'Introduzca un email válido');
    } else if (forma.controls.celular.errors && this.myData.celular !== '+56') {
      this.mys.alertShow(
        'Verifique!! ',
        'alert',
        'Verifique el celular e intente nuevamente..<br> ingrese de 6 a 9 caracteres sin código de país'
      );
    } else if (forma.controls.region.errors) {
      this.mys.alertShow(
        'Verifique!! ',
        'alert',
        'Introduzca una región válida para continuar.'
      );
    } else if (forma.controls.ciudad.errors) {
      this.mys.alertShow(
        'Verifique!! ',
        'alert',
        'Introduzca una ciudad válida para continuar.'
      );
    } else {

      let objetoAenviar = {
        rut: this.myData.rut,
        email: this.myData.email,
        nombre: this.myData.nombre,
        apellidoPaterno: this.myData.apellidoPaterno,
        apellidoMaterno: this.myData.apellidoMaterno,
        fechaNacimiento: moment
          .utc(
            `${this.myData.dia}-${this.myData.mes}-${this.myData.anio}`,
            'DD-MM-YYYY'
          )
          .format('YYYY-MM-DDTSS:SS:SS.SSS+SSSS'),
        genero: this.myData.genero,
        telefono: this.myData.celular,
        ciudadCodigo: this.myData.ciudad || '',
        regionCodigo: this.myData.region || '',
      };

      if (!this.pageMyDataAsRegister) {
        // objetoAenviar['direccion'] = this.myData.direccion
        objetoAenviar['estado'] = this.myData.estado;
        objetoAenviar['fechaCreacion'] = moment
          .utc(this.myData.fechaCreacion, 'DD-MM-YYYY')
          .format('YYYY-MM-DDTSS:SS:SS.SSS+SSSS');
        objetoAenviar['fechaActivacion'] = moment
          .utc(this.myData.fechaActivacion, 'DD-MM-YYYY')
          .format('YYYY-MM-DDTSS:SS:SS.SSS+SSSS');
        objetoAenviar['direccion'] = 'Sininfo';
        objetoAenviar[
          'nombreCompleto'
        ] = `${this.myData.nombre} ${this.myData.apellidoPaterno} ${this.myData.apellidoMaterno}`;
      }

      if (this.pageMyDataAsRegister) {
        this.loading = true;
        this.integrador
          .usuarioInscribir(objetoAenviar)
          .subscribe((respuesta: any) => {
            this.loading = false;

            if (respuesta.exito) {
              this.mys.closeSessionUser().subscribe((cerrado) => {

                this.mys.alertShow(
                  'Éxito!!',
                  'checkmark-circle',
                  'Usuario Registrado Exitosamente..'
                );
                this.router.navigateByUrl('/home');
              });
            } else {
              this.mys.alertShow(
                'Error ',
                'alert',
                respuesta.mensaje ||
                'Hubo un error al guardar los datos del usuario..'
              );
            }
          });
      } else {
        this.loading = true;
        this.integrador
          .usuarioGuardar(objetoAenviar)
          .subscribe((respuesta: any) => {
            this.loading = false;
            console.log(respuesta)
            if (respuesta.exito) {
              this.usuario.usuario.rut = objetoAenviar.rut;
              this.usuario.usuario.nombre = objetoAenviar.nombre;
              this.usuario.usuario.apellidoPaterno =
                objetoAenviar.apellidoPaterno;
              this.usuario.usuario.apellidoMaterno =
                objetoAenviar.apellidoMaterno;
              this.usuario.usuario.email = objetoAenviar.email;
              this.usuario.usuario.estado = 'ACT'
              this.usuario.usuario.genero = objetoAenviar.genero;
              this.usuario.usuario.telefono = objetoAenviar.telefono;
              // this.usuario.usuario.celular = objetoAenviar.celular
              this.usuario.usuario.ciudadCodigo = objetoAenviar.ciudadCodigo;
              this.usuario.usuario.regionCodigo = objetoAenviar.regionCodigo;

              this.usuario.usuario.fechaNacimiento =
                objetoAenviar.fechaNacimiento;

              this.mys.closeSessionUser().subscribe((cerrado) => {
                this.mys.saveUsuario(this.usuario).subscribe((guardado) => {
                  if (guardado) {
                    // console.log('guardadooooooo');
                    this.mys.alertShow(
                      'Éxito!!',
                      'checkmark-circle',
                      'Datos Actualizados exitosamente..'
                    );
                    this.ionViewWillEnter();
                  } else {
                    this.mys.alertShow(
                      'Error!!',
                      'alert',
                      'Hubo inconvenientes al actualizar los datos..'
                    );
                  }
                });
              });

            } else {
              this.mys.alertShow(
                'Error ',
                'alert',
                respuesta.mensaje ||
                'Hubo un error al guardar los datos del usuario..'
              );
            }
          });
      }
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

    // recibo la variable desde el popover y la guardo en data
    // const { data } = await popoverCart.onWillDismiss();
    // this.router.navigateByUrl(data.destino);
  }

  /**
   *  para cambiar nombres y apellidos a titulo capital
   * @param str
   */
  titleCase(str) {
    if(str != undefined){
      return str.toLowerCase().replace(/\b(\w)/g, (s) => s.toUpperCase());
    }else{
      return "";
    }    
  }

  cambioDeRegion() {
    this.loading = true;
    this.integrador
      .buscarCiudadPorRegionesRegistroDeUsuario({ codigo: this.myData.region })
      .subscribe((ciudades) => {
        this.loading = false;
        this.ciudadesEspecificas = _.sortBy(ciudades, 'nombre');
      });
  }

  prueba(event) {
    console.log('pruebaaaaxx', event);
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

  onClickedOutside(e: Event) {
    this.showBox = false;
    console.log('ACCCION');
  }
} // fin clase ppal
