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
  // en app router module
  // path: 'transaction-voucher/:codigo',

  fileTransfer: FileTransferObject
  // fileTransfer: FileTransferObject = this.transfer.create();


  codigo
  respPDF = null
  postComprobante = null
  loading = 0
  encabezado: any;
  isApp

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
    this.loading += 1
    this.integradorService.buscarEncabezado({ "orden": this.codigo }).subscribe((resp: any) => {
      this.loading -= 1
      this.encabezado = resp;
      this.postComprobante = { boleto: resp.boletos[0].boleto, codigo: resp.boletos[0].codigo }
      console.log('this.postComprobante', this.postComprobante);
      console.log(resp);
      
      
      this.loading += 1
      this.integradorService.generarComprobante(this.postComprobante).subscribe(resp => {
        this.respPDF = resp
        this.loading -= 1
        console.log( this.respPDF);
      })

    })
  }

  ngOnInit() {

    console.log('this.platform.platforms()',this.platform.platforms());
    console.log('this.platform.is("android")',this.platform.is('android'));

    if (window.location.port === '8100' && !this.platform.is('cordova') ) {
      this.isApp= false
		} else {
      this.isApp= true
    }
    console.log('this.isApp',this.isApp);
    
// android	a device running Android
// capacitor	a device running Capacitor
// cordova	a device running Cordova
// desktop	a desktop device
// electron	a desktop device running Electron
// hybrid	a device running Capacitor or Cordova
// ios	a device running iOS
// ipad	an iPad device
// iphone	an iPhone device
// mobile	a mobile device
// phablet	a phablet device
// pwa	a PWA app
// tablet	a tablet device




  }
  // http://localhost:8100/#/transaction-voucher/LQN64693497

  btnDescargaPasaje() {


    if (!this.isApp) {

      const linkSource = 'data:application/pdf;base64,' + this.respPDF.archivo
      const downloadLink = document.createElement("a");
      const fileName = this.respPDF.nombre

      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
      // this.mys.alertShow('Listo!', 'md-archive', 'Boleto descargado..')
      
    } else {
      
      this.platform.ready().then(() => {
  
        
  
        if (this.postComprobante && this.respPDF) {
  
          this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
            .then(status => {
              if (status.hasPermission) {
                console.log('tiene permiso READ_EXTERNAL_STORAGE');
                // this.guardarAbrirPdf(this.crearPdf())        //caso Crear PDF desde cero
                this.saveAndOpenPdf(this.respPDF.archivo, this.respPDF.nombre)
              } else {
                console.log('NO tiene permiso READ_EXTERNAL_STORAGE');
                alert('SOLICITUD DE PERMISO:  \n\nEs necesario dar permisos de Almacenamiento...  \n\n Acepte y presione "permitir" para continuar');
                this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
                  .then(status2 => {
                    console.log('Solicita permiso READ_EXTERNAL_STORAGE');
                    if (status2.hasPermission) {
                      console.log('Se otorgó permiso READ_EXTERNAL_STORAGE');
                      // this.guardarAbrirPdf(this.crearPdf())         //caso Crear PDF desde cero
                      this.saveAndOpenPdf(this.respPDF.archivo, this.respPDF.nombre)
                    } else {
                      console.log('No se otorgó permiso READ_EXTERNAL_STORAGE');
                      this.mys.alertShow('Error!', 'alert', 'Debe aceptar los permisos solicitados para continuar, intente nueamente..');
                    }
                  });
              }
            });
            
        } else {
          this.mys.alertShow('Error!', 'alert', 'error al adquirir datos..')
        }
      })
    }

  }

  saveAndOpenPdf(pdf: string, fileName: string) {
    // const writeDirectory = this.file.dataDirectory
    let folder = this.platform.is('ios') ? this.file.dataDirectory : `Documents`
    let writeDirectory = this.platform.is('ios') ? this.file.dataDirectory : `${this.file.externalRootDirectory}${folder}`;
    let my_path = this.platform.is('ios') ? `${writeDirectory}${fileName}` : `${writeDirectory}/${fileName}`
    this.file.writeFile(writeDirectory, fileName, this.convertBase64ToBlob(pdf, 'data:application/pdf;base64'), { replace: true })
      .then((success) => {
        // console.log("Archivo creado detalles >> " + JSON.stringify(success))
        this.fileOpener.open(my_path, 'application/pdf')
          .then(() => this.mys.alertShow('GUARDADO EN EL DISPOSITIVO', 'md-archive', `Archivo: ${fileName} <br><br>Carpeta: ${folder} <br><br> Ubicación exacta:<br>${my_path}`))
          .catch(e => this.mys.alertShow('Error!', 'alert', 'No se pudo Abrir el archivo en su dispositivo..'))
      })
      .catch((error) => this.mys.alertShow('Error!', 'alert', 'No se pudo crear en archivo..'))
  }

  convertBase64ToBlob(b64Data, contentType): Blob {
    contentType = contentType || '';
    const sliceSize = 512;
    b64Data = b64Data.replace(/^[^,]+,/, '');
    b64Data = b64Data.replace(/\s/g, '');
    const byteCharacters = window.atob(b64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
  }


  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  // original funciona con  this.guardarAbrirPdf(this.crearPdf())
  crearPdf(): any {
    // original funciona con  this.guardarAbrirPdf(this.crearPdf())


    let doc = new jsPDF({ orientation: 'p', unit: 'cm', format: 'letter' })
    let margen = 1.5
    let colorRojo = '#990000'
    let colorAzul = '#000099'
    let colorNegro = '#000000'
    let colorBlanco = '#FFFFFF'

    // console.log(doc.getImageProperties(this.myImage))
    // let info = doc.getImageProperties(this.myImage)
    // let factor=0.002
    // doc.addImage(this.myImage, info.fileType, 1.5, 1, info.width*factor, info.height*factor, '', 'FAST', 0)
    //////////////////////////////////////////////////////////////////////////
    doc.setTextColor(colorNegro)
    doc.setFontSize(10)
    doc.text(15, 1.5, 'BOLETO ELECTRÓNICO')
    //////////////////////////////////////////////////////////////////////////
    doc.setTextColor(colorNegro)
    doc.setFontSize(10)
    doc.text(1.5, 2, 'PULLMAN BUS')
    //////////////////////////////////////////////////////////////////////////
    doc.setTextColor(colorNegro)
    doc.setFontSize(10)
    doc.text(margen, 3.5, 'Recuerde llevar este boleto impreso. Es obligatorio tener el boleto impreso para subir al bus.')
    //////////////////////////////////////////////////////////////////////////
    doc.setLineWidth(0.01)
    doc.rect(4, 5, 13, 7)
    doc.setTextColor(colorRojo)
    doc.setFontSize(12)
    doc.text(margen, 4.5, 'Datos del Servicio')
    //////////////////////////////////////////////////////////////////////////
    doc.setTextColor(colorNegro)
    doc.setFontSize(10)
    let separacionY = 0.5
    let yini = 5.5
    let xini = 5
    doc.text(xini, yini += separacionY, 'CLIENTE')
    doc.text(xini, yini += separacionY, 'TERMINAL DE ORIGEN')
    doc.text(xini, yini += separacionY, 'TERMINAL DE DESTINO')
    doc.text(xini, yini += separacionY, 'FECHA DE VIAJE')
    doc.text(xini, yini += separacionY, 'HORA DE VIAJE')
    doc.text(xini, yini += separacionY, 'ASIENTO')
    doc.text(xini, yini += separacionY, 'SERVICIO')
    doc.text(xini, yini += separacionY, 'VALOR PAGADO')
    doc.text(xini, yini += separacionY, 'MEDIO DE PAGADO')
    doc.text(xini, yini += separacionY, 'CÓDIGO')
    doc.text(xini, yini += separacionY, 'BOLETO')
    doc.text(xini, yini += separacionY, 'PISO')
    yini = 5.5
    xini = 12
    doc.text(xini, yini += separacionY, 'rarevalo@gestsol.cl')
    doc.text(xini, yini += separacionY, 'BORJA TERMINAL')
    doc.text(xini, yini += separacionY, 'ARICA')
    doc.text(xini, yini += separacionY, '30/01/2020 JUEVES')
    doc.text(xini, yini += separacionY, '23:00 de la Noche')
    doc.text(xini, yini += separacionY, '31')
    doc.text(xini, yini += separacionY, 'SEMI CAMA(42)')
    doc.text(xini, yini += separacionY, '$22000')
    doc.text(xini, yini += separacionY, 'WBPAY')
    doc.text(xini, yini += separacionY, 'RKR64693192')
    doc.text(xini, yini += separacionY, 'INT071771')
    doc.text(xini, yini += separacionY, '2')
    //////////////////////////////////////////////////////////////////////////
    doc.setTextColor(colorRojo)
    doc.setFontSize(12)
    doc.text(margen, 13, 'Condiciones del Servicio')
    //////////////////////////////////////////////////////////////////////////
    doc.setTextColor(colorNegro)
    doc.setFontSize(8)
    separacionY = 0.3
    yini = 13.3
    xini = 1.5
    doc.text(xini, yini += separacionY, 'Válido para la fecha y hora señalada.')
    doc.text(xini, yini += separacionY, 'Anulaciones: Boleto sólo se puede anular por internet, la anulación se aceptará hasta 4 horas antes del viaje y se ')
    doc.text(xini, yini += separacionY, 'devolverá el 85% del valor del pasaje (Art.67 D.S 212/92 MTT) ')
    doc.text(xini, yini += separacionY, 'Transporte de equipaje libre de pago (según D.S 212/92 MTT):')
    doc.text(xini, yini += separacionY, 'En el interior del bus: 1 bolso de mano de uso personal')
    doc.text(xini, yini += separacionY, 'En la maletera del bus: 1 maleta o bolso que no supere los 30 kgs. o los 18 decímetros Cúbicos')
    doc.text(xini, yini += separacionY, 'Si el valor de su equipaje excede las 5 UTM, es su obligación declararlo previamente en la oficina de origen (Art. 70 D.S 212/92 MTT)')
    doc.text(xini, yini += separacionY, 'La empresa no se hace responsable por pérdidas que puedan ocurrir al interior del bus. ')
    doc.text(xini, yini += separacionY, 'Para consultas puede llamar a nuestro Call Center al 600 600 0018 de lunes a domingo de 08:00 a 21:00 horas')
    //////////////////////////////////////////////////////////////////////////
    doc.setTextColor(colorRojo)
    doc.setFontSize(12)
    doc.text(15, 17.5, 'Copia Cliente')
    //////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////

    doc.line(1.2, 18, 20, 18)
    doc.roundedRect(1.3, 18.5, 19, 7, 0.5, 0.5, 'S')
    //////////////////////////////////////////////////////////////////////////
    doc.setTextColor(colorNegro)
    doc.setFontSize(10)
    doc.text(9, 19, 'Código de seguridad')
    doc.text(10, 21, '5709')
    doc.text(9.5, 21.5, 'INT071771')
    //////////////////////////////////////////////////////////////////////////


    doc.setTextColor(colorNegro)
    doc.setFontSize(10)
    separacionY = 0.5
    yini = 22
    xini = 2
    doc.text(xini, yini += separacionY, 'SERVICIO:')
    doc.text(xini, yini += separacionY, 'FECHA:')
    doc.text(xini, yini += separacionY, 'HORA DE VIAJE:')
    doc.text(xini, yini += separacionY, 'ORIGEN:')
    doc.text(xini, yini += separacionY, 'DESTINO:')
    doc.text(xini, yini += separacionY, 'PISO:')
    yini = 22
    xini = 6
    doc.text(xini, yini += separacionY, 'BU809')
    doc.text(xini, yini += separacionY, '30/01/2020')
    doc.text(xini, yini += separacionY, '23:00 de la Noche')
    doc.text(xini, yini += separacionY, 'MA')
    doc.text(xini, yini += separacionY, 'A3')
    doc.text(xini, yini += separacionY, '2')

    yini = 22
    xini = 11
    doc.text(xini, yini += separacionY, 'T. ORIGEN:')
    doc.text(xini, yini += separacionY, 'T. DESTINO:')
    doc.text(xini, yini += separacionY, 'A PAGAR:')
    doc.text(xini, yini += separacionY, 'CLASE:')
    doc.text(xini, yini += separacionY, 'ASIENTO:')
    yini = 22
    xini = 15
    doc.text(xini, yini += separacionY, 'BORJA TERMINAL')
    doc.text(xini, yini += separacionY, 'ARICA')
    doc.text(xini, yini += separacionY, '22000')
    doc.text(xini, yini += separacionY, 'SEM42')
    doc.text(xini, yini += separacionY, '31')
    //////////////////////////////////////////////////////////////////////////
    doc.setTextColor(colorRojo)
    doc.setFontSize(12)
    doc.text(15, 26, 'Copia Empresa')

    return doc.output()
  }
  guardarAbrirPdf(doc) {
    // original funciona con  this.guardarAbrirPdf(this.crearPdf())
    let pdfOutput = doc

    let buffer = new ArrayBuffer(pdfOutput.length);
    let array = new Uint8Array(buffer);
    for (var i = 0; i < pdfOutput.length; i++) { array[i] = pdfOutput.charCodeAt(i) }

    // const folder = 'Download'
    const folder = 'Documents'
    const writeDirectory = this.file.externalRootDirectory + folder

    const fileName = 'Ticket_' + Date.now() + ".pdf";
    let my_path = writeDirectory + '/' + fileName

    this.file.writeFile(writeDirectory, fileName, buffer, { replace: true })
      .then((success) => {
        // console.log("Archivo creado detalles >> " + JSON.stringify(success))
        this.fileOpener.open(my_path, 'application/pdf')
          .then(() => this.mys.alertShow('GUARDADO EN EL DISPOSITIVO', 'md-archive', `Archivo: ${fileName} <br><br>Carpeta: ${folder} <br><br> Ubicación exacta:<br>${my_path}`))
          .catch(e => this.mys.alertShow('Error!', 'alert', 'No se pudo Abrir el archivo en su dispositivo..'))
      })
      .catch((error) => this.mys.alertShow('Error!', 'alert', 'No se pudo crear en archivo..'))
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////


}
