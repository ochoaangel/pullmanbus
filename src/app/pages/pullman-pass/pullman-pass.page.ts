import { Component, OnInit } from '@angular/core';
import { IntegradorService } from 'src/app/service/integrador.service';

@Component({
  selector: 'app-pullman-pass',
  templateUrl: './pullman-pass.page.html',
  styleUrls: ['./pullman-pass.page.scss'],
})
export class PullmanPassPage implements OnInit {


  constructor(
    private integrador: IntegradorService
  ) { }

  all;

  ngOnInit() {
    this.integrador.getFaq().subscribe(resp => {
      this.all = resp;

      this.all.forEach(element => {
        element['show'] = false;
      });


      // console.log('this.all', this.all);
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
