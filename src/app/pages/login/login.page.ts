import { Component, OnInit } from '@angular/core';
import { IntegradorService } from 'src/app/service/integrador.service';
import { Router } from '@angular/router';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Platform, PopoverController } from '@ionic/angular';
import { MyserviceService } from 'src/app/service/myservice.service';
import { PopMenuComponent } from 'src/app/components/pop-menu/pop-menu.component';
import { PopCartComponent } from 'src/app/components/pop-cart/pop-cart.component';
import { Form } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  // mydata = { username: "mauricio.fuentes@pullmancosta.cl", password: "CostaGps+2019" }
  mydata = { usuario: '', password: '' };
  showUsuarioError = false;
  showNoLoginError = '';
  loading = false;

  // login =
  //   {
  //     email: 'correo@correo.com',
  //     password: '1234567890'
  //   }
  // data =
  // {
  //   genere:'M',
  //   city:'city',
  //   region:'region',
  //   rut:'xxxxxxxxx',
  //   firstName:'Carlos',
  //   lastNameP:'Pérez',
  //   lastNameM:'Pérez',
  //   birth:'1990/12/31',
  //   occupation:'Student',
  //   phone: '+261112223344',
  //   mobile:'+881112223344',
  //   email:'correo@correo.com',
  // }

  constructor(
    private integradorService: IntegradorService,
    private router: Router,
    private nativeStorage: NativeStorage,
    public platform: Platform,
    public mys: MyserviceService,
    private popoverCtrl: PopoverController
  ) {
    // console.log('pasó por Constructor');
  }

  ngOnInit() {
    // console.log('pasó por ngOnInit');
  }

  ionViewWillEnter() {
    // console.log('pasó por ionViewWillEnter');

    this.mys.checkIfExistUsuario().subscribe((exist) => {
      exist
        ? this.router.navigateByUrl('/user-panel')
        : console.log('No existe usuario logeado..');
    });
  }

  enviar() { }

  validar(forma) {
    // console.log(forma)
    forma.controls.usuario.invalid ? (this.showUsuarioError = true) : null;

    if (forma.valid) {
      this.loading = true;
      // console.log('this.mydata', this.mydata);
      this.integradorService
        .autenticarLogin(this.mydata)
        .subscribe((data: any) => {
          this.loading = false;

          if (data.exito) {
            this.mys.saveUsuario(data).subscribe((result) => {
              result
                ? this.router.navigateByUrl('/home')
                : console.log('Error al guardar el usiario');
            });
          } else {
            this.showNoLoginError = data.mensaje;
            this.mys.alertShow('Error!!', 'alert', data.mensaje);
          }
        });
    } else {
      if (forma.controls.usuario.errors) {
        this.mys.alertShow(
          'Error!!',
          'alert',
          'Verifique el correo e intente nuevamente..'
        );
      } else if (forma.controls.password.errors) {
        this.mys.alertShow(
          'Error!!',
          'alert',
          'Verifique la clave e intente nuevamente..'
        );
      }
    }
  }

  myKeyUp(campo) {
    this.showUsuarioError = false;
    this.showNoLoginError = '';
  }

  irAregistro() {
    this.router.navigateByUrl('/my-data');
    // console.log('Redirigiendo de login a Registro...');
  }

  irAolvidoCntrasena() {
    this.router.navigateByUrl('/recover-password');
    // console.log('Redirigiendo de login a Olvidó contraseña...');
  }

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
}
