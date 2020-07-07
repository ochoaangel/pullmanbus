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
    documento: '',
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
      documento: '',
      descripcion: '',

    };

  }


  genero($event) { }

  validar(forma) {
    // console.log('forma', forma);
    // console.log('this.myData.fechaNacimiento', this.myData.fechaNacimiento);

    if (forma.controls.rut.errors) {
      this.mys.alertShow('Verifique!! ', 'alert', 'Introduzca un RUT válido');
    } else if (forma.controls.nombre.errors) {
      this.mys.alertShow('Verifique!! ', 'alert', 'Introduzca un nombre válido');
    } else if (forma.controls.email.errors) {
      this.mys.alertShow('Verifique!! ', 'alert', 'Introduzca un email válido');
    } else if (forma.controls.celular.errors && this.myData.celular !== '+56') {
      this.mys.alertShow('Verifique!! ', 'alert', 'Verifique el celular e intente nuevamente..<br> ingrese de 6 a 9 caracteres sin código de país');
    } else if (!this.myData.documento) {
      this.mys.alertShow('Verifique!! ', 'alert', 'Introduzca el tipo de documento adecuado.');
    } else if (forma.controls.descripcion.errors) {
      this.mys.alertShow('Verifique!! ', 'alert', 'Introduzca una ciudad válida para continuar.');
    } else {




      let objetoAenviar = {
        tipoSolicitud: 2,
        solicitante: this.myData.nombre,
        rut: this.myData.rut,
        telefono: this.myData.celular,
        email: this.myData.email,
        descripcion: this.myData.descripcion,
        estado: '1',
        // fechaSolicitud: '2020-04-01T03:00:00.000+0000',
        fechaSolicitud: moment().format('YYYY-MM-DDTHH:mm:00.000+0000'),
        responsable: 'null'
      }


      console.log('objetoAenviar', objetoAenviar);

      this.integrador.guardarSolicitud(objetoAenviar).subscribe((x: any) => {
        if (x.exito) {
          this.mys.alertShow('Éxito!! ', 'alert', 'Solicitud enviada exitosamente');
          this.router.navigateByUrl('/home');

        } else {
          this.mys.alertShow('Verifique!! ', 'alert', 'Introduzca una ciudad válida para continuar.');

        }
      });


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
      return [/[1-9]/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /[0-9|k|K]/,
      ];
    } else {
      return [/[1-9]/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /[0-9|k|K]/,
      ];
    }
  }



}
