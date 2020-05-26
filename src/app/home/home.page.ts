import { Component, OnInit } from '@angular/core';
import { MyserviceService } from '../service/myservice.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  options = { initialSlide: 0, slidesPerView: 1, autoplay: true, speed: 4000 };

  constructor(
    private mys: MyserviceService,
    public alertController: AlertController,
    public router: Router

  ) {


  }

  urlPerfil = ''

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

  }

  ionViewWillEnter() {
    this.mys.checkIfExistUsuario().subscribe((logeado: any) => {
      if (logeado) {
        this.urlPerfil = '/user-panel'
      } else {
        this.urlPerfil = '/login'
      }
    })

  }


  irPerfil() {
    this.router.navigateByUrl(this.urlPerfil || '/login')
  }

}
