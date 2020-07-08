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
  selector: 'app-contact-form',
  templateUrl: './contact-form.page.html',
  styleUrls: ['./contact-form.page.scss'],
})
export class ContactFormPage implements OnInit {


  usuario;
  loading = false;

  myData = {
    apellidoPaterno: '',
    apellidoMaterno: '',
    boleto: '',
    celular: '',
    email: '',
    motivo: '',
    nombre: '',
    nota: '',
    rut: '',
    telefono: '',
  };
  //  this.myData = {
  //      apellidoPaterno: 'Corona',
  //      apellidoMaterno: 'Gamarra',
  //      boleto: 'INT000741',
  //      celular: '+569444444444',
  //      email: 'romulocg25@gmail.com',
  //      motivo: 'Devolución de boleto',
  //      nombre: 'Rómulo Gabriel',
  //      nota: 'PRUEBA',
  //      rut: '17322605-5',
  //      telefono: '245765881'
  //    };

  constructor(
    private mys: MyserviceService,
    private integrador: IntegradorService,
    private router: Router,
    private popoverCtrl: PopoverController
  ) { }

  ngOnInit() { }

  ionViewWillEnter() {


    this.myData = {
      apellidoPaterno: '',
      apellidoMaterno: '',
      boleto: '',
      celular: '',
      email: '',
      motivo: '',
      nombre: '',
      nota: '',
      rut: '',
      telefono: '',
    };

  }


  genero($event) { }

  validar(forma) {
    console.log('forma', forma);
    // console.log('this.myData.fechaNacimiento', this.myData.fechaNacimiento);

    if (this.myData.apellidoPaterno.length < 3) {
      this.mys.alertShow('Verifique!! ', 'alert', 'Introduzca un apellido paterno válido.');
    } else if (this.myData.apellidoMaterno.length < 3) {
      this.mys.alertShow('Verifique!! ', 'alert', 'Introduzca un apellido materno válido.');
    } else if (this.myData.boleto.length < 5) {
      this.mys.alertShow('Verifique!! ', 'alert', 'Introduzca un boleto válido');
    } else if (this.myData.celular.length < 5) {
      this.mys.alertShow('Verifique!! ', 'alert', 'Introduzca un teléfono móvil válido.');
    } else if (this.myData.telefono.length < 5) {
      this.mys.alertShow('Verifique!! ', 'alert', 'Introduzca un telefono de casa válido ');
    } else if (this.myData.rut.length < 8) {
      this.mys.alertShow('Verifique!! ', 'alert', 'Introduzca un rut válido');
    } else if (forma.form.controls.email.status === 'INVALID') {
      this.mys.alertShow('Verifique!! ', 'alert', 'Introduzca un correo válido. ');
    } else if (this.myData.nombre.length < 3) {
      this.mys.alertShow('Verifique!! ', 'alert', 'Introduzca un nombre válido.');
    } else if (this.myData.nota.length < 10) {
      this.mys.alertShow('Verifique!! ', 'alert', 'Introduzca mas detalles en la nota.');
    } else {

      let objetoAenviar = {
        apellidoPaterno: this.myData.apellidoPaterno || '',
        apellidoMaterno: this.myData.apellidoMaterno || '',
        boleto: this.myData.boleto || '',
        celular: this.myData.celular || '',
        email: this.myData.email || '',
        motivo: this.myData.motivo || '',
        nombre: this.myData.nombre || '',
        nota: this.myData.nota || '',
        rut: this.myData.rut || '',
        telefono: this.myData.telefono || '',
      };


      console.log('objetoAenviar', objetoAenviar);

      this.integrador.enviarContacto(objetoAenviar).subscribe((x: any) => {
        if (x.exito) {
          this.mys.alertShow('Éxito!! ', 'alert', 'Contacto enviado exitosamente');
          this.router.navigateByUrl('/home');
        }
      });

    }

    // }
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



