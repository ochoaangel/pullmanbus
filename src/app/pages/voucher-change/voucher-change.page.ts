import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IntegradorService } from 'src/app/service/integrador.service';
import * as jsPDF from 'jspdf';
import { File, IWriteOptions } from "@ionic-native/file/ngx";
import { FileTransfer, FileTransferObject } from "@ionic-native/file-transfer/ngx";
import { FileOpener } from "@ionic-native/file-opener/ngx";
import { Platform } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { MyserviceService } from 'src/app/service/myservice.service';

@Component({
  selector: 'app-voucher-change',
  templateUrl: './voucher-change.page.html',
  styleUrls: ['./voucher-change.page.scss'],
})
export class VoucherChangePage implements OnInit {
  loading = 0;
  isApp;
  ticketChange = null;
  constructor(
    private platform: Platform,
    private mys: MyserviceService,
    private router: Router
  ) {
    this.ticketChange = this.mys.ticketChange;
    if(this.ticketChange === null){
      this.router.navigateByUrl('/home');  
    }
    //this.loading++;
    console.log(this.ticketChange)
  }
  ngOnInit() {
    if (window.location.port === '8100' && !this.platform.is('cordova')) {
      this.isApp = false;
    } else {
      this.isApp = true;
    }
  }
  downloadPDF() {
    const linkSource = 'data:application/pdf;base64,' + this.ticketChange.archivo.archivo;
    const downloadLink = document.createElement("a");
    const fileName = this.ticketChange.archivo.nombre;
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }
}