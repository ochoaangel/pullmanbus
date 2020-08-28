import { Component, OnInit } from '@angular/core';
import { IntegradorService } from 'src/app/service/integrador.service';
// import { map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-agreements',
  templateUrl: './agreements.page.html',
  styleUrls: ['./agreements.page.scss'],
})
export class AgreementsPage implements OnInit {

  all;
  constructor(
    private integrador: IntegradorService

  ) { }

  ngOnInit() {
    this.integrador.getListConvenio().subscribe(resp => {
      this.all = resp;
      this.all = this.all.map(x => {
        let end = {};
        end['img'] = x.imagenCarrusel;
        end['title'] = x.convenio.descripcion;
        //end['description'] = x.portalConvInformacionI18ns.filter(y => y.i18n === 'es')[0]['descripcion'] || null;

        return end;
      });
    })
  }

}
