import { Component, OnInit } from '@angular/core';
import { IntegradorService } from 'src/app/service/integrador.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-agencies',
  templateUrl: './agencies.page.html',
  styleUrls: ['./agencies.page.scss'],
})
export class AgenciesPage implements OnInit {
  all;
  loading = 0;
  constructor(private integrador: IntegradorService) {
  }
  ngOnInit() {
    this.loading++;
    this.integrador.buscarRegionesRegistroDeUsuario().subscribe(resp => {
      this.loading--;
      this.all = resp;
      this.all.forEach(x => {
        x.ncodigo = parseInt(x.codigo);
      });
      this.all = _.sortBy(this.all, 'ncodigo');
      this.all.forEach(element => {
        element['show'] = false;
        this.loading++;
        this.integrador.buscarCiudadPorRegionesRegistroDeUsuario({ codigo: element.codigo }).subscribe(ciudades => {
          this.loading--;
          ciudades.forEach(item => {
            item.show = false;
          })
          element['ciudades'] = ciudades;
        })
      });
    });
  }
  ocultarTodo() {
    this.all.forEach(element => {
      element['show'] = false;
    });
  }
  clickItem(n) {
    if (this.all[n]['show']) {
      this.all[n]['show'] = false;
    } else {
      this.ocultarTodo()
      this.all[n]['show'] = true;
    }
  }

  clickItemDetail(item, ciudad) {
    if (ciudad.show) {
      ciudad.show = false;
    } else {
      item.ciudades.forEach(element => { element.show = false; });
      ciudad.show = true;
      if (ciudad.agencies === undefined) {
        this.loading++;
        this.integrador.getAgenciesPorCiudad(ciudad.codigo).subscribe(agencias => {
          this.loading--;

          ciudad.agencies = agencias.filter(x =>
            (x.Descripcion !== 'SIN DESCRIPCION' && x.Descripcion !== '0') &&
            (x.Direccion !== 'SIN DESCRIPCION' && x.Direccion !== '0') &&
            (x.agencias !== 'SIN DESCRIPCION' && x.agencias !== '0') &&
            (x.Agente !== 'SIN DESCRIPCION' && x.Agente !== '0') &&
            (x.Fono !== 'SIN DESCRIPCION' && x.Fono !== '0')
          );
          console.log(ciudad.agencies);
        });
      }
    }
  }
}