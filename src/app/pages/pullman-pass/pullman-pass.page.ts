import { Component, OnInit } from '@angular/core';
import { IntegradorService } from 'src/app/service/integrador.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pullman-pass',
  templateUrl: './pullman-pass.page.html',
  styleUrls: ['./pullman-pass.page.scss'],
})
export class PullmanPassPage implements OnInit {
  all;


  constructor(
    private integrador: IntegradorService,
    private router: Router,

  ) { }

  ngOnInit() {
    this.integrador.getFaq().subscribe(resp => {
      this.all = resp;
      this.all.forEach(element => {
        element['show'] = false;
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


  btnPullmanPass() {
    this.router.navigateByUrl('/my-data');
  }

}
