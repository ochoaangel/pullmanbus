import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IntegradorService } from 'src/app/service/integrador.service';

@Component({
  selector: 'app-transaction-voucher',
  templateUrl: './transaction-voucher.page.html',
  styleUrls: ['./transaction-voucher.page.scss'],
})
export class TransactionVoucherPage implements OnInit {

  encabezado:any;
  constructor(
    private integradorService: IntegradorService,
    private activatedRoute: ActivatedRoute,
  ) { 
    let codigo = this.activatedRoute.snapshot.paramMap.get('codigo');
    this.integradorService.buscarEncabezado({"orden":codigo}).subscribe(resp=>{
      this.encabezado=resp;
      console.log(resp);
    })
  }

  ngOnInit() {
  }

}
