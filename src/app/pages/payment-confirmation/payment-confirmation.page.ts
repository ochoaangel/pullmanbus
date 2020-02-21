import { Component, OnInit } from '@angular/core';

// import * as jsPDF from 'jspdf';

// import { File, IWriteOptions } from "@ionic-native/file/ngx";
// import { FileTransfer, FileTransferObject } from "@ionic-native/file-transfer/ngx";
// import { FileOpener } from "@ionic-native/file-opener/ngx";


@Component({
  selector: 'app-payment-confirmation',
  templateUrl: './payment-confirmation.page.html',
  styleUrls: ['./payment-confirmation.page.scss'],
})
export class PaymentConfirmationPage implements OnInit {

  // fileTransfer: FileTransferObject;
  constructor(
    // private fileOpener: FileOpener,
    // private transfer: FileTransfer,
    // private file: File
  ) { }

  ngOnInit() {
    this.generarPdf()
  }

  generarPdf() {
  }

}
