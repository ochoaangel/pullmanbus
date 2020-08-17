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
    rut: '',
    nombre: '',
    email: '',
    celular: '',
    nota: '',
    motivo: '',

    apellidoPaterno: '',
    apellidoMaterno: '',
    boleto: '',
    telefono: '',
  };

  constructor(
    private mys: MyserviceService,
    private router: Router,
    private integrador: IntegradorService,
    private popoverCtrl: PopoverController
  ) {

    this.mys.carritoEliminar.subscribe(eliminar => {
      console.log('Eliminado desde dentro de tickets', eliminar);

      // dejar cuando tien compra detalles
      this.mys.temporalComprasCarrito = this.mys.temporalComprasCarrito.filter(x => !(x.idServicio === eliminar.idServicio && x.asiento === eliminar.asiento));

      this.mys.liberarAsientoDesdeHeader(eliminar);
    })



  }

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
    if (this.myData.celular.length < 5) {
      this.mys.alertShow('Verifique!! ', 'alert', 'Introduzca un teléfono móvil válido.');
    } else if (this.myData.rut.length < 8) {
      this.mys.alertShow('Verifique!! ', 'alert', 'Introduzca un rut válido');
    } else if (forma.form.controls.email.status === 'INVALID') {
      this.mys.alertShow('Verifique!! ', 'alert', 'Introduzca un correo válido. ');
    } else if (this.myData.nombre.length < 3) {
      this.mys.alertShow('Verifique!! ', 'alert', 'Introduzca un nombre válido.');
    } else if (this.myData.nota.length < 10) {
      this.mys.alertShow('Verifique!! ', 'alert', 'Introduzca mas detalles en la nota.');
    } else if (this.myData.motivo.length < 10) {
      this.mys.alertShow('Verifique!! ', 'alert', 'Introduzca mas detalles en Motivo.');
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
  }



  prueba(event) {
    console.log('pruebaaaaxx', event);
  }

  rutFunctionFinal(rawValue: string) {
    // console.log('rawValue', rawValue);
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



}



