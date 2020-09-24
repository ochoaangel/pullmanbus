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
  mydata = { usuario: '', password: '' };
  showUsuarioError = false;
  showNoLoginError = '';
  loading = false;

  constructor(
    private integradorService: IntegradorService,
    private router: Router,
    private nativeStorage: NativeStorage,
    public platform: Platform,
    public mys: MyserviceService,
    private popoverCtrl: PopoverController
  ) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.mys.checkIfExistUsuario().subscribe((exist) => {
      exist
        ? this.router.navigateByUrl('/user-panel')
        : console.log('No existe usuario logeado..');
    });
  }

  enviar() { }

  validar(forma) {
    forma.controls.usuario.invalid ? (this.showUsuarioError = true) : null;

    if (forma.valid) {
      this.loading = true;
      this.integradorService
        .autenticarLogin(this.mydata)
        .subscribe((data: any) => {
          this.loading = false;
          if (data.exito) {
            this.mys.saveUsuario(data).subscribe((result) => {
              if(result){                
                this.mys.getUser().subscribe(usuario => {                  
                  if(usuario.usuario.estado === 'NEW'){
                    this.router.navigateByUrl('/my-data')
                  }else if(usuario.usuario.estado === 'ACT'){
                    this.router.navigateByUrl('/home')
                  }
                })                
              }else{
                console.log('Error al guardar el usiario');
              }
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
  }

  irAolvidoCntrasena() {
    this.router.navigateByUrl('/recover-password');
  }

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
}
