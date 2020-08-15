import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IntegradorService } from 'src/app/service/integrador.service';
import * as jsPDF from 'jspdf';
import { File, IWriteOptions } from "@ionic-native/file/ngx";
import { FileTransfer, FileTransferObject } from "@ionic-native/file-transfer/ngx";
import { FileOpener } from "@ionic-native/file-opener/ngx";
import { Platform } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { MyserviceService } from 'src/app/service/myservice.service';

@Component({
  selector: 'app-transaction-voucher',
  templateUrl: './transaction-voucher.page.html',
  styleUrls: ['./transaction-voucher.page.scss'],
})
export class TransactionVoucherPage implements OnInit {
  fileTransfer: FileTransferObject;
  codigo;
  respPDF = null;
  postComprobante = null;
  loading = 0;
  encabezado: any;
  isApp;

  constructor(
    private integradorService: IntegradorService,
    private activatedRoute: ActivatedRoute,
    private fileOpener: FileOpener,
    private transfer: FileTransfer,
    private file: File,
    private platform: Platform,
    private androidPermissions: AndroidPermissions,
    private mys: MyserviceService

  ) {
    this.codigo = this.activatedRoute.snapshot.paramMap.get('codigo');
    this.loading += 1;
    this.integradorService.buscarEncabezado({ "orden": this.codigo }).subscribe((resp: any) => {
      this.loading -= 1;
      this.encabezado = resp;
      if (this.encabezado.estado == 'ACTI') {
        this.encabezado.fechaCompra = new Date(this.encabezado.fechaCompra).toLocaleString();
      }
    });
  }

  ngOnInit() {
    if (window.location.port === '8100' && !this.platform.is('cordova')) {
      this.isApp = false;
    } else {
      this.isApp = true;
    }
  }

  downloadPDF() {
    const linkSource = 'data:application/pdf;base64,' + this.respPDF.archivo;
    const downloadLink = document.createElement("a");
    const fileName = this.respPDF.nombre;
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }

  btnDescargaPasaje(boleto: string, codigo: string) {
    this.postComprobante = { boleto, codigo };
    this.loading += 1;
    this.integradorService.generarComprobante(this.postComprobante).subscribe(resp => {
      this.respPDF = resp;
      this.loading -= 1;
      this.downloadPDF();
    });
  }

}

