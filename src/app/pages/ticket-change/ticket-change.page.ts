import { Component, OnInit } from '@angular/core';
import { MyserviceService } from 'src/app/service/myservice.service';
import { IntegradorService } from 'src/app/service/integrador.service';
import { Router } from '@angular/router';
import * as moment from 'moment';


@Component({
  selector: 'app-ticket-change',
  templateUrl: './ticket-change.page.html',
  styleUrls: ['./ticket-change.page.scss'],
})
export class TicketChangePage implements OnInit {

  compra
  existeBoleto
  loading = 0

  myData = {
    email: '',
    rut: '',
    emaili: '',
    ruti: '',
    fecha: '',
    hora: '',
    boleto: 'INT073207',
    acuerdo: false
  }

  constructor(
    private mys: MyserviceService,
    private integrador: IntegradorService,
    private router: Router
  ) {
    this.compra = 'ventanilla'   //  internet ó ventanilla
    this.existeBoleto = null
  }

  ngOnInit() {

    let actual = moment()
    console.log('actual',actual.toISOString());

    let tope = actual.subtract(4,'days')
    console.log('tope',tope.toISOString());


  }


  consultar() {
    console.log('this.myData', this.myData);

    this.existeBoleto = null


    if (this.myData.boleto) {
      this.loading++
      this.integrador.canjeValidar({ boleto: this.myData.boleto + "" }).subscribe((validado: any) => {
        this.loading--


        if (validado.exito) {

          this.loading++
          this.integrador.canjeBuscarInfoBoleto({ boleto: this.myData.boleto + "" }).subscribe((infoBoleto: any) => {
            this.loading--

            let estado = infoBoleto.estadoActualDescripcion

            if (estado === 'IDA' || estado === 'ENTREGADO') {
              console.log('es IDA o entregado');

              

              this.existeBoleto = infoBoleto
              this.compra = infoBoleto.tipoCompra === 'INT' ? 'internet' : 'ventanilla';






            } else {
              this.mys.alertShow('Error!!', 'alert', validado.mensaje || 'El boleto no es de ida o no se ha entregado..')
            }



          })



        } else {
          this.mys.alertShow('Error!!', 'alert', validado.mensaje || 'No se puede validar el estado del boleto..')
        }

      })


    } else {
      this.mys.alertShow('Error!!', 'alert', 'Ingrese in boleto válido para consultar..')
    }

  }

  cambiar(forma) {
    console.log('forma', forma);
    this.mys.alertShow('Error!!', 'alert', 'En desarrollo.. ')

  }


}
