import { Component, OnInit } from '@angular/core';
import { MyserviceService } from '../service/myservice.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { IntegradorService } from '../service/integrador.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  options = { initialSlide: 0, slidesPerView: 1, autoplay: true, speed: 4000 };
  carrusel = [];

  showMenu1 = true;
  showMenu2 = false;

  constructor(
    private mys: MyserviceService,
    public alertController: AlertController,
    public router: Router,
    private integradorService: IntegradorService

  ) {


  }

  urlPerfil = '';

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.integradorService.buscarCarrusel().subscribe(resp => {
      this.carrusel = resp;
    });
  }

  ionViewWillEnter() {
    this.mys.checkIfExistUsuario().subscribe((logeado: any) => {
      if (logeado) {
        this.urlPerfil = '/user-panel';
      } else {
        this.urlPerfil = '/login';
      }
    });

  }


  irPerfil() {
    this.router.navigateByUrl(this.urlPerfil || '/login');
  }

  mostrarMenu1() {
    this.showMenu1 = true;
    this.showMenu2 = false;
  }

  mostrarMenu2() {
    this.showMenu1 = false;
    this.showMenu2 = true;
  }

}
