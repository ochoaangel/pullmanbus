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
  selector: 'app-special-trip',
  templateUrl: './special-trip.page.html',
  styleUrls: ['./special-trip.page.scss'],
})
export class SpecialTripPage implements OnInit {

  usuario;
  loading = false;

  myData = {
    rut: '',
    email: '',
    nombre: '',
    celular: '',
    documentoC: true,
    documentoO: false,
    descripcion: '',

  };

  constructor(
    private mys: MyserviceService,
    private integrador: IntegradorService,
    private router: Router,
    private popoverCtrl: PopoverController
  ) { }

  ngOnInit() { }


  ionViewWillEnter() {


    this.myData = {
      rut: '',
      email: '',
      nombre: '',
      celular: '',
      documentoC: true,
      documentoO: false,
      descripcion: '',

    };

  }


  validar(forma) {
    if (this.myData.documentoC && (this.myData.rut.length > 12 || this.myData.rut.length < 11)) {
      this.mys.alertShow('Verifique!! ', 'alert', 'Introduzca un RUT válido');
    } else if (this.myData.documentoO && (this.myData.rut.length > 15 || this.myData.rut.length < 7)) {
      this.mys.alertShow('Verifique!! ', 'alert', 'Introduzca un RUT válido');
    } else if (forma.controls.nombre.errors) {
      this.mys.alertShow('Verifique!! ', 'alert', 'Introduzca un nombre válido');
    } else if (forma.controls.email.errors) {
      this.mys.alertShow('Verifique!! ', 'alert', 'Introduzca un email válido');
    } else if (forma.controls.celular.errors && this.myData.celular !== '+56') {
      this.mys.alertShow('Verifique!! ', 'alert', 'Verifique el celular e intente nuevamente..<br> ingrese de 6 a 10 caracteres sin código de país');
    } else if ((this.myData.documentoC && this.myData.documentoO) || (!this.myData.documentoC && !this.myData.documentoO)) {
      this.mys.alertShow('Verifique!! ', 'alert', 'Introduzca el tipo de documento adecuado.');
    } else if (forma.controls.descripcion.errors) {
      this.mys.alertShow('Verifique!! ', 'alert', 'Introduzca una ciudad válida para continuar.');
    } else {

      let objetoAenviar = {
        tipoSolicitud: 2,
        solicitante: this.myData.nombre,
        rut: this.myData.rut.replace(/\./g, ''),
        telefono: this.myData.celular,
        email: this.myData.email,
        descripcion: this.myData.descripcion,
        estado: '1',
        fechaSolicitud: moment().format('YYYY-MM-DDTHH:mm:00.000+0000'),
        responsable: 'null'
      }

      this.integrador.guardarSolicitud(objetoAenviar).subscribe((x: any) => {
        if (x.exito) {
          this.mys.alertShow('Éxito!! ', 'alert', 'Solicitud enviada exitosamente');
          this.router.navigateByUrl('/home');

        } else {
          this.mys.alertShow('Verifique!! ', 'alert', 'Intente nuevamente..');
        }
      });

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



  prueba(event) {
    console.log('pruebaaaaxx', event);
  }


  rutFunction(rawValue) {
    let numbers = rawValue.match(/\d/g);
    let numberLength = 0;
    if (numbers) {
      numberLength = numbers.join('').length;
    }
    if (numberLength > 8) {
      return [/[1-9]/, /[0-9]/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/];
    } else {
      return [/[1-9]/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/];
    }
  }

  rutFunctionNo(rawValue) {
    let numbers = rawValue.match(/\d/g);
    let numberLength = 0;
    if (numbers) {
      numberLength = numbers.join('').length;
    }
    return [/[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/];
  }


  cambioTipoDocumento(btn) {
    switch (btn) {
      case 'C':
        this.myData.documentoO = this.myData.documentoC;
        break;

      case 'O':
        this.myData.documentoC = this.myData.documentoO;
        break;

      default:
        break;
    }
  }

}
