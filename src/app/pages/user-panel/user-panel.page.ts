import { Component, OnInit } from '@angular/core';
import { MyserviceService } from 'src/app/service/myservice.service';
import { Router } from '@angular/router';
import { PopMenuComponent } from 'src/app/components/pop-menu/pop-menu.component';
import { PopCartComponent } from 'src/app/components/pop-cart/pop-cart.component';
import { PopoverController, NavController } from '@ionic/angular';
import { Location } from '@angular/common';




@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.page.html',
  styleUrls: ['./user-panel.page.scss'],
})
export class UserPanelPage implements OnInit {

  nombre = ''
  loading = false

  constructor(private mys: MyserviceService,
    private router: Router,
    private popoverCtrl: PopoverController,
    private navCtrl: NavController,
    private location: Location,


  ) { }

  ngOnInit() { }

  ionViewWillEnter() {

    this.mys.checkIfExistUsuario().subscribe(exist => {
      exist ? null : this.router.navigateByUrl('/login');
    })

    this.loading = true
    this.mys.getUser().subscribe(usuario => {
      usuario ? null : this.router.navigateByUrl('/login')
      this.loading = false
      if (usuario.usuario.nombre && usuario.usuario.apellidoPaterno) {
        this.nombre = usuario.usuario.nombre + ' ' + usuario.usuario.apellidoPaterno
      } else {
        this.nombre = 'Usuario'
      }

    })
  }

  async popMenu(event) {
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
        })
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
      cssClass: "popCart"
    });
    await popoverCart.present();

    // recibo la variable desde el popover y la guardo en data
    // const { data } = await popoverCart.onWillDismiss();
    // this.router.navigateByUrl(data.destino);
  }

  cerrarSesion() {
    this.mys.closeSessionUser().subscribe(data => {
      this.mys.alertShow('Éxito!!', 'checkmark-circle', 'Sesión cerrada exitosamente..')
      this.router.navigateByUrl('/login')
    })
  }


}
