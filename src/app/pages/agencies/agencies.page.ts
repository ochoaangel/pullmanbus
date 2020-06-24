import { Component, OnInit } from '@angular/core';
import { IntegradorService } from 'src/app/service/integrador.service';
import * as _ from 'underscore';
import * as moment from 'moment';

@Component({
  selector: 'app-agencies',
  templateUrl: './agencies.page.html',
  styleUrls: ['./agencies.page.scss'],
})
export class AgenciesPage implements OnInit {

  constructor(
    private integrador: IntegradorService
  ) { }

  all;

  ngOnInit() {
    console.log('iniciando preguntas');
    this.integrador.buscarRegionesRegistroDeUsuario().subscribe(resp => {

      // console.log('resp', resp);
      this.all = resp;

      this.all.forEach(x => {
        x.ncodigo = parseInt(x.codigo);
      });

      this.all = _.sortBy(this.all, 'ncodigo');


      this.all.forEach(element => {
        element['show'] = false;

        this.integrador.buscarCiudadPorRegionesRegistroDeUsuario({ codigo: element.codigo }).subscribe(ciudades => {
          element['ciudades'] = ciudades;
        })

      });


      console.log('this.all', this.all);
    });


  }

  ocultarTodo() {
    this.all.forEach(element => {
      element['show'] = false;
    });
  }

  // mostrar(n) {
  //   this.ocultarTodo();
  //   this.all[n]['show'] = true;
  // }

  clickItem(n) {

    if (this.all[n]['show']) {
      this.all[n]['show'] = false;
    } else {
      this.ocultarTodo()
      this.all[n]['show'] = true;
    }

  }

}
