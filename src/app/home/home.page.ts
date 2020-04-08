import { Component } from '@angular/core';
import { MyserviceService } from '../service/myservice.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  options = { initialSlide: 0, slidesPerView: 1, autoplay: true, speed: 4000 };

  constructor(
    private mys: MyserviceService,
    public alertController: AlertController,
    public router: Router

  ) { }


  irPerfil() {

    this.mys.checkIfExistUsuario().subscribe((logeado: any) => {
      if (logeado) {
        this.router.navigateByUrl('/user-panel')
      } else {
        this.router.navigateByUrl('/login')
      }
    })


  }

}
