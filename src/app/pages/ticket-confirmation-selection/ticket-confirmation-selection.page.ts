import { Component, OnInit, ViewChild, ElementRef, Renderer } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import * as _ from 'underscore';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { MyserviceService } from 'src/app/service/myservice.service';
import { IntegradorService } from 'src/app/service/integrador.service';
import { PopoverController } from '@ionic/angular';
import { PopMenuComponent } from 'src/app/components/pop-menu/pop-menu.component';
import { PopCartComponent } from 'src/app/components/pop-cart/pop-cart.component';

@Component({
  selector: 'app-ticket-confirmation-selection',
  templateUrl: './ticket-confirmation-selection.page.html',
  styleUrls: ['./ticket-confirmation-selection.page.scss'],
})
export class TicketConfirmationSelectionPage implements OnInit {

  ticket;
  showSelection = false;
  mySelection = '';
  allOrigin = [];
  allDestiny = [];

  myOrigin;
  myDestiny;

  selectOrigin;
  selectDestiny;

  inputFiltrado;
  inputFuente;

  loading = false;

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    public mys: MyserviceService,
    private integradorService: IntegradorService,
    private popoverCtrl: PopoverController,
    private renderer: Renderer,
  ) {
    this.loading = false;
  }
  ngOnInit() {
    console.log(this.mys.confirmSelection)
    if(this.mys.confirmSelection != null){
      this.getCityOrigin();
    }else{
      this.router.navigateByUrl('/ticket-management');
    }
  }
  ionViewWillEnter() {
    this.myOrigin = null;
    this.myDestiny = null;
  }
  getCityOrigin() {
    this.loading = true;
    let search = {     
      "origen": this.mys.confirmSelection.origen,
      "destino": this.mys.confirmSelection.destino,
      "idIntegrador": this.mys.confirmSelection.idIntegrador
    }
    console.log("Busca Origen" + search)
    this.integradorService.getCityOriginConfirmation(search).subscribe(data => {
      this.loading = false;
      this.allOrigin = data;
      this.inputFuente = data;
      this.inputFiltrado = data;
    });
  }
  getCityDestination(value: string) {
    this.loading = true;
    let search = {     
      "origen": this.mys.confirmSelection.origen,
      "destino": this.mys.confirmSelection.destino,
      "idIntegrador": this.mys.confirmSelection.idIntegrador,
    }
    this.integradorService.getCityOriginConfirmation(search).subscribe(data => {
      this.loading = false;
      this.allDestiny = data;
      this.inputFuente = data;
      this.inputFiltrado = data;
    });
  }
  changeOrigin(value: string) {
    this.allDestiny = [];
    this.getCityDestination(value);
    this.selectDestiny = null;
  }
  btnSearch() {
    // Verifico datos requeridos y redirijo a "pasaje ida"
    if (!this.myOrigin) {
      this.mys.alertShow('Verifique', 'alert', 'Seleccione un origen<br> Intente nuevamente..');
    } else if (!this.myDestiny) {
      this.mys.alertShow('Verifique', 'alert', 'Seleccione un destino<br> Intente nuevamente..');
    } else {
      let paraConfirmarBoleto = {
        form: this.mys.confirmSelection.form,
        obtenerServicio: {
          destino: this.myDestiny.codigo,
          fecha: this.mys.confirmSelection.fecha,
          hora: '0000',
          idSistema: 1,
          origen: this.myOrigin.codigo,
        },
        filtros: {
          claseFiltro : this.mys.confirmSelection.claseFiltro,
          clase: this.mys.confirmSelection.clase,
          empresa: this.mys.confirmSelection.empresa
        }
      };
      console.log('paraConfirmarBoleto desdeticketConfirmation', paraConfirmarBoleto);
      this.mys.confirm = paraConfirmarBoleto;
      this.mys.confirmSelected = null;
      this.router.navigateByUrl('/confirm-seat');
    }
  }

  teclaInput($event) {
    if ($event.target.value.length === 0) {
      this.inputFiltrado = this.inputFuente;
    } else {
      let filtradox = [];
      let minuscula1 = $event.target.value.toLowerCase().trim();
      this.inputFuente.forEach(element => {
        let minuscula2 = element.nombre.toLowerCase().trim();
        minuscula2.includes(minuscula1) ? filtradox.push(element) : null;
      });
      this.inputFiltrado = filtradox;
    }
  }
  btnSelecccionarOrigen() {
    this.inputFuente = this.allOrigin;
    this.inputFiltrado = this.allOrigin;
    this.mySelection = 'origin';
    this.showSelection = true;
  }
  btnSelecccionarDestino() {
    this.showSelection = true;
    this.mySelection = 'destiny';
  }
  seleccion(item) {
    if (this.mySelection === 'origin') {
      this.showSelection = false;
      this.mySelection = '';
      this.myOrigin = item;
      this.getCityDestination(item.codigo);
    } else {
      this.showSelection = false;
      this.mySelection = '';
      this.myDestiny = item;
    }
    this.cambioOrigenDestinoIda();
  }
  atras() {
    if (this.showSelection) {
      this.showSelection = false;
      this.mySelection = '';
    } else {
      this.showSelection = false;
      this.mySelection = '';
      this.router.navigateByUrl('/ticket-management');
    }
  }
  cambioOrigenDestinoIda() {
    if (this.myOrigin && this.myDestiny) {
      let params = {
        origen: this.myOrigin.codigo,
        destino: this.myDestiny.codigo
      };
    }
  }
}